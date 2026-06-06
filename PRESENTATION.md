# Guide de Présentation : TP API REST - Gestion des Étudiants

Ce document est conçu pour vous aider à présenter votre projet de manière structurée et professionnelle.

---

## 1. Introduction et Contexte
*   **Sujet** : Mise en place d'une API REST pour la gestion d'un annuaire d'étudiants.
*   **Objectif** : Comprendre le fonctionnement des méthodes HTTP (GET, POST, PUT, DELETE) et la manipulation de données JSON avec Node.js.

## 2. Architecture Technique
Le projet suit une structure organisée (proche du modèle MVC) pour assurer la clarté du code :
- **`server.js`** : Le point d'entrée. Il initialise Express et configure les middlewares (comme le parseur JSON).
- **Routes (`src/routes/`)** : Définit les chemins (URLs) et les lie aux fonctions correspondantes.
- **Contrôleur (`src/controllers/`)** : Contient la "logique métier" (comment lire, ajouter, modifier ou supprimer un étudiant).
- **Data (`src/data/`)** : Utilisation d'un fichier `etudiants.json` pour la persistance des données (simule une base de données).

## 3. Choix Technologiques & Bonnes Pratiques
Pour cette version "Professionnelle", nous avons intégré des outils standards du marché :
- **Dotenv** : Gestion des variables d'environnement (sécurise les clés secrètes et les ports).
- **Bcryptjs** : Hachage sécurisé des mots de passe (ne jamais stocker de mots de passe en clair).
- **Morgan** : Logger HTTP pour surveiller les requêtes en temps réel dans le terminal.
- **JWT (JsonWebToken)** : Authentification moderne et sans état (stateless).

## 4. Double CRUD : Gestion des Admins et des Étudiants
Le projet gère désormais deux entités distinctes avec des structures différentes :

### A. Entité Administrateur (`/api/admins`)
- **Structure** : `id`, `nom`, `prenom`, `telephone`, `email`, `password`.
- **Rôle** : Gérer les comptes des personnes ayant accès à la gestion du système.
- **Sécurité** : Accès totalement protégé par Token.

### B. Entité Étudiant (`/api/etudiants`)
- **Structure** : `id`, `matricule`, `nom`, `prenom`, `email`, `filiere`, `niveau`.
- **Rôle** : Liste des élèves inscrits dans l'établissement.
- **Sécurité** : Lecture publique, modification/suppression réservée aux Admins.

## 5. Démonstration (Le "Live Demo")
1.  **Récupération (GET)** : Montrer que la lecture est publique.
2.  **Tentative de création (POST)** : Montrer que sans token, le serveur renvoie une erreur `401 Unauthorized`.
3.  **Connexion (Login)** : Se connecter en tant qu'admin pour récupérer le token.
4.  **Action sécurisée** : Refaire le POST en incluant le token dans les headers (`Authorization: Bearer <token>`).
5.  **Déconnexion (Logout)** : Détruire le token et montrer qu'il n'est plus utilisable.

## 5. Points Forts du Projet
- **Clarté du code** : Séparation des responsabilités (Routes vs Contrôleurs).
- **Robustesse** : Gestion des erreurs (404 si étudiant non trouvé, 400 pour les données invalides).
- **Évolutivité** : Facile d'ajouter de nouveaux champs ou de passer à une base de données réelle (MongoDB/PostgreSQL) par la suite.

## 6. Conclusion
Ce TP m'a permis de maîtriser les bases du développement backend moderne et de comprendre comment un client (comme une application mobile ou web) communique avec un serveur.

---

### Conseils pour l'oral :
- **Parlez de la validation** : Les professeurs aiment quand on montre que l'on contrôle ce que l'utilisateur envoie (les filières DAR/RT/ASR).
- **Expliquez le JSON** : Mentionnez que c'est le format standard de transfert de données sur le web.
- **Restez calme** : Si une commande échoue, lisez le message d'erreur, c'est aussi une compétence de savoir déboguer !
