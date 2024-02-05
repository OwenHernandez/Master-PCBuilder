package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;

//@Configuration
public class ApplicationNoSecurity {
	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return (web) -> web.ignoring().requestMatchers("/**");
	}
}