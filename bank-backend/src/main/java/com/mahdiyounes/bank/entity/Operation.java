package com.mahdiyounes.bank.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "operations", indexes = {
        @Index(name = "idx_compte_date", columnList = "compte_id,date_operation")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Operation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeOperation type;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;

    @Column(nullable = false)
    private String intitule;

    @Column(length = 255)
    private String motif;

    @Column(name = "date_operation", nullable = false)
    private LocalDateTime dateOperation;

    @ManyToOne
    @JoinColumn(name = "compte_id", nullable = false)
    private CompteBancaire compte;

    @PrePersist
    protected void onCreate() {
        if (dateOperation == null) {
            dateOperation = LocalDateTime.now();
        }
    }
}