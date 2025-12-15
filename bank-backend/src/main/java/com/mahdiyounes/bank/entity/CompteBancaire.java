package com.mahdiyounes.bank.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "comptes_bancaires")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteBancaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 24)
    private String rib;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal solde = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCompte statut = StatutCompte.OUVERT;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "compte", cascade = CascadeType.ALL)
    private List<Operation> operations;

    @Column(name = "date_derniere_operation")
    private LocalDateTime dateDerniereOperation;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (solde == null) {
            solde = BigDecimal.ZERO;
        }
        if (statut == null) {
            statut = StatutCompte.OUVERT;
        }
    }
}