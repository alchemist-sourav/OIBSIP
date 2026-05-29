# 🍕 Pieza - Custom Pizza Ordering Platform

A full-stack, modern web application for ordering custom-built pizzas. Built with the MERN stack (MongoDB, Express, React, Node.js), Pieza allows users to craft their perfect pizza, process payments securely, and track their order in real-time.

## ✨ Features

- **Custom Pizza Builder**: Interactive dashboard to build your pizza by selecting:
  - Base (Thin Crust, Wheat, Cheese Burst, etc.)
  - Sauce (Tomato, BBQ, Pesto, Spicy, Garlic)
  - Cheese (Mozzarella, Cheddar, Parmesan)
  - Veggies (Onions, Capsicum, Mushrooms, Olives, etc.)
- **Real-time Order Tracking**: Powered by Socket.io to provide live updates on order status (e.g., Received, Preparing, Out for Delivery, Delivered).
- **Secure Authentication**: User registration and login using JWT (JSON Web Tokens). Includes role-based access control (User vs. Admin).
- **Payment Gateway Integration**: Seamless checkout experience integrated with Razorpay for secure online payments.
- **Order History**: Users can view their past orders, including the exact ingredients selected for each pizza.
- **Premium UI/UX**: A highly responsive, modern, glassmorphism-inspired design with dynamic animations and rich imagery.

## 🛠️ Tech Stack

### Frontend (Client)
- **React.js**: Frontend UI library
- **Tailwind CSS**: Utility-first CSS framework for rapid, beautiful styling
- **React Router**: For client-side routing
- **Axios**: Promise-based HTTP client for API requests
- **Socket.io-client**: Real-time bidirectional event-based communication

### Backend (Server)
- **Node.js & Express.js**: Fast, unopinionated, minimalist web framework
- **MongoDB & Mongoose**: NoSQL database and object modeling
- **JWT (JSON Web Tokens)**: Secure user authentication
- **Socket.io**: Real-time engine for order updates
- **Razorpay API**: Payment processing

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)
- Razorpay Account (for API keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pizza-app
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

5. **Seed the Database (Optional)**
   If you want to pre-populate the inventory:
   ```bash
   cd server
   node seedInventory.js
   ```

### Running the Application

You need to run both the server and the client concurrently.

**Run the Backend Server:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Run the Frontend Client:**
```bash
cd client
npm start
# Client runs on http://localhost:3000
```

## 📸 Screenshots

*(Feel free to add your own screenshots of the Login page, Pizza Builder Dashboard, and Checkout process here!)*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
