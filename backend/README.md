# 🏥 ScanRx Backend API

AI-Powered Medicine Identification System — Express.js + MongoDB + OpenAI

## ✨ Features

- **📸 Image-Based Medicine Identification** — Upload a medicine photo & get comprehensive AI-powered details
- **🤖 OpenAI GPT-4o Vision** — Identifies medicine names from images
- **💊 Comprehensive Medicine Database** — Stores 25+ fields per medicine (uses, side effects, dosage, interactions, etc.)
- **💾 Smart Caching** — Database cache prevents redundant API calls
- **🔐 JWT Authentication** — Secure registration & login
- **📜 Scan History** — Track all scanned medicines per user
- **⭐ Favorites** — Save frequently referenced medicines
- **🛡️ Rate Limiting** — Protects against abuse
- **📦 Production-Ready** — Error handling, validation, logging

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Express.js | Web framework |
| MongoDB + Mongoose | Database & ODM |
| OpenAI SDK | GPT-4o Vision + Chat |
| Multer | Image upload |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |

## 🚀 Quick Start

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-your-openai-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Start server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login & get token |
| GET | `/api/auth/me` | ✅ | Get current user profile |

### Medicine Identification

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/medicines/identify` | ✅ | Upload image & identify medicine |
| GET | `/api/medicines/search?name=aspirin` | ❌ | Search medicines by name |
| GET | `/api/medicines/:id` | ❌ | Get medicine by ID |

### User Features

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/history` | ✅ | Get scan history (paginated) |
| GET | `/api/user/favorites` | ✅ | Get favorite medicines |
| POST | `/api/medicines/:medicineId/favorite` | ✅ | Toggle favorite |
| DELETE | `/api/user/history/:id` | ✅ | Delete history entry |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API info |
| GET | `/api/health` | Server health |

## 📋 Sample API Calls

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Identify Medicine (upload image)
```bash
curl -X POST http://localhost:5000/api/medicines/identify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@./medicine_photo.jpg"
```

### Search Medicine
```bash
curl http://localhost:5000/api/medicines/search?name=paracetamol
```

### Get History
```bash
curl http://localhost:5000/api/user/history?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Project Structure

```
backend/
├── server.js                    # Entry point
├── config/
│   └── database.js              # MongoDB connection
├── models/
│   ├── User.js                  # User schema
│   ├── Medicine.js              # Medicine schema (25+ fields)
│   └── UserHistory.js           # Scan history schema
├── routes/
│   ├── authRoutes.js            # Auth endpoints
│   ├── medicineRoutes.js        # Medicine endpoints
│   └── userRoutes.js            # User endpoints
├── controllers/
│   ├── authController.js        # Auth logic
│   ├── medicineController.js    # Core identify workflow
│   └── userController.js        # History & favorites
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── upload.js                # Multer config
│   └── errorHandler.js          # Global error handler
├── utils/
│   ├── openaiService.js         # OpenAI Vision + GPT-4
│   └── validators.js            # Input validation rules
├── uploads/                     # Uploaded images
├── .env.example                 # Environment template
└── package.json
```

## 🔒 Security

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT tokens with configurable expiration
- Rate limiting on all endpoints
- Input validation & sanitization
- CORS configured for frontend origin
- File type & size validation for uploads

## 📊 Medicine Data Fields

Each identified medicine includes:
- Basic: name, generic name, brand, manufacturer, category
- Composition: chemical composition, active ingredients
- Usage: uses, dosage, dosage form, strength, frequency
- Safety: side effects, warnings, precautions
- Interactions: drug interactions, food interactions
- Details: storage, administration route, onset, duration
- Special: pregnancy category, lactation, overdosage, price

## License

ISC
