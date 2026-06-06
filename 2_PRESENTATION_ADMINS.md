# Partie 2 : Gestion de l'Entité Administrateur (CRUD)

## 1. Rôle et Responsabilités
L'entité "Administrateur" représente les utilisateurs privilégiés disposant des droits d'altération (Création, Modification, Suppression) sur le système. Les données sont persistées de manière sécurisée dans `src/data/admins.json`.

La structure de données d'un administrateur intègre des informations de contact et d'authentification :
- `id` : Identifiant unique auto-incrémenté.
- `nom` & `prenom` : Informations d'identité.
- `telephone` : Numéro de contact (unique).
- `email` : Adresse électronique servant d'identifiant de connexion (unique).
- `password` : Empreinte cryptographique du mot de passe.

## 2. Implémentation du Contrôleur (`adminController.js`)
Le contrôleur gère l'ensemble du cycle de vie des administrateurs avec une attention particulière portée sur la sécurité des données sensibles.

### A. Opérations de Lecture (GET)
- **Liste complète** : L'endpoint `GET /api/admins` renvoie l'ensemble des administrateurs enregistrés.
- **Détail** : L'endpoint `GET /api/admins/:id` permet de cibler un profil spécifique.
*Toutes les opérations sur le contrôleur administrateur requièrent un jeton d'authentification valide.*

### B. Validation et Unicité (POST / PUT)
Pour garantir la cohérence de la base de données, le contrôleur impose des règles d'unicité strictes :
- **Vérification croisée** : Lors d'une création ou d'une mise à jour, le système s'assure via la fonction `Array.prototype.some()` que ni l'email ni le numéro de téléphone fournis ne sont déjà présents dans le système.
- En cas de conflit, l'API interrompt le processus et renvoie un code HTTP 400 avec un message d'erreur explicite.

### C. Sécurisation Cryptographique
Le stockage des mots de passe en clair (plain text) constituant une vulnérabilité critique, l'API intègre la bibliothèque `bcryptjs`.
- **Hachage** : Lors de la création (POST), le mot de passe reçu est haché avec un "salt" (grain de sel) de 10 itérations, garantissant une forte résistance contre les attaques par force brute ou par dictionnaire.
- **Mise à jour sécurisée** : Lors d'une modification (PUT), si un nouveau mot de passe est détecté dans le corps de la requête, il subit le même processus de hachage avant d'écraser l'ancienne empreinte.
- **Manipulation des objets** : Le code utilise la déstructuration (rest operator `...`) pour extraire élégamment le mot de passe des autres données entrantes avant le traitement.
