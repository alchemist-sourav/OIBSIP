# 🍕 Pieza - Modern Full-Stack Pizza Delivery SaaS

<div align="center">
  <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Pieza Banner" width="100%">
</div>

<br />

<div align="center">
  <a href="#features">Features</a> •
  <a href="#architecture--tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#api-endpoints">API Docs</a> •
  <a href="#demo">Demo</a>
</div>

<br />

## 📋 Project Overview
Pieza is a premium, fully-responsive Full-Stack MERN application designed to emulate a top-tier SaaS product. Built as the final submission for the **Oasis Infobyte Web Development Internship (Level 3)**, it offers a visual custom pizza builder, secure JWT authentication, a complete admin dashboard, inventory management, and real-time order tracking via WebSockets.

---

## ✨ Features

### 👤 User Portal
- **Secure Authentication**: JWT-based secure login, registration, and password recovery.
- **Visual Pizza Builder**: A dynamic, multi-step pizza builder (Base -> Sauce -> Cheese -> Veggies) with live pricing.
- **Real-Time Tracking**: WebSockets (`Socket.io`) instantly update your order status (Order Placed ➔ In Kitchen ➔ Delivered) without refreshing.
- **Payment Gateway**: Integration-ready Razorpay checkout flow (currently in simulated demo mode).
- **Order History**: Track past orders and generate re-orders seamlessly.

### 🛡️ Admin Dashboard
- **Role-Based Access**: Dedicated `/admin` routes protected by robust backend middleware.
- **Inventory Management**: Full CRUD operations to track and update stock levels for all ingredients.
- **Live Order Control**: Admins can update the status of active orders, which instantly pushes updates to the respective user's dashboard via WebSockets.
- **User Management**: View, promote, or ban users directly from the dashboard.

---

## 🛠️ Architecture & Tech Stack

**Frontend**
- React.js (v18)
- TailwindCSS & Framer Motion (Styling & Animations)
- Lucide React (Icons)
- Socket.io-client
- Axios

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- Socket.io (WebSockets)
- bcryptjs & jsonwebtoken (Security)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or Local)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pieza.git
cd pieza
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (see `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pizza
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
SKIP_EMAIL_VERIFICATION=true
```
Seed the database and start the server:
```bash
node seedInventory.js
npm run dev
```
*(Note: Starting the server automatically generates a default admin account: `admin@example.com` / `Admin@123`)*

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000
```
Start the frontend:
```bash
npm start
```

---

## 📡 API Endpoints

| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/inventory` | Fetch available pizza ingredients | No |
| POST | `/api/orders` | Submit a new order | Yes (User) |
| GET | `/api/orders` | Fetch order history | Yes (User) |
| GET | `/api/orders/all` | Fetch all system orders | Yes (Admin) |
| PUT | `/api/orders/:id/status`| Update order status | Yes (Admin) |
| PUT | `/api/inventory/:id` | Update ingredient stock | Yes (Admin) |

---

## 📸 Screenshots

*(To be added by the maintainer in the `/screenshots` folder)*
- Landing Page
- Visual Pizza Builder
- User Dashboard & Real-time Tracking
- Admin Analytics & Inventory Control

---

## 🎓 Internship Compliance Checklist (Oasis Infobyte)
- [x] Registration & Login System
- [x] Custom Pizza Builder
- [x] Payment Integration (Simulated via Fake-Pay)
- [x] Real-Time Order Tracking
- [x] Admin Login & Dashboard
- [x] Inventory Stock Updates
- [x] Live Order Status Updates

---

## 📝 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Developed for the Oasis Infobyte Web Development Internship.
