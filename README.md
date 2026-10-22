<<<<<<< HEAD
<div align="center">
 
 # ✦ AR-Y-Try — Next-Gen Spatial E-Commerce
 
 <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
 <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
 <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
 <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
 <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
 <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
 <img src="https://img.shields.io/badge/Gemini_2.0-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
 
 <br/>
 
 **Redefining digital fashion through spatial computing, fluid aesthetics, and Generative AI.**
 
 AR-Y-Try is an industry-grade, highly interactive "Cyber-Premium" e-commerce application. It seamlessly blends a robust, security-first Node.js backend with an immersive React 3D frontend experience, natively connected to a downloadable AI-powered Chrome Extension for Virtual Try-Ons and a live Python MediaPipe AR server.
 
 [Explore Features](#-core-features) • [System Architecture](#-architecture) • [Getting Started](#-getting-started) • [Security](#-security-implementation)
 
 </div>
 
 ---
 
 ## ✨ Core Features
 
 ### 🎨 The "Premium Light" Experience
 Engineered for aesthetic dominance. The platform features strict use of **Glassmorphism**, fluid motion dynamics, micro-interactions, custom interactive cursors, and a sophisticated light-themed color tokenization (`--brown-sienna`, `--ink`, `--cream`) heavily influenced by cutting-edge spatial design.
 
 ### 👗 FitAI — Virtual Try-On Extension
 The ecosystem includes a securely compiled **Google Gemini 2.0 Flash** Chrome Extension.
 - **Distributable Asset:** Authenticated users can auto-download the `.zip` directly from the navigation bar.
 - **Generative AI Styling:** Replaces, generates, and maps any catalog clothing directly onto the user's uploaded Model Photo via complex prompt conditioning.
 
 ### 🧠 Neural Mirror & AI Stylist
 A dedicated `/ai-mirror` dashboard providing personalized styling advice.
 - **Stylist Confidence Dial:** Visualizes match affinity using a custom circular gauge.
 - **Spectral Matrix:** A 2D color matrix suggesting the elite palette for your specific complexion and biometric build.
 - **Garment Auditor:** Real-time AI analysis of fabric captures to determine stylistic compatibility.
 
 ### 💄 Beauty AR — Lipstick Try-On
 Immersive augmented reality for beauty products.
 - **Live Shade Application:** Real-time lip contour tracking (via MediaPipe) applies selected lipstick shades (Nude, Mauve, Ruby, etc.) directly to the user's camera feed.
 - **Fluid Switching:** Seamlessly toggle between apparel, eyewear, and beauty products in the unified **Neural Mirror** AR dashboard.
 
 ---
 
 ## 🏗️ Architecture
 
 AR-Y-Try operates in a highly modular decoupled architecture.
 
 ```text
 ar-ecommerce/
 ├── 📁 client/                # React (Vite), Redux. Core frontend interface.
 ├── 📁 server/                # Node.js, Express, MongoDB. Primary API Engine.
 ├── 📁 ar_tryon/              # Python (Flask), MediaPipe. Live AR Stream Server.
 └── 📁 tryon-extension/       # Chrome Browser Extension Source Code
 ```
 
 ---
 
 ## 🚀 Getting Started (Run Locally)
 
 ### Prerequisites
 - [Node.js](https://nodejs.org/en/) v18+
 - [Python](https://www.python.org/) 3.10+
 - [MongoDB](https://www.mongodb.com/) (Local or Atlas)
 - [Google Gemini API Key](https://aistudio.google.com/)
 
 ### 1. Backend Server
 ```bash
 cd server
 npm install
 # Create .env (Required keys: MONGO_URI, JWT_SECRET, GEMINI_API_KEY)
 npm run dev
 ```
 
 ### 2. Frontend Application
 ```bash
 cd client
 npm install
 npm run dev
 ```
 
 ### 3. AR Stream Server (Required for Try-On)
 ```bash
 cd ar_tryon
 pip install opencv-python flask mediapipe numpy flask-cors
 python tryon_server.py
 ```
 
 ---
 
 <div align="center">
   <p>Built with precision and spatial awareness.</p>
 </div>
=======
# AR-Y-Try
>>>>>>> b366a8e00de92405ce4f043c064eb25ee39bb1ca
