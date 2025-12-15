package com.mahdiyounes.bank.controller;

import com.mahdiyounes.bank.dto.ClientRequest;
import com.mahdiyounes.bank.dto.ClientResponse;
import com.mahdiyounes.bank.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    // Seul AGENT_GUICHET peut créer un client
    @PostMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.createClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Lister tous les clients
    @GetMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        List<ClientResponse> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }

    // Récupérer un client par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Long id) {
        ClientResponse client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    // Récupérer un client par numéro d'identité
    @GetMapping("/numero-identite/{numeroIdentite}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<ClientResponse> getClientByNumeroIdentite(@PathVariable String numeroIdentite) {
        ClientResponse client = clientService.getClientByNumeroIdentite(numeroIdentite);
        return ResponseEntity.ok(client);
    }
}