## Netflix Definitive Edition - A Streaming Platform 💻🎬

Welcome to the **Netflix Definitive Edition** project! This repository provides a detailed implementation of a Netflix-like streaming platform that integrates modern technologies to handle user authentication, video streaming, subscription payments, and an admin panel for managing content. The platform is scalable and cleanly organized, making it easy to expand and customize.

---

### 🎯 Project Goal

The objective of this project is to create a **Netflix-like streaming platform** with the following core features:
- **User Authentication** with support for OAuth (Google, GitHub, etc.)
- **Video Streaming & Management** (using React-Player)
- **Subscription & Payment System** (dummy integration with Razorpay)
- **Admin Panel** for content management
- **API for User Data & Content**

---

### 🛠 Tech Stack & Tools

#### Frontend
- **Next.js 14** – A React framework with Server-Side Rendering (SSR) for SEO and performance benefits
- **TailwindCSS** – Utility-first CSS framework for responsive and modern design
- **React-Player** – For video playback and streaming
- **ShadCN / Radix UI** – For modern, accessible UI components

#### Backend
- **Express.js & Node.js** – Backend API development with RESTful routes
- **MongoDB** & **Mongoose** – NoSQL database for scalable storage
- **JWT / OAuth** – For secure authentication
- **Multer & Cloudinary** – For handling file uploads and media storage
- **Razorpay API** – For payment gateway integration (dummy payment for now)

#### Dev Tools & Deployment
- **Postman** – For API testing
- **Vercel** – Deployment platform for the Next.js frontend
- **Railway / Render** – For deploying the backend API
- **GitHub Actions** – For CI/CD pipeline automation

---

### 📁 File Structure (Clean & Scalable)

```bash
/netflix-definitive
│── backend/                   # Express.js Backend
│   ├── controllers/           # Business Logic for APIs
│   ├── models/                # MongoDB Schemas
│   ├── routes/                # API Routes
│   ├── middleware/            # Auth & Security Middleware
│   ├── config/                # Env & Database Config
│   ├── utils/                 # Helper Functions
│   ├── server.js              # Entry Point
│   ├── package.json           
│
│── frontend/                  # Next.js Frontend
│   ├── components/            # Reusable UI Components
│   ├── pages/                 # Next.js Pages & Routes
│   ├── hooks/                 # Custom Hooks
│   ├── context/               # Global State Management
│   ├── styles/                # Tailwind & Custom CSS
│   ├── utils/                 # Utility Functions
│   ├── public/                # Static Files (Logos, Icons)
│   ├── package.json           
│
│── .env                       # Environment Variables
│── .gitignore                 
│── README.md                  
```

---

### 📝 Step-by-Step Implementation Guide

#### ✅ Step 1: Initialize the Project

**Backend Setup:**

```bash
mkdir netflix-definitive && cd netflix-definitive
mkdir backend frontend
cd backend
npm init -y
npm install express mongoose dotenv cors jsonwebtoken bcryptjs multer cloudinary
```

**Frontend Setup:**

```bash
cd ../frontend
npx create-next-app@latest .
npm install tailwindcss axios react-hook-form next-auth @radix-ui/react-icons
```

#### ✅ Step 2: Connect to MongoDB

Add MongoDB connection to `backend/config/db.js`:

```javascript
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
```

And in `backend/server.js`, connect the database:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.listen(5000, () => console.log('Server running on port 5000'));
```

#### ✅ Step 3: Implement Authentication (OAuth + JWT)

In `frontend/pages/api/auth/[...nextauth].js`, configure OAuth with Google:

```javascript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  }
});
```

#### ✅ Step 4: Video Streaming (React Player)

Install React Player:

```bash
npm install react-player
```

Create `frontend/components/VideoPlayer.js`:

```javascript
import ReactPlayer from 'react-player';
const VideoPlayer = ({ url }) => {
  return <ReactPlayer url={url} controls={true} width="100%" />;
};
export default VideoPlayer;
```

#### ✅ Step 5: Payment Integration (Razorpay)

Install Razorpay SDK:

```bash
npm install razorpay
```

Create `backend/routes/payment.js` for payment functionality:

```javascript
const express = require('express');
const Razorpay = require('razorpay');
require('dotenv').config();

const router = express.Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

router.post('/order', async (req, res) => {
  const options = { amount: 50000, currency: "INR", receipt: "order_rcptid_11" };
  const order = await razorpay.orders.create(options);
  res.json(order);
});

module.exports = router;
```

---

### 🌟 Suggestions for the "Definitive Edition" (Premium Features)

Enhance this platform by integrating additional premium features:
- **User Profiles**: Allow users to create multiple profiles within a single account.
- **Live Streaming Support**: Implement HLS streaming using services like MUX for live events.
- **AI-Powered Recommendations**: Use OpenAI, TensorFlow.js, or other ML models to provide personalized recommendations.
- **Offline Download Feature**: Allow users to download content for offline viewing.
- **Multi-Language Subtitles**: Enable support for multiple languages with subtitles.

---

### 🚀 Final Thoughts

This project serves as a solid foundation for building a Netflix-like streaming service with modern web technologies. The features can be expanded and customized as you see fit, providing you with ample room for further enhancements. Whether you're building a personal project or aiming for a premium streaming platform, this guide offers the tools to get you started.

---

Happy coding! 😊 Let me know if you need any more help with specific sections or additional features!