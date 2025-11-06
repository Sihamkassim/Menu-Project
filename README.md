# 🍽️ Restaurant Ordering Platform

A full-stack restaurant ordering platform with separate customer and admin interfaces. Customers can browse the menu, add items to cart, and place orders. Admins can manage menu items and track all orders in real-time.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![Express](https://img.shields.io/badge/Express-5.1-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19-brightgreen)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

---

## 📋 Features

### 👥 Customer Features (Public Access)
- ✅ Browse menu with category filtering and search
- ✅ View detailed item information (name, price, description, image)
- ✅ Add items to cart with quantity management
- ✅ Place orders without registration
- ✅ Track order status in real-time using order number
- ✅ Responsive design for mobile and desktop

### 🔐 Admin Features (Protected)
- ✅ Secure JWT authentication with HTTP-only cookies
- ✅ Full CRUD operations for menu items
- ✅ View all orders with filtering by status
- ✅ Update order status (Pending → Preparing → Served → Completed)
- ✅ Real-time order statistics dashboard
- ✅ Revenue tracking

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Express.js 5.1
- **Language:** TypeScript 5.9
- **Database:** MongoDB 8.19 + Mongoose
- **Authentication:** JWT + bcryptjs
- **Security:** HTTP-only cookies, CORS
- **Dev Tools:** Nodemon, ts-node

### Frontend
- **Framework:** React 19.1 + Vite 7.1
- **State Management:** Zustand (with persist middleware)
- **Routing:** React Router DOM 7.9
- **Styling:** TailwindCSS 3.4
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Form Handling:** Native React hooks

---

## 📁 Project Structure

```
MenuProject/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── NavBar.jsx
│   │   │   ├── MenuCard.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── OrderStatusBadge.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminMenu.jsx
│   │   │   └── AdminOrders.jsx
│   │   ├── store/             # Zustand state management
│   │   │   ├── authStore.js
│   │   │   └── cartStore.js
│   │   ├── config/
│   │   │   └── api.js         # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
│
├── server/                    # Backend Express application
│   ├── src/
│   │   ├── Model/             # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Menu.ts
│   │   │   └── Order.ts
│   │   ├── Controller/        # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── menuController.ts
│   │   │   └── orderController.ts
│   │   ├── Routes/            # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── menuRoutes.ts
│   │   │   └── orderRoutes.ts
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── config/
│   │   │   └── db.ts          # MongoDB connection
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── API_ROUTES.md              # Complete API documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd MenuProject
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:
```bash
cd client
npm install
```

Create `.env` file in `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📝 API Documentation

See [API_ROUTES.md](./API_ROUTES.md) for complete API documentation.

### Quick API Overview

**Base URL:** `http://localhost:5000/api`

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/auth/register` | POST | Public | Register admin |
| `/auth/login` | POST | Public | Admin login |
| `/auth/logout` | POST | Protected | Logout |
| `/menu` | GET | Public | Get all menu items |
| `/menu` | POST | Admin | Create menu item |
| `/menu/:id` | PUT | Admin | Update menu item |
| `/menu/:id` | DELETE | Admin | Delete menu item |
| `/orders` | POST | Public | Create order |
| `/orders/tracking/:orderNumber` | GET | Public | Track order |
| `/orders` | GET | Admin | Get all orders |
| `/orders/:id/status` | PUT | Admin | Update order status |
| `/orders/stats` | GET | Admin | Get statistics |

---

## 🔐 Authentication Flow

1. **Admin Registration/Login**
   - Admin logs in via `/admin/login`
   - JWT token stored in HTTP-only cookie
   - Token valid for 7 days

2. **Protected Routes**
   - Zustand auth store automatically initializes on app load
   - Protected routes check authentication state
   - Unauthenticated users redirected to login

3. **Customer Flow**
   - No authentication required
   - Cart persisted in localStorage via Zustand
   - Orders placed with customer information

---

## 🎨 UI Routes

### Public Routes
- `/` - Home page with featured menu
- `/menu` - Browse full menu with category filter
- `/cart` - Shopping cart and checkout
- `/order/:orderNumber` - Track order status

### Admin Routes (Protected)
- `/admin/login` - Admin authentication
- `/admin/menu` - Menu management (CRUD)
- `/admin/orders` - Orders dashboard

---

## 🧪 Testing the Application

### 1. Register an Admin

**Method 1: Via API (Postman/Thunder Client)**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

**Method 2: Via MongoDB Shell**
```javascript
use restaurant_db
db.users.insertOne({
  username: "admin",
  email: "admin@restaurant.com",
  password: "$2a$10$hashedPasswordHere",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 2. Login as Admin
1. Go to `http://localhost:5173/admin/login`
2. Enter credentials
3. Access admin dashboard

### 3. Create Menu Items
1. Navigate to Admin → Menu Management
2. Click "Add Item"
3. Fill in details:
   - Name, Category, Description
   - Image URL
   - Price
   - Availability toggle
4. Click "Create"

### 4. Place a Customer Order
1. Browse menu at `/menu`
2. Add items to cart
3. Go to `/cart`
4. Fill in customer details
5. Place order
6. Note the order number for tracking

### 5. Manage Orders (Admin)
1. Go to `/admin/orders`
2. View all orders with status filters
3. Update order status through workflow:
   - Pending → Preparing → Served → Completed

---

## 🎯 Key Features Implementation

### State Management (Zustand)
```javascript
// Auth Store
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => { /* ... */ },
  logout: async () => { /* ... */ }
}));

// Cart Store with Persistence
const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => { /* ... */ },
      clearCart: () => { /* ... */ }
    }),
    { name: 'cart-storage' }
  )
);
```

### Protected Routes
```jsx
<Route
  path="/admin/orders"
  element={
    <ProtectedRoute>
      <AdminOrders />
    </ProtectedRoute>
  }
/>
```

### Axios Interceptors
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
# For local: mongod --dbpath /data/db
# For Atlas: Verify connection string and IP whitelist
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port in .env
PORT=5001
```

### CORS Errors
Ensure backend `.env` has correct CLIENT_URL:
```env
CLIENT_URL=http://localhost:5173
```

### TypeScript Compilation Errors
```bash
cd server
npm run build
```

---

## 📦 Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Build TypeScript: `npm run build`
3. Start: `npm start`

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production API URL
2. Build: `npm run build`
3. Deploy `dist/` folder

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **TailwindCSS** for beautiful styling
- **Lucide React** for amazing icons
- **Zustand** for simple state management
- **MongoDB** for flexible data storage

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check [API_ROUTES.md](./API_ROUTES.md) for API details

---

**Built with ❤️ using React, Express, MongoDB, and TailwindCSS**
"# Menu-Project" 
