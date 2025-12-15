package com.mahdiyounes.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirementResponse {
    private String ribSource;
    private String ribDestinataire;
    private BigDecimal montant;
    private String motif;
    private LocalDateTime dateVirement;
    private String message;
}