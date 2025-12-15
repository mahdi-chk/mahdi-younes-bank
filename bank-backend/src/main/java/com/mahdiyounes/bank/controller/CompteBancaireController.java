package com.mahdiyounes.bank.controller;

import com.mahdiyounes.bank.dto.CompteRequest;
import com.mahdiyounes.bank.dto.CompteResponse;
import com.mahdiyounes.bank.service.CompteBancaireService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comptes")
public class CompteBancaireController {

    @Autowired
    private CompteBancaireService compteService;

    // Seul AGENT_GUICHET peut créer un compte
    @PostMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<CompteResponse> createCompte(@Valid @RequestBody CompteRequest request) {
        CompteResponse response = compteService.createCompte(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Lister tous les comptes
    @GetMapping
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<CompteResponse>> getAllComptes() {
        List<CompteResponse> comptes = compteService.getAllComptes();
        return ResponseEntity.ok(comptes);
    }

    // Récupérer un compte par RIB
    @GetMapping("/rib/{rib}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<CompteResponse> getCompteByRib(@PathVariable String rib) {
        CompteResponse compte = compteService.getCompteByRib(rib);
        return ResponseEntity.ok(compte);
    }

    // Récupérer les comptes d'un client par son numéro d'identité
    @GetMapping("/client/numero-identite/{numeroIdentite}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<CompteResponse>> getComptesByNumeroIdentite(@PathVariable String numeroIdentite) {
        List<CompteResponse> comptes = compteService.getComptesByNumeroIdentite(numeroIdentite);
        return ResponseEntity.ok(comptes);
    }

    // Récupérer les comptes d'un client par ID
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('AGENT_GUICHET')")
    public ResponseEntity<List<CompteResponse>> getComptesByClientId(@PathVariable Long clientId) {
        List<CompteResponse> comptes = compteService.getComptesByClientId(clientId);
        return ResponseEntity.ok(comptes);
    }
}