package com.mahdiyounes.bank;

import com.mahdiyounes.bank.entity.Role;
import com.mahdiyounes.bank.entity.User;
import com.mahdiyounes.bank.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class MahdiYounesBankApplication {
    public static void main(String[] args) {
        SpringApplication.run(MahdiYounesBankApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Créer un agent de guichet pour les tests
//            if (!userRepository.existsByUsername("agent")) {
//                User agent = new User();
//                agent.setUsername("agent");
//                agent.setPassword(passwordEncoder.encode("agent123"));
//                agent.setRole(Role.AGENT_GUICHET);
//                userRepository.save(agent);
//                System.out.println("Agent créé: agent/agent123");
//            }

            // Créer un client pour les tests
//            if (!userRepository.existsByUsername("client")) {
//                User client = new User();
//                client.setUsername("client");
//                client.setPassword(passwordEncoder.encode("client123"));
//                client.setRole(Role.CLIENT);
//                userRepository.save(client);
//                System.out.println("Client créé: client/client123");
//            }
        };
    }
}