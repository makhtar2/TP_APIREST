# API de Gestion des Etudiants - TP REST

Ce projet est une application backend construite avec **Node.js** et **Express**. Elle permet de gerer une base de donnees d'etudiants et d'administrateurs via une interface RESTful. Le projet met en avant la gestion du CRUD, l'authentification par jeton (JWT) et le hachage des mots de passe.

## Objectifs du Projet
- Implementer une API REST complete.
- Securiser les acces via des Middlewares.
- Utiliser JSON comme systeme de stockage de donnees persistant.
- Gerer deux entites distinctes : Administrateurs et Etudiants.

## Technologies Utilisees
- **Node.js** : Environnement d'execution.
- **Express** : Framework web pour la gestion des routes.
- **JWT (JsonWebToken)** : Pour l'authentification securisee.
- **Dotenv** : Pour la gestion des variables d'environnement.

## Structure du Dossier
```text
TP_APIREST/
├── src/
│   ├── config/          # Configuration (chemins de stockage)
│   ├── controllers/     # Logique metier (CRUD Admin, Etudiant, Auth)
│   ├── data/            # Fichiers JSON (admins.json, etudiants.json)
│   ├── middleware/      # Verifications de securite (Auth, Roles)
│   ├── routes/          # Definition des points d'entree de l'API
│   └── server.js        # Point d'entree principal de l'application
├── .env                 # Variables de configuration (Port, Secret JWT)
├── .gitignore           # Fichiers ignores par Git
├── package.json         # Liste des dependances
└── README.md            # Documentation principale
```

## Installation et Utilisation

1. **Cloner le projet**
2. **Installer les modules** :
   ```bash
   npm install
   ```
3. **Configurer l'environnement** : Creer un fichier `.env` a la racine avec :
   ```env
   PORT=3000
   JWT_SECRET=votre_cle_secrete
   ```
4. **Lancer le serveur** :
   ```bash
   node src/server.js
   ```

## Points de Terminaison (API Endpoints)

### Authentification
| Methode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Connexion et reception du Token |
| `POST` | `/api/auth/logout` | Deconnexion (invalidation du Token) |

### Gestion des Etudiants (`/api/etudiants`)
*Note : La consultation est publique, mais la modification demande d'etre authentifie.*

| Methode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/etudiants` | Lister tous les etudiants |
| `GET` | `/api/etudiants/:id` | Recuperer un etudiant precis |
| `POST` | `/api/etudiants` | Ajouter un etudiant (Admin) |
| `PUT` | `/api/etudiants/:id` | Modifier un etudiant (Admin) |
| `DELETE` | `/api/etudiants/:id` | Supprimer un etudiant (Admin) |

### Gestion des Admins (`/api/admins`)
*Note : Toutes ces routes sont protegees.*

| Methode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admins` | Lister les administrateurs |
| `POST` | `/api/admins` | Creer un nouvel administrateur |

## 📚 Documentation Interactive (Swagger)

Ce projet inclut une documentation interactive générée avec **Swagger**. Elle permet de visualiser toutes les routes disponibles et de tester l'API directement depuis le navigateur.

### Installation de Swagger (Déjà inclus)
Si vous clonez ce projet, Swagger est déjà configuré. Les dépendances utilisées sont :
```bash
npm install swagger-ui-express swagger-jsdoc
```

### Comment utiliser Swagger ?
1. Démarrez le serveur (en mode dev pour le rechargement automatique) :
   ```bash
   npm run dev
   ```
2. Ouvrez votre navigateur et accédez à l'URL suivante :
   👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**
3. Vous verrez l'interface de Swagger avec toutes les routes documentées (`GET`, `POST`, `PUT`, `DELETE`).

### Tester les routes protégées (Cadenas 🔒)
Certaines routes nécessitent des droits d'administration (Ajout, Modification, Suppression).
1. Allez sur la route `POST /api/auth/login` dans Swagger, cliquez sur *Try it out* et connectez-vous avec les identifiants d'un admin.
2. Copiez le **Token JWT** renvoyé dans la réponse (sans les guillemets).
3. Remontez en haut de la page Swagger et cliquez sur le bouton **Authorize**.
4. Collez votre Token dans le champ *Value*, cliquez sur *Authorize*, puis *Close*.
5. Vous pouvez maintenant tester toutes les routes protégées, Swagger attachera automatiquement votre Token !

## Exemple de Donnees Etudiant
```json
{
  "matricule": "MAT2026005",
  "nom": "Lo",
  "prenom": "Amy",
  "email": "amy.lo@ucak.edu.sn",
  "filiere": "DAR",
  "niveau": "L3"
}
```

## Auteur
Realise dans le cadre d'un TP sur les API REST pour l'UCAK.
