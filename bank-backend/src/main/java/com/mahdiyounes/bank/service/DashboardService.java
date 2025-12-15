package com.mahdiyounes.bank.service;

import com.mahdiyounes.bank.dto.*;
import com.mahdiyounes.bank.entity.Client;
import com.mahdiyounes.bank.entity.CompteBancaire;
import com.mahdiyounes.bank.entity.Operation;
import com.mahdiyounes.bank.repository.ClientRepository;
import com.mahdiyounes.bank.repository.CompteBancaireRepository;
import com.mahdiyounes.bank.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private CompteBancaireRepository compteRepository;

    @Autowired
    private OperationRepository operationRepository;

    @Autowired
    private ClientRepository clientRepository;

    /**
     * Récupérer les comptes du client connecté
     */
    public List<CompteClientResponse> getMesComptes() {
        Client client = getClientConnecte();

        // Trier par date de dernière opération (compte le plus récemment utilisé en premier)
        List<CompteBancaire> comptes = compteRepository
                .findByClientIdOrderByDateDerniereOperationDesc(client.getId());

        return comptes.stream()
                .map(this::mapToCompteClientResponse)
                .collect(Collectors.toList());
    }

    /**
     * UC-4: Consulter le tableau de bord
     * Affiche les infos du compte avec les 10 dernières opérations
     */
    public DashboardResponse getDashboard(String rib) {
        Client client = getClientConnecte();

        CompteBancaire compte = compteRepository.findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        // Vérifier que le compte appartient au client connecté
        if (!compte.getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Vous n'avez pas accès à ce compte");
        }

        // Récupérer les 10 dernières opérations
        List<Operation> operations = operationRepository
                .findTop10ByCompteIdOrderByDateOperationDesc(compte.getId());

        // Compter le total des opérations
        long totalOperations = operationRepository.countByCompteId(compte.getId());

        DashboardResponse response = new DashboardResponse();
        response.setRib(compte.getRib());
        response.setSolde(compte.getSolde());
        response.setStatut(compte.getStatut());
        response.setDernieres10Operations(
                operations.stream()
                        .map(this::mapToOperationResponse)
                        .collect(Collectors.toList())
        );
        response.setTotalOperations(totalOperations);

        return response;
    }

    /**
     * Récupérer le dashboard du compte le plus récemment utilisé
     */
    public DashboardResponse getDashboardDefault() {
        List<CompteClientResponse> comptes = getMesComptes();

        if (comptes.isEmpty()) {
            throw new RuntimeException("Vous n'avez aucun compte bancaire");
        }

        // Prendre le premier compte (le plus récemment utilisé)
        return getDashboard(comptes.get(0).getRib());
    }

    /**
     * Récupérer les opérations d'un compte avec pagination
     */
    public PageResponse<OperationResponse> getOperations(String rib, int page, int size) {
        Client client = getClientConnecte();

        CompteBancaire compte = compteRepository.findByRib(rib)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        // Vérifier que le compte appartient au client connecté
        if (!compte.getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Vous n'avez pas accès à ce compte");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Operation> operationsPage = operationRepository
                .findByCompteIdOrderByDateOperationDesc(compte.getId(), pageable);

        List<OperationResponse> operations = operationsPage.getContent().stream()
                .map(this::mapToOperationResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                operations,
                operationsPage.getNumber(),
                operationsPage.getSize(),
                operationsPage.getTotalElements(),
                operationsPage.getTotalPages(),
                operationsPage.isLast()
        );
    }

    private Client getClientConnecte() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return clientRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }

    private CompteClientResponse mapToCompteClientResponse(CompteBancaire compte) {
        CompteClientResponse response = new CompteClientResponse();
        response.setId(compte.getId());
        response.setRib(compte.getRib());
        response.setSolde(compte.getSolde());
        response.setStatut(compte.getStatut());
        response.setDateDerniereOperation(compte.getDateDerniereOperation());
        return response;
    }

    private OperationResponse mapToOperationResponse(Operation operation) {
        OperationResponse response = new OperationResponse();
        response.setId(operation.getId());
        response.setType(operation.getType());
        response.setMontant(operation.getMontant());
        response.setIntitule(operation.getIntitule());
        response.setMotif(operation.getMotif());
        response.setDateOperation(operation.getDateOperation());
        return response;
    }
}