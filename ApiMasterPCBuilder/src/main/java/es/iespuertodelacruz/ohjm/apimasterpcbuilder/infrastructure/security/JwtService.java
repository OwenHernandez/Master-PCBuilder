package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

class KeyGenerator {
	private static KeyGenerator keyGenerator;
	private Key key;

	private KeyGenerator() {
		key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	}

	public static KeyGenerator getInstance() {
		if (keyGenerator == null)
			keyGenerator = new KeyGenerator();
		return keyGenerator;
	}

	public Key getKey() {
		return key;
	}
}

@Service
public class JwtService {
	private static final long DURACION_TOKEN = 24 * 60 * 60 * 1000;

	public JwtService() {
	}

	public String extractRole(String token) {
		Claims claims = extractAllClaims(token);
		String rol = (String) claims.get("authorities");
		return rol;
	}

	public String extractUsername(String token) {
		Claims claims = extractAllClaims(token);
		String subject = claims.getSubject();
		return subject;
	}

	public String generateToken(String username, String rol) {
		KeyGenerator keygenerator = KeyGenerator.getInstance();
		String token = Jwts.builder().claim("authorities", rol).setSubject(username).setExpiration(getExpirationDate())
				.signWith(keygenerator.getKey()).compact();
		return token;
	}

	public Claims getClaims(String token) throws ExpiredJwtException, MalformedJwtException {
		KeyGenerator keygenerator = KeyGenerator.getInstance();
		return Jwts.parserBuilder().setSigningKey(keygenerator.getKey()).build().parseClaimsJws(token).getBody();
	}

	private Date getExpirationDate() {
		return new Date(System.currentTimeMillis() + DURACION_TOKEN);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(KeyGenerator.getInstance().getKey()).build().parseClaimsJws(token)
				.getBody();
	}
}
