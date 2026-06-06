# 🚀 Guide Méthodique Postman (En 3 Parties)

Ce document calque exactement votre plan de présentation. 
Votre serveur doit être en cours d'exécution (`node src/server.js`) sur le port 3000.

*(Prérequis avant l'oral : Allez discrètement générer votre Token comme expliqué dans la Partie 3, et gardez-le dans votre presse-papiers pour l'utiliser lors des deux premières parties !)*

---

## 🟢 Partie 1 : Tester les Étudiants (CRUD)

### 1. Lire la liste publique (GET)
1. **Créer une nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Laissez sur **`GET`**.
3. **URL** : `http://localhost:3000/api/etudiants`.
4. **Envoyer** : Cliquez sur **`Send`** (Pas besoin de Token).
5. **Résultat** : **Statut `200 OK`**. Vous affichez la liste publique.

### 2. Ajouter un étudiant (POST)
1. **Nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Choisissez **`POST`**.
3. **URL** : `http://localhost:3000/api/etudiants`.
4. **Auth** : Onglet **`Authorization`** -> Type **`Bearer Token`** -> Collez votre Token.
5. **Body** : Onglet **`Body`** -> **`raw`** -> Menu déroulant **`JSON`**.
6. **Tester les sécurités (Erreur volontaire)** :
   ```json
   {
       "prenom": "Aliou",
       "email": "aliou.diop@ucak.edu.sn",
       "filiere": "DAR",
       "niveau": "L1"
   }
   ```
7. **Envoyer** : Cliquez sur **`Send`**.
8. **Résultat attendu** : **Statut `400 Bad Request`**. L'API vous protège et réclame les champs obligatoires (le "nom" manque).
9. **Le Succès** : Ajoutez la ligne `"nom": "Diop",` dans votre JSON, puis cliquez sur `Send`. 
   -> **Statut `201 Created`** avec un **matricule généré automatiquement**.

---

## 🔵 Partie 2 : Tester les Administrateurs (CRUD)

### 1. Ajouter un Admin (POST)
1. **Nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Choisissez **`POST`**.
3. **URL** : `http://localhost:3000/api/admins`.
4. **Auth** : Onglet **`Authorization`** -> Type **`Bearer Token`** -> Collez votre Token.
5. **Body** : Onglet **`Body`** -> **`raw`** -> Menu déroulant **`JSON`**.
   ```json
   {
       "nom": "Ndiaye",
       "prenom": "Fatou",
       "telephone": "771234567",
       "email": "fatou.ndiaye@ucak.edu.sn",
       "password": "passer123"
   }
   ```
6. **Envoyer** : Cliquez sur **`Send`**.
7. **Résultat** : **Statut `201 Created`**. 

### 2. Lire les Admins et voir la sécurité (GET)
1. **Nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Laissez sur **`GET`**.
3. **URL** : `http://localhost:3000/api/admins`.
4. **Auth** : Onglet **`Authorization`** -> Type **`Bearer Token`** -> Collez votre Token.
5. **Envoyer** : Cliquez sur **`Send`**.
6. **Résultat** : **Statut `200 OK`**. Vous verrez toutes les informations de Fatou.

---

## 🟡 Partie 3 : La Sécurité (Authentification et Token)

### 1. Obtenir le Token (Login)
*C'est ici que vous expliquez comment vous avez obtenu la fameuse "clé" utilisée dans les parties 1 et 2.*
1. **Nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Choisissez **`POST`**.
3. **URL** : `http://localhost:3000/api/auth/login`.
4. **Body** : Onglet **`Body`** -> **`raw`** -> Menu déroulant **`JSON`**.
   ```json
   {
       "email": "admin@ucak.edu.sn",
       "password": "admin"
   }
   ```
5. **Envoyer** : Cliquez sur **`Send`**.
6. **Résultat** : **Statut `200 OK`**. L'API vous renvoie votre fameux JWT Token. 

### 2. Tester la Blacklist (Déconnexion)
1. **Nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Choisissez **`POST`**.
3. **URL** : `http://localhost:3000/api/auth/logout`.
4. **Auth** : Onglet **`Authorization`** -> Type **`Bearer Token`** -> Collez le Token actif.
5. **Envoyer** : Cliquez sur **`Send`**.
6. **Résultat** : **Statut `200 OK`** avec le message *"Déconnecté avec succès"*.
7. **La Preuve finale** : Retournez sur l'onglet de votre requête de la **Partie 1** (Ajout d'étudiant). Sans rien modifier, cliquez directement sur **`Send`**. 
   -> **Résultat immédiat** : **Statut `401 Unauthorized`**. Le token a été placé sur liste noire par le serveur, il est officiellement détruit !
