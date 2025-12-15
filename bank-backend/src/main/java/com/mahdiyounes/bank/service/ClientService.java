package com.mahdiyounes.bank.service;

import com.mahdiyounes.bank.dto.ClientRequest;
import com.mahdiyounes.bank.dto.ClientResponse;
import com.mahdiyounes.bank.entity.Client;
import com.mahdiyounes.bank.entity.Role;
import com.mahdiyounes.bank.entity.User;
import com.mahdiyounes.bank.repository.ClientRepository;
import com.mahdiyounes.bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public ClientResponse createClient(ClientRequest request) {

        // RG_4: Vérifier l'unicité du numéro d'identité
        if (clientRepository.existsByNumeroIdentite(request.getNumeroIdentite())) {
            throw new RuntimeException("Le numéro d'identité existe déjà");
        }

        // RG_6: Vérifier l'unicité de l'email
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("L'adresse email existe déjà");
        }

        // Générer username et mot de passe
        String username = generateUsername(request.getNom(), request.getPrenom());
        String plainPassword = generatePassword();

        // Créer l'utilisateur
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(plainPassword)); // RG_1: Crypter le mot de passe
        user.setRole(Role.CLIENT);
        user = userRepository.save(user);

        // Créer le client
        Client client = new Client();
        client.setNom(request.getNom());
        client.setPrenom(request.getPrenom());
        client.setNumeroIdentite(request.getNumeroIdentite());
        client.setDateAnniversaire(request.getDateAnniversaire());
        client.setEmail(request.getEmail());
        client.setAdressePostale(request.getAdressePostale());
        client.setUser(user);

        client = clientRepository.save(client);

        // RG_7: Envoyer l'email avec les credentials
        emailService.sendCredentials(client.getEmail(), username, plainPassword);

        return mapToResponse(client);
    }

    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ClientResponse getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        return mapToResponse(client);
    }

    public ClientResponse getClientByNumeroIdentite(String numeroIdentite) {
        Client client = clientRepository.findByNumeroIdentite(numeroIdentite)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        return mapToResponse(client);
    }

    // Générer un username unique
    private String generateUsername(String nom, String prenom) {
        String baseUsername = (prenom.toLowerCase().charAt(0) + nom.toLowerCase()).replaceAll("\\s+", "");
        String username = baseUsername;
        int counter = 1;

        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        return username;
    }

    // Générer un mot de passe aléatoire
    private String generatePassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }

        return password.toString();
    }

    private ClientResponse mapToResponse(Client client) {
        ClientResponse response = new ClientResponse();
        response.setId(client.getId());
        response.setNom(client.getNom());
        response.setPrenom(client.getPrenom());
        response.setNumeroIdentite(client.getNumeroIdentite());
        response.setDateAnniversaire(client.getDateAnniversaire());
        response.setEmail(client.getEmail());
        response.setAdressePostale(client.getAdressePostale());
        response.setUsername(client.getUser() != null ? client.getUser().getUsername() : null);
        return response;
    }
}