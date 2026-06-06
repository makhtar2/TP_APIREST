# 🚀 Guide de Test Postman

Votre serveur tourne sur `http://localhost:3000`. Voici les requêtes à créer dans Postman pour tout tester.

---

## 🔑 1. L'Authentification (Le plus important !)

### A. Se connecter (Login)
*Vous devez générer un Token pour pouvoir ajouter ou modifier des données.*
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/auth/login`
- **Body** (raw -> JSON) :
```json
{
    "email": "admin@ucak.edu.sn",
    "password": "admin"
}
```
👉 **À faire** : Copiez le `token` reçu dans la réponse.

---

## 🟢 2. Tester les Étudiants

### A. Lire la liste (Public)
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/etudiants`
- **Auth** : *Aucune autorisation requise*

### B. Ajouter un Étudiant (Protégé)
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/etudiants`
- **Auth** : Allez dans l'onglet `Authorization` -> Type: `Bearer Token` -> Collez votre token.
- **Body** (raw -> JSON) :
```json
{
    "nom": "Diop",
    "prenom": "Aliou",
    "email": "aliou.diop@ucak.edu.sn",
    "filiere": "DAR",
    "niveau": "L1"
}
```
👉 **Remarque** : Observez la réponse 201 Created. Le `matricule` (ex: MAT2026005) a été généré automatiquement !

### C. Tester les erreurs (Contrôle de saisie)
Essayez d'envoyer la requête précédente mais avec `"filiere": "MATHS"` ou en supprimant le `"nom"`. 
👉 Vous verrez vos sécurités renvoyer une erreur 400.

---

## 🔵 3. Tester les Administrateurs

### A. Ajouter un Admin (Protégé)
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/admins`
- **Auth** : Type `Bearer Token` avec votre token.
- **Body** (raw -> JSON) :
```json
{
    "nom": "Ndiaye",
    "prenom": "Fatou",
    "telephone": "771234567",
    "email": "fatou.ndiaye@ucak.edu.sn",
    "password": "passer123"
}
```

### B. Lire les Admins (Protégé)
- **Méthode** : `GET`
- **URL** : `http://localhost:3000/api/admins`
- **Auth** : Toujours le `Bearer Token`.
👉 Vous verrez que le mot de passe de Fatou a été transformé en une longue chaîne de caractères (Hachage bcrypt !).

---

## 🚪 4. La Déconnexion

### A. Détruire son Token (Logout)
- **Méthode** : `POST`
- **URL** : `http://localhost:3000/api/auth/logout`
- **Auth** : Type `Bearer Token` avec le token à détruire.
- **Body** : *Vide*
👉 Le serveur répondra "Déconnecté avec succès". Si vous essayez d'ajouter un étudiant avec ce même token juste après, vous aurez une erreur `401 Unauthorized` car le token est sur la Blacklist !
