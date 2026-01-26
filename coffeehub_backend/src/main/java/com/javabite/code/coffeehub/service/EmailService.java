package com.javabite.code.coffeehub.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String token) {

        String verifyUrl = "http://localhost:8080/auth/verify?token=" + token;

        String subject = "Welcome to CoffeeHub ☕ | Verify Your Email";

        String body = """
                Hello 👋

                Welcome to CoffeeHub!

                Please verify your email by clicking the link below:
                %s

                If you didn’t sign up, please ignore this email.

                ☕ CoffeeHub Team
                """.formatted(verifyUrl);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
