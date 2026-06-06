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

## 5. Démonstration Détaillée (Live Demo Postman)

### 🛑 Étape 1 : Montrer que la sécurité bloque les intrus
*L'objectif est de prouver qu'on ne peut rien modifier sans être connecté.*

1. **Ouvrez Postman**.
2. Créez une requête **POST** vers `http://localhost:3000/api/etudiants`
3. Dans l'onglet **Body** (choisissez `raw` et `JSON`), mettez des données :
   ```json
   {
       "nom": "Diop",
       "prenom": "Aliou",
       "email": "aliou.diop@ucak.edu.sn",
       "filiere": "DAR",
       "niveau": "L1"
   }
   ```
4. **Cliquez sur "Send"**.
5. 👉 **Ce que le prof doit voir** : Une belle erreur `401 Unauthorized` avec le message *"Accès refusé. Veuillez vous connecter."* (Cela prouve que votre `authMiddleware` fonctionne).

### 🔑 Étape 2 : L'Authentification (Générer le Token)
*Maintenant, on se connecte en tant qu'administrateur.*

1. Créez une requête **POST** vers `http://localhost:3000/api/auth/login`
2. Dans le **Body** (format JSON) :
   ```json
   {
       "email": "admin@ucak.edu.sn",
       "password": "admin"
   }
   ```
3. **Cliquez sur "Send"**.
4. 👉 **Ce que le prof doit voir** : Vous recevez un gros `token`. 
5. ⚠️ **Copiez ce Token** !

### 🛡️ Étape 3 : Contrôle de saisie et Validation
*On va tenter de faire des bêtises pour montrer que le serveur ne plante pas.*

1. Revenez sur la requête **POST** vers `http://localhost:3000/api/etudiants`
2. Allez dans l'onglet **Auth** -> Choisissez **Bearer Token** et collez votre token.
3. Allez dans le **Body** et testons vos validations :

   **Test A (Champs manquants)** : Enlevez le "nom".
   * Résultat attendu : `400 Erreur : Tous les champs (...) sont obligatoires.`
   
   **Test B (Mauvaise filière)** : Mettez `"filiere": "MATHS"`.
   * Résultat attendu : `400 Erreur : Filière invalide. Choisissez parmi : DAR, RT, ASR`.
   
   **Test C (Doublon email)** : Mettez l'email `"makhtar.wade@ucak.edu.sn"`.
   * Résultat attendu : `400 Erreur : Cet email est déjà utilisé.`

### ✅ Étape 4 : Le Succès (Création de l'étudiant avec Matricule Auto)
*On montre que quand tout est bon, ça marche, et le matricule se crée tout seul.*

1. Toujours sur **POST** `http://localhost:3000/api/etudiants` avec votre Token.
2. Mettez le bon JSON :
   ```json
   {
       "nom": "Diop",
       "prenom": "Aliou",
       "email": "aliou.diop2@ucak.edu.sn",
       "filiere": "DAR",
       "niveau": "L1"
   }
   ```
3. **Cliquez sur "Send"**.
4. 👉 **Ce que le prof doit voir** : Réponse `201 Created`. Faites remarquer au prof que **le `matricule` (ex: MAT2026005) a été généré tout seul** par le système, et que l'ID a été auto-incrémenté !

### 🔍 Étape 5 : Lecture Publique
*Montrer que tout le monde peut voir la liste.*

1. Créez une requête **GET** vers `http://localhost:3000/api/etudiants`
2. Pas besoin d'autorisation (Auth: None).
3. **Cliquez sur "Send"**.
4. 👉 **Ce que le prof doit voir** : La liste complète des étudiants apparaît, et Aliou Diop est bien tout en bas de la liste avec son nouveau matricule !

### 🚪 Étape 6 : La Déconnexion (Logout)
*On détruit le token pour montrer la Blacklist.*

1. Créez une requête **POST** vers `http://localhost:3000/api/auth/logout`
2. Mettez votre **Bearer Token** dans l'onglet Auth.
3. **Cliquez sur "Send"**.
4. 👉 **Ce que le prof doit voir** : `"Déconnecté avec succès"`.
5. **Coup de grâce** : Retournez sur la requête d'ajout d'un étudiant (Étape 4) et cliquez à nouveau sur Send avec le même token. 
   * Résultat attendu : `401 Accès refusé` (Le token est blacklisté, il n'est plus valable).

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
