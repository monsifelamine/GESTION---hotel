# Application de Gestion de Réservation (Salles / Matériel)

Ce projet est une application web interne permettant de réserver des ressources tout en évitant les conflits d'horaires.

## Technologies
- **Backend** : Laravel 11.x (API REST) + Sanctum
- **Frontend** : React JS (Vite) + Axios + Bootstrap 5
- **Database** : SQLite (par défaut) / MySQL possible.
- **UI** : Lucide-React / FullCalendar / SweetAlert2

## Installation

### 1. Prérequis
- PHP 8.2+
- Composer
- Node.js & NPM

### 2. Configuration du Backend
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
# La base de données est déjà configurée en SQLite (database/database.sqlite)
php artisan migrate:fresh --seed
php artisan serve
```
**Accès API :** http://localhost:8000

### 3. Configuration du Frontend
```bash
cd frontend
npm install
npm run dev
```
**Accès Application :** http://localhost:5173

## Identifiants de test (Seed)

| Rôle  | Email              | Mot de passe |
|-------|--------------------|--------------|
| Admin | admin@example.com  | password     |
| User  | user@example.com   | password     |

## Fonctionnalités
- Authentification avec Token Sanctum.
- Gestion des catégories et ressources (Admin).
- Vue Calendrier dynamique.
- Réservations avec règle anti-chevauchement.
- Système de notifications en temps réel (Polling).
- Annulation par le créateur.
- Validation des dates et horaires.

## Auteur
Antigravity AI (Pair Programming)
