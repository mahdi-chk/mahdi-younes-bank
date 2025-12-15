package com.mahdiyounes.bank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // RG_7: Envoyer les credentials au client
    public void sendCredentials(String toEmail, String username, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@mahdiyounesbank.com");
            message.setTo(toEmail);
            message.setSubject("Vos identifiants Mahdi & Younes Bank");
            message.setText(
                    "Bonjour,\n\n" +
                            "Votre compte bancaire a été créé avec succès.\n\n" +
                            "Vos identifiants de connexion sont :\n" +
                            "Identifiant : " + username + "\n" +
                            "Mot de passe : " + password + "\n\n" +
                            "Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.\n\n" +
                            "Cordialement,\n" +
                            "L'équipe Mahdi & Younes Bank"
            );

            mailSender.send(message);
            System.out.println("Email envoyé à : " + toEmail);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email : " + e.getMessage());
            // En développement, on continue même si l'email échoue
            // En production, il faudrait gérer cette erreur différemment
        }
    }
}