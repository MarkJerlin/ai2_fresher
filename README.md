# AI Freshers Connect Portal
> **"Everything a Fresher Needs — One Smart Portal."**

This is a complete, production-ready, full-stack college companion application built for the **Google Developer Groups (GDG) On Campus / Google Ambassador Hackathon**.

The portal features a React.js frontend powered by **Bootstrap 5**, **Framer Motion**, and **React Icons**, backed by a **Node.js Express** server communicating with a **MySQL** database, and integrated with the **Google Gemini API** for smart AI campus advisory services.

---

## 🚀 Key Features

1. **AI Assistant (Google Gemini)**
   - Smart chatbot answering queries on college rules, departments, hostels, transport, and event registrations.
   - Session-based conversation memory.
   - Text-to-speech output and web speech voice recognition.
2. **Interactive Campus Navigation**
   - Clickable campus layout highlighting academic blocks (Turing, Babbage, Tesla) and auditorium locations.
   - Live notice updates and weather widget.
3. **Freshers Welcome Party Portal**
   - Detailed event scheduler, dress codes, and ticket guidelines.
   - Dynamic dinner pref and souvenir T-shirt size registrations.
   - Encrypted entry passes carrying unique student QR codes.
4. **Interactive Swag Spinner**
   - "Spin & Win" luck game granting rewards like stickers, bags, and VIP fiesta passes.
5. **Freshman Digital ID Card**
   - Student avatar, roll numbers, and quick verification QR codes.
6. **Admin Command Panel**
   - CRUD controllers for events and faculty list.
   - Management spreadsheets for RSVPs and feedback reviews.
   - Instant academic announcements broadcaster.

---

## 📁 Project Structure

```
ai-freshers-portal/
├── database/
│   └── schema.sql             # Database schema & Seed mock data
├── backend/
│   ├── uploads/               # Multer file upload caches
│   ├── src/
│   │   ├── controllers/       # Route handling controllers
│   │   ├── middleware/        # JWT & Admin verifiers
│   │   ├── routes/            # Express REST endpoint maps
│   │   ├── db.js              # MySQL connection pool
│   │   └── app.js             # Core Express setup
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    │   └── freshers_fiesta_2026.png  # Generated event poster
    ├── src/
    │   ├── assets/
    │   ├── components/        # Reusable navbar, footer, chatbots, spin-wheels
    │   ├── context/           # AuthContext managing tokens
    │   ├── hooks/
    │   ├── pages/             # Page components
    │   ├── services/          # Axios API communication clients
    │   ├── App.jsx            # Routing shell
    │   ├── index.css          # Design system CSS styles
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## 🛠️ Local Installation & Setup

### Prerequisites
- Install **Node.js** (v18 or higher)
- Install **MySQL Server**

### Step 1: Database Setup
1. Open your MySQL client and create a database:
   ```sql
   CREATE DATABASE ai_freshers_portal;
   ```
2. Import the database schema and mock seed data:
   ```bash
   mysql -u root -p ai_freshers_portal < database/schema.sql
   ```

### Step 2: Backend Configuration & Start
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your MySQL credentials and Google Gemini API Key:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ai_freshers_portal
   JWT_SECRET=your_jwt_secret_token
   GEMINI_API_KEY=your_google_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Install dependencies and start in development mode:
   ```bash
   npm install
   npm run dev
   ```

### Step 3: Frontend Configuration & Start
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```
4. Open your browser and navigate to: `http://localhost:5173`

---

## 🌐 Production Deployments

### Backend (Render / Heroku)
1. Push the code repository to GitHub.
2. Select **Create Web Service** on Render.
3. Hook your repository and select `Node` environment.
4. Set **Build Command**: `npm install` and **Start Command**: `npm start` in the `backend/` root.
5. Setup env keys in Render Settings.
6. Connect a cloud-managed MySQL instance (e.g., Aiven, PlanetScale, or Render PostgreSQL as migration).

### Frontend (Vercel)
1. Connect your repository to Vercel.
2. Choose **Vite** framework preset.
3. Set root directory pointing to `frontend/`.
4. Configure **VITE_API_BASE_URL** in environment options pointing to your Render backend API URL.
5. Deploy.
