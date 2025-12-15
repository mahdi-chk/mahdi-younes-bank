package com.mahdiyounes.bank.service;

import com.mahdiyounes.bank.dto.CompteRequest;
import com.mahdiyounes.bank.dto.CompteResponse;
import com.mahdiyounes.bank.entity.Client;
import com.mahdiyounes.bank.entity.CompteBancaire;
import com.mahdiyounes.bank.entity.StatutCompte;
import com.mahdiyounes.bank.repository.ClientRepository;
import com.mahdiyounes.bank.repository.CompteBancaireRepository;
import com.mahdiyounes.bank.util.RibValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompteBancaireService {

    @Autowired
    private CompteBancaireRepository compteRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Transactional
    public CompteResponse createCompte(CompteRequest request) {

        // RG_9: Valider le RIB
        if (!RibValidator.isValidRib(request.getRib())) {
            throw new RuntimeException("Le RIB n'est pas valide");
        }

        // Vérifier si le RIB existe déjà
        if (compteRepository.existsByRib(request.getRib())) {
            throw new RuntimeException("Ce RIB existe déjà");
        }

        // RG_8: Vérifier que le client existe
        Client client = clientRepository.findByNumeroIdentite(request.getNumeroIdentiteClient())
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec ce numéro d'identité"));

        // Créer le compte bancaire
        CompteBancaire compte = new CompteBancaire();
        compte.setRib(request.getRib());
        compte.setClient(client);
        compte.setStatut(StatutCompte.OUVERT); // RG_10: Statut initial "Ouvert"

        compte = compteRepository.save(compte);

        return mapToResponse(compte);
    }

    public List<CompteResponse> getAllComptes() {
        return compteRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CompteResponse getCompteByRib(String rib) {
        CompteBancaire compte = compteRepository.findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
        return mapToResponse(compte);
    }

    public List<CompteResponse> getComptesByClientId(Long clientId) {
        return compteRepository.findByClientId(clientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CompteResponse> getComptesByNumeroIdentite(String numeroIdentite) {
        Client client = clientRepository.findByNumeroIdentite(numeroIdentite)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        return getComptesByClientId(client.getId());
    }

    private CompteResponse mapToResponse(CompteBancaire compte) {
        CompteResponse response = new CompteResponse();
        response.setId(compte.getId());
        response.setRib(compte.getRib());
        response.setSolde(compte.getSolde());
        response.setStatut(compte.getStatut());
        response.setClientId(compte.getClient().getId());
        response.setClientNom(compte.getClient().getNom());
        response.setClientPrenom(compte.getClient().getPrenom());
        response.setDateDerniereOperation(compte.getDateDerniereOperation());
        response.setCreatedAt(compte.getCreatedAt());
        return response;
    }
}