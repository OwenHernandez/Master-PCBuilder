package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
	@Autowired
	private JavaMailSender sender;
	@Value("${mail.name}")
	private String mailfrom;

	public void send(String destinatario, String asunto, String contenido) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(mailfrom);
		message.setTo(destinatario);
		message.setSubject(asunto);
		message.setText(contenido);
		sender.send(message);
	}
}
