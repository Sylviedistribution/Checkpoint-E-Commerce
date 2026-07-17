# Boutik — Site E-Commerce Full Stack (MERN)

Projet e-commerce complet développé avec la stack **MongoDB, Express.js, React.js, Node.js**, en appliquant les principes de *Clean Code* (fonctions courtes à responsabilité unique, noms explicites, gestion d'erreurs explicite, fonctions pures, ES6+, tests unitaires).

## Fonctionnalités

- **Catalogue produits** : liste paginée, recherche plein texte, filtres par catégorie et par prix
- **Fiche produit** : détails, stock, avis clients avec notes (1–5 étoiles)
- **Authentification** : inscription, connexion, session persistante (JWT), rôles `customer` / `admin`
- **Panier** : ajout, modification des quantités, suppression, persistance locale
- **Commande** : adresse de livraison, choix du mode de paiement, vérification du stock, décrément automatique du stock
- **Historique** : page « Mes commandes » avec statuts (en attente, payée, expédiée…)
- **Administration (API)** : CRUD produits réservé au rôle admin

## Structure du projet

```
ecommerce-mern/
├── backend/                 # API REST Node.js / Express
│   ├── config/db.js         # Connexion MongoDB
│   ├── models/              # Schémas Mongoose (User, Product, Order)
│   ├── controllers/         # Logique métier
│   ├── routes/              # Définition des endpoints
│   ├── middleware/          # Auth JWT, gestion d'erreurs
│   ├── utils/               # Fonctions pures testables
│   ├── tests/               # Tests unitaires (node --test)
│   └── seed/seeder.js       # Données de démonstration
└── frontend/                # Application React (Vite)
    └── src/
        ├── api/             # Client Axios + intercepteur JWT
        ├── context/         # AuthContext, CartContext (Context API)
        ├── components/      # Composants réutilisables
        ├── pages/           # Pages (catalogue, produit, panier, checkout…)
        └── styles/          # CSS global (variables, responsive)
```

## Prérequis

- Node.js ≥ 18 et npm
- MongoDB local **ou** un cluster gratuit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Installation et lancement en local

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # puis remplir MONGO_URI et JWT_SECRET
npm run seed                # (optionnel) 8 produits de démo + compte admin
npm run dev                 # API sur http://localhost:5000
```

Compte admin créé par le seed : `admin@shop.local` / `admin123`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # Application sur http://localhost:5173
```

Le proxy Vite redirige automatiquement `/api` vers le backend (port 5000).

### 3. Tests

```bash
cd backend
npm test
```

## Principaux endpoints de l'API

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Inscription |
| POST | `/api/auth/login` | Public | Connexion (retourne un JWT) |
| GET | `/api/auth/me` | Connecté | Profil courant |
| GET | `/api/products` | Public | Liste (recherche, filtres, pagination) |
| GET | `/api/products/:id` | Public | Détail d'un produit |
| POST/PUT/DELETE | `/api/products` | Admin | CRUD produits |
| POST | `/api/products/:id/reviews` | Connecté | Ajouter un avis |
| POST | `/api/orders` | Connecté | Créer une commande |
| GET | `/api/orders/mine` | Connecté | Mes commandes |
| PUT | `/api/orders/:id/pay` | Connecté | Marquer comme payée |

## Déploiement

### Option A — Render / Railway (le plus simple, gratuit)

1. Pousser le projet sur GitHub (voir plus bas).
2. **Base de données** : créer un cluster gratuit sur MongoDB Atlas, autoriser l'accès réseau (`0.0.0.0/0` pour un projet d'étude) et copier la chaîne de connexion.
3. **Backend** : sur [Render](https://render.com), créer un *Web Service* pointant sur le dossier `backend`, commande de build `npm install`, commande de démarrage `npm start`. Définir les variables d'environnement `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
4. **Frontend** : créer un *Static Site* pointant sur `frontend`, build `npm install && npm run build`, dossier de publication `dist`. Ajouter une règle de *rewrite* `/api/* → URL-du-backend/api/*` (ou définir `baseURL` d'Axios sur l'URL du backend).

### Option B — Microsoft Azure (comme suggéré dans le sujet)

1. Créer un *Resource Group*.
2. Base de données : Azure Cosmos DB (API MongoDB) ou MongoDB Atlas.
3. Backend : *App Service* Node.js, déployé via GitHub Actions ; variables d'environnement dans **Configuration**.
4. Frontend : *Static Web App* alimentée par le build Vite (`npm run build`, dossier `dist`), avec l'URL de l'API en variable d'environnement.

## Publication sur GitHub (Checkpoint)

```bash
cd ecommerce-mern
git init
git add .
git commit -m "feat: site e-commerce MERN complet"
git branch -M main
git remote add origin https://github.com/VOTRE_UTILISATEUR/ecommerce-mern.git
git push -u origin main
```

## Clean Code appliqué

- **Noms explicites** : `calculateOrderTotal`, `verifyStockAndBuildItems`, `restoreSession` (pas de `d`, `temp`, `data` ambigus)
- **Responsabilité unique** : contrôleurs fins, logique de prix isolée dans `utils/pricing.js`, validation du stock séparée de la création de commande
- **Gestion d'erreurs explicite** : middleware d'erreurs centralisé, messages clairs côté client, aucun échec silencieux
- **Fonctions pures** : `calculateOrderTotal`, `formatPrice`, `buildProductFilters` — testables sans effet de bord
- **ES6+** : modules, `async/await`, destructuring, fonctions fléchées, `filter`/`map`/`reduce`
- **Tests** : tests unitaires sur les fonctions pures (`npm test`)
- **Injection de dépendances** : la connexion DB reçoit son URI en paramètre ; le client HTTP est centralisé et injecté via import unique
