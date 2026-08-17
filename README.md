# 🏨 Gestion de Réservation Hôtelière

Application web **Full Stack** permettant de gérer les réservations hôtelières, les chambres, les clients, les paiements et les factures.

## 📌 Description

Ce projet est une application de gestion de réservation hôtelière développée avec **Laravel** pour le Back-End et **React.js** pour le Front-End.

L’objectif est de faciliter la gestion des chambres, des clients et des réservations, tout en permettant de suivre les disponibilités et d’éviter les conflits de réservation.

## ✨ Fonctionnalités

* 🔐 Authentification des utilisateurs
* 👤 Gestion des utilisateurs et des rôles
* 🛏️ Gestion des chambres
* 🗂️ Gestion des catégories
* 👥 Gestion des clients
* 📅 Gestion des réservations
* ❌ Annulation des réservations
* 🔎 Recherche et filtrage
* 💳 Gestion des paiements
* 🧾 Gestion des factures
* 📊 Tableau de bord

## 🛠️ Technologies utilisées

### Front-End

* React.js
* JavaScript
* HTML5
* CSS3
* React Router
* Axios
* Redux / Redux Toolkit

### Back-End

* Laravel
* PHP
* API REST
* Laravel Sanctum

### Base de données

* MySQL

## 🏗️ Architecture

```text
React.js
   │
   │ Axios / API REST
   ▼
Laravel
   │
   ▼
MySQL
```

## 📂 Structure du projet

```text
Gestion-Reservation-Hoteliere/
│
├── backend/
├── frontend/
└── README.md
```

## ⚙️ Installation

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend :

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend :

```text
http://localhost:3000
```

## 🔐 Compte de démonstration

Pour tester l’application :

```text
Email : admin@example.com
Mot de passe : password
Rôle : Administrateur
```

## 👨‍💻 Auteur

**El Amine Monsif**

Développement Digital – Option Web Full Stack

### Technologies

`Laravel` `React.js` `PHP` `JavaScript` `MySQL` `HTML5` `CSS3` `REST API`



