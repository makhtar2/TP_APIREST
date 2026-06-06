# 🚀 Guide de Démonstration Postman (TP API REST)

Ce document est votre feuille de route pour la présentation. Il décrit les étapes exactes à suivre pour prouver à votre professeur que votre API est complète, robuste (contrôle de saisie) et sécurisée.

---

## 🛑 Étape 1 : Montrer que la sécurité bloque les intrus
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

---

## 🔑 Étape 2 : L'Authentification (Générer le Token)
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

---

## 🛡️ Étape 3 : Contrôle de saisie et Validation
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

---

## ✅ Étape 4 : Le Succès (Création de l'étudiant avec Matricule Auto)
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

---

## 🔍 Étape 5 : Lecture Publique
*Montrer que tout le monde peut voir la liste.*

1. Créez une requête **GET** vers `http://localhost:3000/api/etudiants`
2. Pas besoin d'autorisation (Auth: None).
3. **Cliquez sur "Send"**.
4. 👉 **Ce que le prof doit voir** : La liste complète des étudiants apparaît, et Aliou Diop est bien tout en bas de la liste avec son nouveau matricule !

---

## 🚪 Étape 6 : La Déconnexion (Logout)
*On détruit le token pour montrer la Blacklist.*

1. Créez une requête **POST** vers `http://localhost:3000/api/auth/logout`
2. Mettez votre **Bearer Token** dans l'onglet Auth.
3. **Cliquez sur "Send"**.
4. 👉 **Ce que le prof doit voir** : `"Déconnecté avec succès"`.
5. **Coup de grâce** : Retournez sur la requête d'ajout d'un étudiant (Étape 4) et cliquez à nouveau sur Send avec le même token. 
   * Résultat attendu : `401 Accès refusé` (Le token est blacklisté, il n'est plus valable).

---

### 🎉 Conclusion
Finissez votre présentation en disant : 
> *"Nous avons une API entièrement sécurisée par JWT, persistante via JSON, et surtout robuste grâce à des contrôles de saisie (validation) qui empêchent le serveur de planter face aux erreurs des testeurs."*
