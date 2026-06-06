# Partie 3 : Sécurité, Authentification et Tokenisation

## 1. Architecture Sans État (Stateless)
Contrairement aux systèmes traditionnels basés sur des sessions stockées côté serveur, cette API REST adopte une architecture "Stateless". Le serveur ne conserve aucune trace de l'état de connexion de l'utilisateur. 
L'authentification est gérée via le standard **JSON Web Token (JWT)**, ce qui offre une excellente évolutivité et une grande flexibilité pour les applications clientes (Web, Mobile).

## 2. Processus de Connexion (Login)
Le point d'entrée `/api/auth/login` gère l'authentification des administrateurs.

1. **Extraction** : Le serveur récupère l'adresse email et le mot de passe envoyés par le client.
2. **Identification** : Le système recherche l'administrateur correspondant à l'email dans la base de données.
3. **Vérification** : L'API compare le mot de passe fourni avec celui stocké dans le fichier JSON.
4. **Génération du Jeton** : En cas de succès, un token JWT est signé à l'aide d'une clé secrète (`SECRET_KEY`) configurée dans l'environnement. Ce token encapsule l'identité de l'utilisateur (id, email) et possède une durée de vie limitée (ex: 1 heure) pour limiter les risques de compromission.

## 3. Le Middleware d'Authentification (`authMiddleware.js`)
Pour protéger les routes sensibles (ajout, modification, suppression), l'API utilise un middleware intercepteur.

- **Interception** : Avant d'atteindre le contrôleur final, le middleware analyse l'en-tête HTTP `Authorization` de la requête.
- **Extraction du Bearer Token** : Le token est isolé de la chaîne "Bearer <token>".
- **Vérification de Validité** : Le système vérifie la signature du token via `jwt.verify()`. Si le token est invalide, expiré, ou absent, la requête est immédiatement rejetée avec un code HTTP 401 (Unauthorized) ou 403 (Forbidden).
- **Transmission** : Si le token est valide, les informations de l'utilisateur sont injectées dans l'objet de requête (`req.user`), et le flux est transmis au contrôleur métier via la fonction `next()`.

## 4. Processus de Déconnexion (Logout) et Blacklist
La norme JWT étant sans état, un token émis reste théoriquement valide jusqu'à son expiration. Pour implémenter une véritable fonctionnalité de déconnexion immédiate, le système utilise une **Blacklist** côté serveur.

- **Révocation** : Lors de l'appel à l'endpoint `/api/auth/logout`, le token actuel fourni par le client est extrait.
- **Stockage en mémoire** : Ce token est ajouté à un objet `Set` (structure de données garantissant l'unicité et offrant des performances de recherche O(1)) agissant comme une liste noire.
- **Validation Renforcée** : Le middleware d'authentification a été enrichi pour vérifier systématiquement si le token présenté ne figure pas dans cette Blacklist. Si c'est le cas, l'accès est refusé, garantissant ainsi l'invalidation définitive de la session.
