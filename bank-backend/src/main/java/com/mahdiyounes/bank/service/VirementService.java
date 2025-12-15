package com.mahdiyounes.bank.service;

import com.mahdiyounes.bank.dto.VirementRequest;
import com.mahdiyounes.bank.dto.VirementResponse;
import com.mahdiyounes.bank.entity.*;
import com.mahdiyounes.bank.repository.ClientRepository;
import com.mahdiyounes.bank.repository.CompteBancaireRepository;
import com.mahdiyounes.bank.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class VirementService {

    @Autowired
    private CompteBancaireRepository compteRepository;

    @Autowired
    private OperationRepository operationRepository;

    @Autowired
    private ClientRepository clientRepository;

    /**
     * UC-5: Effectuer un virement
     * RG_11, RG_12, RG_13, RG_14, RG_15
     */
    @Transactional
    public VirementResponse effectuerVirement(VirementRequest request) {

        // Récupérer le client connecté
        Client clientConnecte = getClientConnecte();

        // Récupérer le compte source
        CompteBancaire compteSource = compteRepository.findByRib(request.getRibSource())
                .orElseThrow(() -> new RuntimeException("Compte source non trouvé"));

        // Vérifier que le compte appartient au client connecté
        if (!compteSource.getClient().getId().equals(clientConnecte.getId())) {
            throw new RuntimeException("Ce compte ne vous appartient pas");
        }

        // RG_11: Vérifier que le compte n'est pas bloqué ou clôturé
        if (compteSource.getStatut() == StatutCompte.BLOQUE) {
            throw new RuntimeException("Votre compte est bloqué. Veuillez contacter votre agence");
        }
        if (compteSource.getStatut() == StatutCompte.CLOTURE) {
            throw new RuntimeException("Votre compte est clôturé");
        }

        // RG_12: Vérifier que le solde est suffisant
        if (compteSource.getSolde().compareTo(request.getMontant()) < 0) {
            throw new RuntimeException("Solde insuffisant. Solde disponible: " +
                    compteSource.getSolde().toPlainString() + " DH");
        }

        // Récupérer le compte destinataire
        CompteBancaire compteDestinataire = compteRepository.findByRib(request.getRibDestinataire())
                .orElseThrow(() -> new RuntimeException("Compte destinataire non trouvé"));

        // Vérifier que le compte destinataire n'est pas clôturé
        if (compteDestinataire.getStatut() == StatutCompte.CLOTURE) {
            throw new RuntimeException("Le compte destinataire est clôturé");
        }

        // Vérifier qu'on ne fait pas un virement vers son propre compte
        if (request.getRibSource().equals(request.getRibDestinataire())) {
            throw new RuntimeException("Vous ne pouvez pas effectuer un virement vers votre propre compte");
        }

        LocalDateTime dateVirement = LocalDateTime.now();

        // RG_13: Débiter le compte source
        compteSource.setSolde(compteSource.getSolde().subtract(request.getMontant()));
        compteSource.setDateDerniereOperation(dateVirement);
        compteRepository.save(compteSource);

        // RG_14: Créditer le compte destinataire
        compteDestinataire.setSolde(compteDestinataire.getSolde().add(request.getMontant()));
        compteDestinataire.setDateDerniereOperation(dateVirement);
        compteRepository.save(compteDestinataire);

        // RG_15: Tracer les deux opérations avec leurs dates précises

        // Opération DEBIT pour le compte source
        Operation operationDebit = new Operation();
        operationDebit.setType(TypeOperation.DEBIT);
        operationDebit.setMontant(request.getMontant());
        operationDebit.setIntitule("Virement vers " +
                compteDestinataire.getClient().getPrenom() + " " +
                compteDestinataire.getClient().getNom());
        operationDebit.setMotif(request.getMotif());
        operationDebit.setDateOperation(dateVirement);
        operationDebit.setCompte(compteSource);
        operationRepository.save(operationDebit);

        // Opération CREDIT pour le compte destinataire
        Operation operationCredit = new Operation();
        operationCredit.setType(TypeOperation.CREDIT);
        operationCredit.setMontant(request.getMontant());
        operationCredit.setIntitule("Virement en votre faveur de " +
                compteSource.getClient().getPrenom() + " " +
                compteSource.getClient().getNom());
        operationCredit.setMotif(request.getMotif());
        operationCredit.setDateOperation(dateVirement);
        operationCredit.setCompte(compteDestinataire);
        operationRepository.save(operationCredit);

        // Préparer la réponse
        VirementResponse response = new VirementResponse();
        response.setRibSource(request.getRibSource());
        response.setRibDestinataire(request.getRibDestinataire());
        response.setMontant(request.getMontant());
        response.setMotif(request.getMotif());
        response.setDateVirement(dateVirement);
        response.setMessage("Virement effectué avec succès");

        return response;
    }

    private Client getClientConnecte() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return clientRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }
}