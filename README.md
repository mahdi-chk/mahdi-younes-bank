# 🏦 Mahdi & Younes Bank

Application web de **gestion bancaire** développée avec **Spring Boot 3**, **Spring Security (JWT)** et **React 18**. Le projet permet la gestion des clients, des comptes bancaires, des virements et de l’historique des opérations, avec une séparation claire des rôles **Agent de guichet** et **Client**.

---

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité

* Authentification sécurisée avec **JWT** (expiration 1h)
* Chiffrement des mots de passe (**BCrypt**)
* Autorisations par rôles : `AGENT_GUICHET`, `CLIENT`

### 👨‍💼 Espace Agent de guichet

* Création et gestion des clients
* Création de comptes bancaires (RIB valide)
* Tableau de bord avec statistiques

### 👤 Espace Client

* Consultation du tableau de bord
* Visualisation des comptes et soldes
* Historique des opérations (pagination)
* Virements bancaires sécurisés

---

## 🧱 Architecture

Architecture **multi-couches (N-tiers)** :

* **Frontend** : React 18 (UI, routing, appels API)
* **Backend** : Spring Boot 3 (REST API, logique métier, sécurité)
* **Base de données** : MySQL 8

### Design Patterns

* IoC / DI
* AOP (`@Transactional`)
* DTO
* Repository Pattern
* Service Layer Pattern

---

## 🛠️ Technologies

### Backend

* Java 17
* Spring Boot 3
* Spring Security
* JWT (jjwt)
* Spring Data JPA
* MySQL 8
* Maven

### Frontend

* React 18
* React Router
* Axios
* TailwindCSS

### Outils

* IntelliJ IDEA / VS Code
* MySQL Workbench
* Postman
* Git & GitHub

---

## 🚀 Installation & Lancement

### 1️⃣ Backend (Spring Boot)

```bash
# Cloner le projet
 git clone https://github.com/mahdi-chk/mahdi-younes-bank.git
 cd mahdi-younes-bank/backend

# Configurer la base de données (application.properties)
 spring.datasource.url=jdbc:mysql://localhost:3306/bank_db
 spring.datasource.username=root
 spring.datasource.password=your_password

# Lancer l’application
 mvn spring-boot:run
```

API disponible sur : `http://localhost:8080`

---

### 2️⃣ Frontend (React)

```bash
 cd mahdi-younes-bank/frontend
 npm install
 npm start
```

Application accessible sur : `http://localhost:3000`

---

## 🔑 Rôles & Accès

| Rôle          | Accès                            |
| ------------- | -------------------------------- |
| AGENT_GUICHET | Gestion clients & comptes        |
| CLIENT        | Dashboard, virements, historique |

---

## 📁 Structure du Projet (simplifiée)

```text
backend/
 ├── controller/
 ├── service/
 ├── repository/
 ├── entity/
 ├── dto/
 └── security/

frontend/
 ├── components/
 ├── pages/
 ├── services/
 └── context/
```

---


## 👥 Auteurs

* **CHAKOUCH El Mahdi**
* **SADOQ Younes**

🎓 *5ème année – Ingénierie Informatique et Réseaux*
📅 *Année universitaire : 2025–2026*

---

## 📜 Licence

Projet académique – usage pédagogique.
