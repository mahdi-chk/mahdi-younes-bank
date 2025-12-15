package com.mahdiyounes.bank.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ClientRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 100, message = "Le prénom ne doit pas dépasser 100 caractères")
    private String prenom;

    @NotBlank(message = "Le numéro d'identité est obligatoire")
    @Size(max = 50, message = "Le numéro d'identité ne doit pas dépasser 50 caractères")
    private String numeroIdentite;

    @NotNull(message = "La date d'anniversaire est obligatoire")
    @Past(message = "La date d'anniversaire doit être dans le passé")
    private LocalDate dateAnniversaire;

    @NotBlank(message = "L'adresse email est obligatoire")
    @Email(message = "L'adresse email n'est pas valide")
    private String email;

    @NotBlank(message = "L'adresse postale est obligatoire")
    @Size(max = 255, message = "L'adresse postale ne doit pas dépasser 255 caractères")
    private String adressePostale;
}