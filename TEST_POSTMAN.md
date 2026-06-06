# 🚀 Guide Méthodique de Test sur Postman

Ce document décrit la méthode exacte, étape par étape, pour configurer et exécuter vos tests dans l'interface de Postman.
Votre serveur doit être en cours d'exécution (`node src/server.js`) sur le port 3000.

---

## Étape 1 : Obtenir le Token d'Authentification (Login)
*Cette étape est cruciale car elle vous donne la "clé" (le Token) pour effectuer les requêtes sécurisées.*

1. **Créer une nouvelle requête** dans Postman en cliquant sur le bouton **`+`**.
2. **Méthode HTTP** : Changez le menu déroulant (sur `GET` par défaut) pour choisir **`POST`**.
3. **URL** : Saisissez exactement `http://localhost:3000/api/auth/login`.
4. **Configurer le Body (Corps de la requête)** :
   - Cliquez sur l'onglet **`Body`** (situé juste en dessous de la barre d'URL).
   - Sélectionnez le bouton radio **`raw`**.
   - Tout au bout de cette même ligne, cliquez sur le texte bleu `Text` (menu déroulant) et choisissez **`JSON`**.
   - Dans la zone de texte en dessous, copiez-collez ce code :
     ```json
     {
         "email": "admin@ucak.edu.sn",
         "password": "admin"
     }
     ```
5. **Envoyer** : Cliquez sur le bouton bleu **`Send`**.
6. **Résultat attendu** : Dans la section de réponse (en bas), vous devez obtenir un **Statut `200 OK`** et un objet JSON contenant une longue chaîne de caractères appelée `token`. 
7. **Action requise** : Sélectionnez ce token (sans les guillemets) et **copiez-le** (`Ctrl+C`). Vous en aurez besoin pour la suite.

---

## Étape 2 : Tester les Sécurités et l'Ajout d'un Étudiant

1. **Créer une nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Choisissez **`POST`**.
3. **URL** : Saisissez `http://localhost:3000/api/etudiants`.
4. **Configurer l'Autorisation (Le Token)** :
   - Cliquez sur l'onglet **`Authorization`** (à côté de Headers et Body).
   - Dans le menu déroulant `Type`, choisissez **`Bearer Token`**.
   - Dans le champ `Token` qui apparaît à droite, **collez** (`Ctrl+V`) le token que vous avez copié à l'Étape 1.
5. **Tester la validation (Provoquer une Erreur 400)** :
   - Allez dans l'onglet **`Body`** -> sélectionnez **`raw`** -> menu déroulant **`JSON`**.
   - Saisissez un JSON volontairement incomplet (ex: on oublie le "nom") :
     ```json
     {
         "prenom": "Aliou",
         "email": "aliou.diop@ucak.edu.sn",
         "filiere": "DAR",
         "niveau": "L1"
     }
     ```
   - Cliquez sur **`Send`**.
   - **Résultat attendu** : **Statut `400 Bad Request`**. Le message d'erreur s'affiche clairement : *"Erreur : Tous les champs (nom, prenom, email, filiere, niveau) sont obligatoires"*.
6. **Tester le succès (Création valide)** :
   - Corrigez le JSON pour qu'il soit complet et valide :
     ```json
     {
         "nom": "Diop",
         "prenom": "Aliou",
         "email": "aliou.diop99@ucak.edu.sn",
         "filiere": "DAR",
         "niveau": "L1"
     }
     ```
   - Cliquez sur **`Send`**.
   - **Résultat attendu** : **Statut `201 Created`**. Le JSON renvoyé montre que le `matricule` a bien été généré automatiquement (ex: `MAT2026005`).

---

## Étape 3 : Tester la Lecture Publique (GET)

1. **Créer une nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Laissez sur **`GET`**.
3. **URL** : Saisissez `http://localhost:3000/api/etudiants`.
4. **Envoyer** : Cliquez sur **`Send`** (Il n'y a besoin ni de Token ni de Body pour cette route publique).
5. **Résultat attendu** : **Statut `200 OK`**. Vous verrez la liste de tous les étudiants s'afficher, incluant le petit nouveau que vous venez de créer à l'Étape 2.

---

## Étape 4 : Tester la Blacklist (Déconnexion)

1. **Créer une nouvelle requête** (bouton **`+`**).
2. **Méthode HTTP** : Choisissez **`POST`**.
3. **URL** : Saisissez `http://localhost:3000/api/auth/logout`.
4. **Configurer l'Autorisation** :
   - Allez dans l'onglet **`Authorization`** -> Type **`Bearer Token`** et collez votre token toujours actif.
5. **Envoyer** : Cliquez sur **`Send`** (Laissez l'onglet Body vide).
6. **Résultat attendu** : **Statut `200 OK`**. Le message affiche *"Déconnecté avec succès"*.
7. **La Preuve (Très important pour l'oral)** :
   - Retournez sur l'onglet de votre requête de l'Étape 2 (Ajout d'un étudiant).
   - Sans rien toucher, cliquez à nouveau sur le bouton **`Send`**.
   - **Résultat attendu** : **Statut `401 Unauthorized`** avec le message *"Accès refusé. Veuillez vous connecter."*. Le serveur sait que ce Token est désormais sur la liste noire, il est devenu totalement inutilisable !
