package es.iespuertodelacruz.ohjm.apimasterpcbuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class ApiMasterPcBuilderApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiMasterPcBuilderApplication.class, args);
	}

}
