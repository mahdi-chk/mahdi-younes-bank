package com.mahdiyounes.bank.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class VirementRequest {

    @NotBlank(message = "Le RIB source est obligatoire")
    @Pattern(regexp = "^[0-9]{24}$", message = "Le RIB doit contenir exactement 24 chiffres")
    private String ribSource;

    @NotBlank(message = "Le RIB destinataire est obligatoire")
    @Pattern(regexp = "^[0-9]{24}$", message = "Le RIB destinataire doit contenir exactement 24 chiffres")
    private String ribDestinataire;

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;

    @NotBlank(message = "Le motif est obligatoire")
    @Size(max = 255, message = "Le motif ne doit pas dépasser 255 caractères")
    private String motif;
}