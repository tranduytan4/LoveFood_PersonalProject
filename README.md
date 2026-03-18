# Smart Food Order 🍔🍕

A modern, responsive, and full-stack food ordering platform designed to provide a seamless digital dining experience. Built with a modern JavaScript stack (React, Node.js, Express, MongoDB), this application allows users to browse menus, explore special deals, manage their shopping carts, and track orders efficiently.

## 🚀 Features

### Frontend (Client)
- **Interactive UI/UX**: Built with React 19 and styled with Tailwind CSS for a fully responsive, mobile-first design.
- **Dynamic Routing**: Single Page Application (SPA) navigation using `react-router-dom`.
- **Product Exploration**: Dedicated pages for Menu, Deals, and Specialities, complete with categorizations.
- **Cart Management**: Real-time shopping cart updates and order summaries.
- **User Dashboard**: Profile management, settings, and order history tracking.

### Backend (Server)
- **RESTful API**: Robust Express.js server providing clear, structured API endpoints.
- **Database Architecture**: MongoDB integration using Mongoose models for Categories and Products.
- **Secure & Scalable**: Configured with CORS and environment variables for secure data handling.

## 🛠️ Tech Stack

**Frontend:**
- React (v19)
- React Router DOM
- Tailwind CSS & PostCSS
- Axios (for API requests)
- React Icons

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- CORS & dotenv

## 📂 Project Structure

```bash
smart-food-order/
├── client/                 # Frontend React Application
│   ├── public/
│   └── src/
│       ├── api/            # Axios API configurations
│       ├── components/     # Reusable UI components (Navbar, Sections, etc.)
│       ├── pages/          # Main logical views (Home, Menu, Cart, Profile, etc.)
│       ├── routes/         # Route definitions
│       ├── store/          # State management
│       ├── styles/         # Global styles and Tailwind configs
│       └── utils/          # Helper functions
│
└── server/                 # Backend Node/Express API
    ├── config/             # DB and environment configurations
    ├── controllers/        # Request handling logic
    ├── middlewares/        # Express custom middlewares
    ├── models/             # Mongoose schemas (Category, Product)
    ├── routes/             # Express API routes
    ├── seed/               # Database seed scripts
    └── utils/              # Backend utilities
```

## ⚙️ Local Development Setup

To get a local copy up and running, follow these simple steps:

### Prerequisites
- Node.js installed on your machine.
- MongoDB running locally or a MongoDB URI connection string.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd smart-food-order
```

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file and configure your variables (e.g. MONGO_URI, PORT=5000)
npm run dev
```
The server will start on port `5000` (or as configured).

### 3. Frontend Setup
```bash
cd ../client
npm install
npm start
```
The client will start on `http://localhost:3000`.

## 💡 Why This Project?
This project demonstrates my proficiency in building end-to-end web applications, encompassing system architecture, responsive frontend design, efficient API communication, and scalable database schema modelling. It highlights my ability to write clean, maintainable code and configure robust full-stack environments.

---
*Created by [Your Name]*
