package com.mahdiyounes.bank.service;

import com.mahdiyounes.bank.dto.StatisticsResponse;
import com.mahdiyounes.bank.entity.StatutCompte;
import com.mahdiyounes.bank.repository.ClientRepository;
import com.mahdiyounes.bank.repository.CompteBancaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CompteBancaireRepository compteRepository;

    public StatisticsResponse getStatistics() {
        StatisticsResponse stats = new StatisticsResponse();

        stats.setTotalClients(clientRepository.count());
        stats.setTotalComptes(compteRepository.count());
        stats.setComptesOuverts(compteRepository.countByStatut(StatutCompte.OUVERT));
        stats.setComptesBloqués(compteRepository.countByStatut(StatutCompte.BLOQUE));
        stats.setComptesClotures(compteRepository.countByStatut(StatutCompte.CLOTURE));

        return stats;
    }
}