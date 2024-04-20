package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.service;


import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.globals.ErrGlobals;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.JwtService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.UserDetailsLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {
	@Autowired
	private IUserService userService;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtService jwtService;

	@Autowired
	private MailService mailService;

	public void register(UserDetailsLogin udl) {
		int numRnd = (int) (Math.random() * 100000000);
		String hash = passwordEncoder.encode(numRnd + "");
		User user = new User();
		user.setNick(udl.getUsername());
		user.setPassword(passwordEncoder.encode(udl.getPassword()));
		user.setRole(udl.getRole());
		user.setEmail(udl.getEmail());
		user.setHash(hash);

		User save = userService.save(user);
		UserDetailsLogin userDetails = new UserDetailsLogin();
		userDetails.setUsername(save.getNick());
		userDetails.setPassword(save.getPassword());
		userDetails.setEmail(save.getEmail());
		userDetails.setRole(save.getRole());
		mailService.send(save.getEmail(), "Please verify your email",
				"http://localhost:8080/api/v1/verify?usermail=" + save.getEmail() + "&hash=" + save.getHash());
	}

	public User registerV3(UserDetailsLogin udl) {
		int numRnd = (int) (Math.random() * 100000000);
		String hash = passwordEncoder.encode(numRnd + "");
		User user = new User();
		user.setNick(udl.getUsername());
		user.setPassword(passwordEncoder.encode(udl.getPassword()));
		user.setRole(udl.getRole());
		user.setEmail(udl.getEmail());
		user.setHash(hash);

		return user;
	}

	public String authenticate(UserDetailsLogin udl) {
		User userentity = userService.findByNick(udl.getUsername());
		UserDetailsLogin userlogin = null;
		if (userentity != null) {
			if (userentity.getActive() == 1) {
				if (passwordEncoder.matches(udl.getPassword(), userentity.getPassword())) {
					userlogin = new UserDetailsLogin();
					userlogin.setUsername(userentity.getNick());
					userlogin.setPassword(userentity.getPassword());
					userlogin.setRole(userentity.getRole());
				}
			} else {
				return ErrGlobals.NOT_ACTIVE;
			}
		}
		if (userlogin != null) {
			return jwtService.generateToken(userentity.getNick(), userentity.getRole());
		}
		return ErrGlobals.INC_PASS_USR;
	}
}