# 💰 SpendWise

SpendWise is a barebones **budget tracking web app** built with a modern full-stack setup:

- **Frontend:** React + Vite + Tailwind  
- **Backend:** Spring Boot (Java)  
- **Database:** PostgreSQL  
- **Infra:** Docker & Docker Compose  
- **Optional cloud integration:** AWS S3 for receipt uploads (later)

The goal of this MVP is simple: **users can create budgets, add expenses, and view their spending**. More advanced features (auth, charts, AI insights) will come later.

---

## 🚀 Core Features (MVP)

- **Users**
  - Create users (signup form)
  - List, update, delete users (basic CRUD)

- **Budgets**
  - Create budgets with:
    - Name (e.g., *October 2025 – Groceries*)
    - Period (start + end date)
    - Limit amount
  - View budgets for a given user
  - Update and delete budgets
  - Expenses cascade delete when a budget is removed

- **Expenses**
  - Add expenses under a budget
  - Track description, amount, date, category
  - (Optional) link a receipt URL (for S3 upload later)
  - List, update, delete expenses for each budget

- **Summary**
  - Each budget shows:
    - Limit
    - Total spent
    - Remaining

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS  
- **Backend:** Spring Boot 3, Spring Data JPA, Validation  
- **Database:** PostgreSQL 16 (via Docker)  
- **Build & Runtime:** Java 17, Maven  
- **Containers:** Docker & Docker Compose  

---

## 📂 Project Structure

```bash
spendwise/
├── frontend/           # React + Vite app (UI)
├── backend/            # Spring Boot app (API)
│   ├── model/          # Entities (User, Budget, Expense)
│   ├── repo/           # JPA repositories
│   ├── web/            # Controllers (CRUD endpoints)
│   └── SpendWiseApplication.java
├── docker-compose.yml  # API + DB containers
└── README.md
⚡ Getting Started (Local Dev)
Clone the repo

bash
Copy code
git clone https://github.com/AyanAmjad20/spend-wise.git
cd spend-wise
Start backend & database

bash
Copy code
cd backend
docker compose up --build
Backend runs on http://localhost:8080.

Start frontend

bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs on http://localhost:5173.

🔑 API Overview
Users

GET /api/users

POST /api/users

GET /api/users/{id}

PUT /api/users/{id}

DELETE /api/users/{id}

Budgets

GET /api/budgets?userId={id}

POST /api/budgets

GET /api/budgets/{id}

PUT /api/budgets/{id}

DELETE /api/budgets/{id}

Expenses

GET /api/expenses?userId={id}&budgetId={id}

POST /api/expenses

GET /api/expenses/{id}

PUT /api/expenses/{id}

DELETE /api/expenses/{id}

🧭 Roadmap / Coming Soon
 🔐 Authentication & JWT (login, signup, sessions)

 📊 Dashboard with charts & insights

 ☁️ AWS S3 receipt upload & image preview

 📅 Advanced filtering (date ranges, categories)

 📈 Budget rollover & recurring budgets

 👤 Profile settings (password reset, preferences)

 ✅ Full test coverage (unit + integration)

 🚀 Deploy frontend (Vercel) & backend (Render/AWS ECS)

🤝 Contributing
This is a learning project for full-stack development.
Feel free to fork, open issues, or submit PRs with improvements!
