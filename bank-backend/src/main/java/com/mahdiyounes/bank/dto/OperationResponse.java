package com.mahdiyounes.bank.dto;

import com.mahdiyounes.bank.entity.TypeOperation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperationResponse {
    private Long id;
    private TypeOperation type;
    private BigDecimal montant;
    private String intitule;
    private String motif;
    private LocalDateTime dateOperation;
}