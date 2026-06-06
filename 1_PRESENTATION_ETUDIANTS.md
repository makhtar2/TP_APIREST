# Partie 1 : Gestion de l'Entité Étudiant (CRUD)

## 1. Architecture et Modélisation
L'entité "Étudiant" constitue le cœur métier de l'application. Elle est modélisée à travers un système de stockage persistant basé sur le format JSON (`src/data/etudiants.json`). 

La structure de données d'un étudiant est rigoureusement définie par les attributs suivants :
- `id` : Identifiant unique auto-incrémenté.
- `matricule` : Référence académique unique générée par le système.
- `nom` & `prenom` : Informations d'identité.
- `email` : Adresse électronique (unique).
- `filiere` : Filière d'affectation (limitée à DAR, RT, ASR).
- `niveau` : Niveau d'études (ex: L1, L2, L3).

## 2. Flux de Traitement (Pattern MVC)
Le système repose sur une architecture claire séparant les responsabilités :
1. **Routage (`etudiantRoutes.js`)** : Intercepte les requêtes HTTP (GET, POST, PUT, DELETE) sur l'endpoint `/api/etudiants`.
2. **Contrôleur (`etudiantController.js`)** : Contient la logique métier, la validation des données et l'interaction avec le système de fichiers.
3. **Utilitaires (`fileHandler.js`)** : Gère les opérations d'entrée/sortie asynchrones (`fs.promises`) pour garantir l'intégrité du fichier JSON.

## 3. Logique Métier et Contrôle de Saisie

### A. Validation Stricte des Données
Lors de la création (POST) ou de la modification (PUT) d'un étudiant, le système effectue plusieurs vérifications en amont :
- **Exhaustivité** : Rejet de la requête (Code HTTP 400 Bad Request) si un champ obligatoire est manquant.
- **Intégrité Référentielle** : Vérification de l'appartenance de la filière à une liste énumérée (`['DAR', 'RT', 'ASR']`).
- **Unicité** : Parcours des enregistrements existants pour s'assurer que l'adresse email n'est pas déjà assignée à un autre étudiant.

### B. Génération Automatique du Matricule
Pour éviter les erreurs de saisie humaine et garantir un format standardisé, le système est responsable de la création du matricule.
- **Algorithme** : Concaténation du préfixe `MAT`, de l'année courante (`new Date().getFullYear()`) et de l'ID formaté sur 3 chiffres (via `padStart(3, '0')`).
- **Immuabilité** : Lors d'une requête de mise à jour (PUT), le contrôleur force la conservation du matricule initial, empêchant toute altération externe.

## 4. Points d'Accès de l'API (Endpoints)
- `GET /api/etudiants` : Récupération de la liste complète (Accès public).
- `GET /api/etudiants/:id` : Récupération des détails d'un étudiant spécifique.
- `POST /api/etudiants` : Création d'un nouvel enregistrement (Nécessite une authentification).
- `PUT /api/etudiants/:id` : Mise à jour partielle ou totale (Nécessite une authentification).
- `DELETE /api/etudiants/:id` : Suppression de l'enregistrement (Nécessite une authentification).
