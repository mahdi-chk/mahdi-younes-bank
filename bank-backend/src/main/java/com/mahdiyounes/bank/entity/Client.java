package com.mahdiyounes.bank.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(name = "numero_identite", unique = true, nullable = false, length = 50)
    private String numeroIdentite;

    @Column(name = "date_anniversaire", nullable = false)
    private LocalDate dateAnniversaire;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "adresse_postale", nullable = false)
    private String adressePostale;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<CompteBancaire> comptes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}