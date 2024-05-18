package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.config;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.UserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.UserDetailsLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableScheduling
@EnableAsync
public class ApplicationConfig {
	@Autowired
	private UserService repository;

	@Bean
	public WebMvcConfigurer corsConfigurer() {
	        return new WebMvcConfigurer() {
	                @Override
	                public void addCorsMappings(CorsRegistry registry) {
	                        registry.addMapping("/**")
									.allowedMethods(CorsConfiguration.ALL)
									.allowedHeaders(CorsConfiguration.ALL)
									.allowedOriginPatterns(CorsConfiguration.ALL);
	                }

	        };
	}
	
	@Bean
	public UserDetailsService userDetailsService() {
		return username -> {
			User entity = repository.findByNick(username);
			UserDetailsLogin user = new UserDetailsLogin();
			user.setUsername(entity.getNick());
			user.setPassword(entity.getPassword());
			user.setRole(entity.getRole());
			return user;
		};
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService());
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}
	@Bean
	public WebClient.Builder webClientBuilder() {
		return WebClient.builder();
	}
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
	@Bean
	public TaskScheduler taskScheduler() {
		return new ThreadPoolTaskScheduler();
	}
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}