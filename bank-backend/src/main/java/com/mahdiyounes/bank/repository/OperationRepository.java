package com.mahdiyounes.bank.repository;

import com.mahdiyounes.bank.entity.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {

    // Récupérer les opérations d'un compte avec pagination
    Page<Operation> findByCompteIdOrderByDateOperationDesc(Long compteId, Pageable pageable);

    // Récupérer les N dernières opérations d'un compte
    List<Operation> findTop10ByCompteIdOrderByDateOperationDesc(Long compteId);

    // Compter les opérations d'un compte
    long countByCompteId(Long compteId);
}