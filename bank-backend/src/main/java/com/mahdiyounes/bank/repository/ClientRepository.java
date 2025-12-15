package com.mahdiyounes.bank.repository;

import com.mahdiyounes.bank.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    boolean existsByNumeroIdentite(String numeroIdentite);

    boolean existsByEmail(String email);

    Optional<Client> findByNumeroIdentite(String numeroIdentite);

    Optional<Client> findByUserId(Long userId);

    // Nouvelle méthode pour trouver un client par username
    Optional<Client> findByUserUsername(String username);
}