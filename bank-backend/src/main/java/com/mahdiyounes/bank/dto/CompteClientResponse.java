package com.mahdiyounes.bank.dto;

import com.mahdiyounes.bank.entity.StatutCompte;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteClientResponse {
    private Long id;
    private String rib;
    private BigDecimal solde;
    private StatutCompte statut;
    private LocalDateTime dateDerniereOperation;
}