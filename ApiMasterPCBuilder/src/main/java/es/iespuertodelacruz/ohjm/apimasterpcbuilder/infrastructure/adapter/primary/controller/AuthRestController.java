package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller;


import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.globals.ErrGlobals;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.service.AuthService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.UserDetailsLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

class LoginDTO {
	private String nick;
	private String password;
	public String getNick() {
		return nick;
	}
	public void setNick(String nick) {
		this.nick = nick;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public LoginDTO() {}
}

class RegisterDTO extends LoginDTO {
	private String email;

	public RegisterDTO() { super();}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class AuthRestController {
	
	@Autowired
	AuthService authService;

	@Autowired
	IUserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterDTO request) {
		if (request != null) {
			UserDetailsLogin udl = new UserDetailsLogin();
			udl.setUsername(request.getNick());
			udl.setPassword(request.getPassword());
			udl.setEmail(request.getEmail());
			udl.setRole("ROLE_USER");
			authService.register(udl);

			return ResponseEntity.ok("Registered successfully");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You have not send anything");
		}
	}

	@PostMapping("/login")
	public ResponseEntity<String> authenticate(@RequestBody LoginDTO request) {
		UserDetailsLogin udl = new UserDetailsLogin();
		udl.setUsername(request.getNick());
		udl.setPassword(request.getPassword());
		
		
		
		String token = authService.authenticate(udl);
		if (token.equals(ErrGlobals.NOT_ACTIVE) || token.equals(ErrGlobals.INC_PASS_USR))
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(token);
		else
			return ResponseEntity.ok(token);
	}

	@GetMapping("/verify")
	public ResponseEntity<?> registerVerify(@RequestParam("usermail") String usermail, @RequestParam("hash") String hash) {
		User findByEmail = userService.findByEmail(usermail);
		if (findByEmail != null) {
			if (findByEmail.getHash().equals(hash)) {
				findByEmail.setActive((byte) 1);
				userService.save(findByEmail);
				return ResponseEntity.ok(findByEmail);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You shouldn't be here");
			}
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email incorrect");
		}
	}
}
