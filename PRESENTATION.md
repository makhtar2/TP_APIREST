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

## 5. Le Plan de Démonstration (Live Demo)

Cette démonstration suit exactement votre plan en 3 parties.
*(Note technique : Pour que les ajouts et modifications fonctionnent lors des Parties 1 et 2, assurez-vous d'être connecté en arrière-plan et d'avoir inséré un Token valide dans l'onglet `Auth` de Postman).*

### 🟢 Partie 1 : CRUD Étudiant (À présenter en premier)
*Montrer la gestion complète d'un étudiant avec les contrôles de saisie.*

1. **Lecture (GET)** : Envoyez un `GET` sur `/api/etudiants` pour afficher la liste (qui est publique).
2. **Ajout (POST)** : 
   - Envoyez un `POST` sur `/api/etudiants` avec un JSON complet.
   - **Montrez vos sécurités** : Essayez de mettre une filière "MATHS" -> *Erreur 400*. Essayez un email déjà existant -> *Erreur 400*.
   - Mettez les bonnes données, envoyez, et montrez que le **matricule est généré automatiquement** (ex: MAT2026005).
3. **Modification (PUT)** : Envoyez un `PUT` sur `/api/etudiants/1` pour changer le niveau d'un étudiant.
4. **Suppression (DELETE)** : Envoyez un `DELETE` sur `/api/etudiants/1` pour retirer un étudiant.

### 🔵 Partie 2 : CRUD Administrateur (En second lieu)
*Montrer la gestion sécurisée des administrateurs.*

1. **Lecture (GET)** : Envoyez un `GET` sur `/api/admins`.
2. **Ajout (POST)** : 
   - Envoyez un `POST` sur `/api/admins` avec (nom, prenom, telephone, email, password).
   - **Montrez vos sécurités** : Essayez de mettre un numéro de téléphone appartenant déjà à un autre admin -> *Erreur 400*.
   - Expliquez oralement que le système **hache le mot de passe** (`bcrypt`) avant de l'enregistrer dans `admins.json`.
3. **Modification (PUT)** : Envoyez un `PUT` sur `/api/admins/1` pour modifier un email.
4. **Suppression (DELETE)** : Envoyez un `DELETE` sur `/api/admins/1`.

### 🟡 Partie 3 : La Sécurité et le Token (En dernier)
*C'est le moment d'expliquer la mécanique de protection de l'API.*

1. **La Connexion (Générer le Token)** : 
   - Envoyez un `POST` sur `/api/auth/login` avec l'email et le mot de passe d'un admin.
   - Expliquez que le code utilise `bcrypt.compare` pour valider le mot de passe, puis génère et renvoie le **Token JWT** (valable 1h).
2. **Preuve de l'efficacité du Token** : 
   - Dans Postman, allez sur une requête protégée (ex: `POST /api/etudiants`) et **retirez** le Token.
   - Envoyez la requête. Résultat immédiat : `401 Unauthorized` (Accès refusé).
3. **La Déconnexion (Détruire le Token)** :
   - Envoyez un `POST` sur `/api/auth/logout` avec votre Token actif.
   - Message de confirmation : "Déconnecté avec succès".
   - **Coup de grâce** : Refaites le test de l'étape 2 avec ce même token. Le serveur va le rejeter car il a été mis dans la **Blacklist**.

## 6. Points Forts du Projet
- **Clarté du code** : Séparation des responsabilités (Routes vs Contrôleurs).
- **Robustesse** : Gestion des erreurs (404 si non trouvé, 400 pour les champs obligatoires, unicité email/téléphone).
- **Évolutivité** : Facile d'ajouter de nouveaux champs ou de passer à une base de données réelle (MongoDB/PostgreSQL) par la suite.
- **Automatisation** : Le système génère automatiquement les matricules lors de la création d'un étudiant.

## 7. Conclusion
Ce TP m'a permis de maîtriser les bases du développement backend moderne et de comprendre comment un client (comme une application mobile ou web) communique avec un serveur. J'ai pu sécuriser une API via JWT et mettre en place des contrôles de saisie rigoureux.

---

### Conseils pour l'oral :
- **Parlez de la validation** : Les professeurs aiment quand on montre que l'on contrôle ce que l'utilisateur envoie (les filières DAR/RT/ASR).
- **Insistez sur la sécurité** : Mettez en avant le fait que votre API ne plantera pas si un utilisateur oublie des champs, car vous avez prévu ces cas (robustesse).
- **Expliquez le JSON** : Mentionnez que c'est le format standard de transfert de données sur le web.
- **Restez calme** : Si une commande échoue, lisez le message d'erreur, c'est aussi une compétence de savoir déboguer !
