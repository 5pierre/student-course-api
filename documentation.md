# Documentation Technique Student-Course API

## 📋 Table des matières
- [Présentation](#présentation)
- [Démarrage rapide](#-démarrage-rapide)
- [Architecture](#-architecture)
- [Installation et configuration](#-installation-et-configuration)
- [Documentation Swagger](#-documentation-swagger)
- [API Endpoints](#-api-endpoints)
- [Exemples d'utilisation](#-exemples-dutilisation)
- [Tests](#-tests)
- [Checklist](#-checklist)

---

## Présentation

**Student-Course API** est une API REST pour gérer un système d'étudiants et de cours avec gestion des inscriptions. L'application utilise un stockage en mémoire (pas de base de données).

### Fonctionnalités principales
- ✅ Gestion complète des étudiants (CRUD)
- ✅ Gestion complète des cours (CRUD)
- ✅ Système d'inscription/désinscription
- ✅ Pagination et filtrage
- ✅ Validation des données
- ✅ Documentation Swagger interactive
- ✅ Tests unitaires et d'intégration

---

##  Démarrage rapide

```bash
# Installation
npm install

# Démarrage du serveur
npm start

# Démarrage en mode développement (avec nodemon)
npm run dev

# Lancer les tests
npm test

# Lancer les tests avec couverture
npm run test:coverage
```

L'API sera accessible sur : **http://localhost:3000**

---

## 🏗 Architecture

### Structure du projet
```

student-course-api/
├── src/
│   ├── app.js                     # Configuration Express et middleware
│   ├── controllers/               # Logique métier
│   │   ├── coursesController.js   # Contrôleur des cours
│   │   └── studentsController.js  # Contrôleur des étudiants
│   ├── routes/                    # Définition des routes endpoints
│   │   ├── courses.js             # Routes des cours
│   │   └── students.js            # Routes des étudiants
│   └── services/
│       └── storage.js             # Stockage en mémoire
├── tests/
│   ├── integration/
│   │   └── app.test.js           # Tests end-to-end
│   └── unit/
│       └── storage.test.js       # Tests unitaires
├── swagger.json                   # Documentation API OpenAPI 3.0
├── package.json
└── README.md

```

### Technologies utilisées
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Swagger UI Express** - Documentation interactive
- **Jest** - Framework de tests
- **Supertest** - Tests HTTP

---

## 🔧 Installation et configuration

### Prérequis
- Node.js (version 14 ou supérieure)
- npm (gestionnaire de paquets Node.js)

### Installation

1. **Cloner le dépôt**
```bash
git clone <repository-url>
cd student-course-api
```

1.5 **installer nodejs et npm**
```bash
sudo apt install nodejs npm
```

```powershell
choco install nodejs
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer l'application**
```bash
# Mode production
npm start

# Mode développement (avec rechargement automatique)
npm run dev
```

### Variables d'environnement
Le serveur utilise le port **3000** par défaut. Pour le modifier :
```bash
PORT=8080 npm start
```

---

## 📚 Documentation Swagger

### Accès à la documentation
La documentation interactive Swagger est accessible à l'adresse :

**http://localhost:3000/api-docs**

### Tags disponibles
- **Students** : Gestion des étudiants (création, lecture, mise à jour, suppression)
- **Courses** : Gestion des cours (création, lecture, mise à jour, suppression)
- **Enrollment** : Gestion des inscriptions entre étudiants et cours


##  API Endpoints

### Students

#### `GET /students`
Liste tous les étudiants avec pagination et filtrage.

**Query Parameters:**
- `name` (string, optional) - Filtrer par nom
- `email` (string, optional) - Filtrer par email
- `page` (integer, default: 1) - Numéro de page
- `limit` (integer, default: 10) - Nombre d'éléments par page

**Réponses:**
- `200 OK` - Liste des étudiants

---

#### `POST /students`
Créer un nouvel étudiant.

**Body:**
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com"
}
```

**Réponses:**
- `201 Created` - Étudiant créé avec succès
- `400 Bad Request` - Données invalides ou email déjà utilisé

---

#### `GET /students/{id}`
Récupérer un étudiant par son ID avec ses cours inscrits.

**Path Parameters:**
- `id` (integer, required) - ID de l'étudiant

**Réponses:**
- `200 OK` - Étudiant trouvé
- `404 Not Found` - Étudiant non trouvé

---

#### `PUT /students/{id}`
Mettre à jour les informations d'un étudiant.

**Path Parameters:**
- `id` (integer, required) - ID de l'étudiant

**Body:**
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com"
}
```

**Réponses:**
- `200 OK` - Étudiant mis à jour
- `400 Bad Request` - Email déjà utilisé
- `404 Not Found` - Étudiant non trouvé

---

#### `DELETE /students/{id}`
Supprimer un étudiant.

**Path Parameters:**
- `id` (integer, required) - ID de l'étudiant

**Réponses:**
- `204 No Content` - Étudiant supprimé
- `400 Bad Request` - Étudiant inscrit à des cours
- `404 Not Found` - Étudiant non trouvé

---

### Courses

#### `GET /courses`
Liste tous les cours avec pagination et filtrage.

**Query Parameters:**
- `title` (string, optional) - Filtrer par titre
- `teacher` (string, optional) - Filtrer par enseignant
- `page` (integer, default: 1) - Numéro de page
- `limit` (integer, default: 10) - Nombre d'éléments par page

**Réponses:**
- `200 OK` - Liste des cours

---

#### `POST /courses`
Créer un nouveau cours.

**Body:**
```json
{
  "title": "Mathématiques Avancées",
  "teacher": "Dr. Marie Martin"
}
```

**Réponses:**
- `201 Created` - Cours créé avec succès
- `400 Bad Request` - Données invalides

---

#### `GET /courses/{id}`
Récupérer un cours par son ID avec ses étudiants inscrits.

**Path Parameters:**
- `id` (integer, required) - ID du cours

**Réponses:**
- `200 OK` - Cours trouvé
- `404 Not Found` - Cours non trouvé

---

#### `PUT /courses/{id}`
Mettre à jour les informations d'un cours.

**Path Parameters:**
- `id` (integer, required) - ID du cours

**Body:**
```json
{
  "title": "Mathématiques Avancées",
  "teacher": "Dr. Marie Martin"
}
```

**Réponses:**
- `200 OK` - Cours mis à jour
- `400 Bad Request` - Titre déjà utilisé
- `404 Not Found` - Cours non trouvé

---

#### `DELETE /courses/{id}`
Supprimer un cours.

**Path Parameters:**
- `id` (integer, required) - ID du cours

**Réponses:**
- `204 No Content` - Cours supprimé
- `400 Bad Request` - Des étudiants sont inscrits
- `404 Not Found` - Cours non trouvé

---

### Enrollment

#### `POST /courses/{courseId}/students/{studentId}`
Inscrire un étudiant à un cours.

**Path Parameters:**
- `courseId` (integer, required) - ID du cours
- `studentId` (integer, required) - ID de l'étudiant

**Réponses:**
- `201 Created` - Inscription réussie
- `400 Bad Request` - Étudiant déjà inscrit
- `404 Not Found` - Cours ou étudiant non trouvé

---

#### `DELETE /courses/{courseId}/students/{studentId}`
Désinscrire un étudiant d'un cours.

**Path Parameters:**
- `courseId` (integer, required) - ID du cours
- `studentId` (integer, required) - ID de l'étudiant

**Réponses:**
- `200 OK` - Désinscription réussie
- `404 Not Found` - Inscription non trouvée

---

## 💡 Exemples d'utilisation

### Créer un étudiant
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Martin", "email": "alice@example.com"}'
```

### Lister les cours avec filtres
```bash
curl "http://localhost:3000/courses?teacher=Dr&page=1&limit=5"
```

### Inscrire un étudiant à un cours
```bash
curl -X POST http://localhost:3000/courses/1/students/1
```

### Récupérer un étudiant avec ses cours
```bash
curl http://localhost:3000/students/1
```

**Réponse:**
```json
{
  "student": {
    "id": 1,
    "name": "Alice Martin",
    "email": "alice@example.com"
  },
  "courses": [
    {
      "id": 1,
      "title": "Mathématiques",
      "teacher": "Dr. Smith"
    }
  ]
}
```

---

##  Tests

### Lancer les tests
```bash
# Tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm test -- --watch
```

### Couverture actuelle
```

------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                                                                                           
------------------------|---------|----------|---------|---------|-------------------
All files               |    91.2 |       83 |   86.36 |   94.91 |                  
 src                    |      76 |       25 |       0 |      76 |                  
  app.js                |      76 |       25 |       0 |      76 | 32,36-37,41-43   
 src/controllers        |   88.04 |    79.31 |   81.25 |   95.52 |                  
  coursesController.js  |   91.11 |    85.71 |    87.5 |   96.96 | 127              
  studentsController.js |    85.1 |    73.33 |      75 |   94.11 | 138,181          
 src/routes             |   96.55 |       75 |     100 |     100 |                  
  courses.js            |      95 |       75 |     100 |     100 | 83               
  students.js           |     100 |      100 |     100 |     100 |                  
 src/services           |   98.57 |    97.05 |     100 |     100 |                  
  storage.js            |   98.57 |    97.05 |     100 |     100 | 60               
------------------------|---------|----------|---------|---------|-------------------

```

### Types de tests
- **Tests unitaires** : Testent les fonctions du service storage
- **Tests d'intégration** : Testent les endpoints complets de l'API

---

## Checklist:

- [ ] Tests passants (35/35)
- [ ] Couverture > 90% (91.2%)
- [ ] Linting sans erreurs
- [ ] Documentation Swagger complète  

---
