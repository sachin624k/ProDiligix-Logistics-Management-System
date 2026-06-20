# ProDiligix LMS - Logistics Management System

A full-stack Logistics Management System built for managing customers, shipments, tracking, reports, and business insights through a centralized dashboard.

Developed as part of the ProDiligix Technologies Technical Lead assignment.

---

## Features

### Customer Management

- Create, update and manage customers
- Customer details with GST information
- Search customer records

### Shipment Management

- Create and manage shipments
- Auto-generated Shipment ID
- Multiple shipment modes:
  - Air
  - Surface
  - Rail
  - PTL
  - FTL
- Shipment cost and weight management

### Shipment Tracking

- Real-time shipment status updates
- Timeline based tracking

Shipment Status:

- Booked
- Picked Up
- In Transit
- Out For Delivery
- Delivered
- Exception

### Dashboard Analytics

- Total Customers
- Total Shipments
- In Transit Shipments
- Delivered Shipments
- Revenue Summary
- Shipment analytics using charts

### Reports

Generate:

- Daily Reports
- Weekly Reports
- Monthly Reports

Export:

- PDF
- Excel

---

## User Roles

### Admin

- Full system access

### Operations

- Manage customers
- Manage shipments
- Update tracking status

### Management

- View dashboard analytics
- Access reports

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router DOM
- Recharts
- Axios
- React Toastify
- Lucide React Icons

### Backend

- Node.js
- Express.js
- REST API Architecture

### Database

- PostgreSQL

### Authentication & Security

- JWT Authentication
- Bcrypt Password Hashing
- Role Based Access Control (RBAC)
- Protected API Routes

### Tools

- Git & GitHub
- Postman
- VS Code

---

## Project Structure

```bash
ProDiligix-LMS
│
├── frontend/                     # React Client Application
│   │
│   ├── public/
│   │
│   └── src/
│       │
│       ├── api/                  # Axios API configuration
│       │   └── axios.js
│       │
│       ├── assets/               # Images & static assets
│       │
│       ├── components/           # Reusable UI components
│       │   │
│       │   └── dashboard/
│       │       ├── RecentShipments.jsx
│       │       ├── ShipmentModeChart.jsx
│       │       └── ShipmentStatusChart.jsx
│       │
│       ├── layouts/
│       │   └── DashboardLayout.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Customers.jsx
│       │   ├── Shipments.jsx
│       │   ├── Tracking.jsx
│       │   ├── Reports.jsx
│       │   └── Login.jsx
│       │
│       ├── App.jsx
│       └── main.jsx
│
│
├── backend/                      # Node.js Express Server
│   │
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection
│   │
│   ├── controllers/              # Business Logic
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── shipmentController.js
│   │   └── reportController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT & RBAC Middleware
│   │
│   ├── routes/                   # REST API Routes
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── shipmentRoutes.js
│   │   ├── trackingRoutes.js
│   │   └── reportRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
│
├── docs/                         # Project Documentation
│   │
│   ├── Architecture.md
│   ├── ER-Diagram.png
│   └── API-Documentation.md
│
├── README.md
└── .gitignore
```

## Installation & Setup

Follow the steps below to run the project locally.

---

### 1. Clone the Repository

```bash
git clone <repository-url>

cd ProDiligix-LMS
```

---

### 2. Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file inside backend folder:

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm start
```

Backend will run on:

```bash
http://localhost:5000
```

---

### 3. Frontend Setup

Open a new terminal.

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React development server:

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

### 4. Login Credentials

Use the created user account credentials.

Example:

```text
Email: admin@prodiligix.com
Password: ********
Role: ADMIN
```

---

## Application Running

After setup:

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000/api
```

---

## Security Features

- Secure JWT based authentication
- Password hashing using Bcrypt
- Protected backend routes
- Role Based Access Control (RBAC)

Role Permissions:

ADMIN

- Full application control
- Create / Update / Delete access

OPERATIONS

- Customer management
- Shipment operations
- Tracking updates

MANAGEMENT

- Analytics dashboard access
- Report generation access

---

## Additional Features

- Fully responsive UI
- Advanced dashboard charts
- PDF/Excel export
- Clean enterprise design

---

## Developed By

Sachin Kushwaha
