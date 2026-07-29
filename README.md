# AutoStock Pro 🚗

AutoStock Pro is a premium, Full-Stack Car Dealership Inventory Management System. It features a modern, interactive User Interface, complete Role-Based Access Control (Admin vs. User), and a secure FastAPI backend. 

## 🌟 Key Features

### 👤 User Portal
- **Vehicle Inventory:** Browse, search, and filter a vast collection of premium vehicles.
- **Purchase System:** Instantly purchase vehicles ("Buy Now") which dynamically deducts from the live stock.
- **User Dashboard:** Track purchase history, total money spent, and active orders in a personalized dashboard.
- **Authentication:** Secure login and registration using JWT (JSON Web Tokens).

### 🛠️ Admin Portal
- **Admin Dashboard:** Access exclusive KPIs, sales trends, and system-wide analytics.
- **Vehicle Management:** Add new stock, edit vehicle details, and manage the dealership's live inventory.
- **Role-Based Access:** Dedicated routes and layouts protected specifically for Admin accounts, ensuring data security.

### 🎨 UI/UX Excellence
- **Premium Aesthetics:** High-end design utilizing a cohesive Orange (`#F97316`) and Dark Gray (`#111827`) palette.
- **Micro-animations:** Smooth page transitions, hover effects, and interactive elements powered by Framer Motion.
- **Responsive Layout:** fully optimized for mobile, tablet, and desktop environments.

---

## 🏗️ Project Structure

The repository is divided into two primary directories:

```
Inc_car_dealershipInvetory/
│
├── backend/                  # FastAPI Backend Server
│   ├── app/                  # Main application code (API, Models, Schemas, Services, Core)
│   ├── requirements.txt      # Python dependencies
│   ├── seed_50_cars.py       # Database seeding script
│   └── ...                   
│
├── frontend/                 # React Vite Frontend Application
│   ├── src/                  # React source code (Components, Pages, Hooks, Context, Layouts)
│   ├── public/               # Static assets (Favicon, Images)
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── ...
```

---

## 💻 Technology Stack

### **Frontend**
- **Framework:** React 19 powered by Vite
- **Styling:** Tailwind CSS (Vanilla utilities with rich custom color tokens)
- **Routing:** React Router v6
- **State & Data Fetching:** React Query, Axios
- **Form Handling:** React Hook Form
- **Animations:** Framer Motion
- **Icons:** Lucide React

### **Backend**
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Security:** JWT (JSON Web Tokens) Authentication, Password Hashing

---

## 🤖 AI Usage in Frontend Development

A significant portion of the frontend architecture and user interface was built in collaboration with **Antigravity (AI)**. 

### AI Contributions:
1. **Premium Dashboard Design:** The AI generated a modern, high-end dashboard interface, complete with KPI cards, spending trend charts, and responsive data tables, transforming basic wireframes into a production-ready UI.
2. **Routing & Authentication Logic:** Built complex React Router setups, including isolated layouts (`MainLayout` vs `AdminLayout`), secure `ProtectedRoutes`, and precise JWT decoding to prevent users from accessing Admin-only views.
3. **UI/UX Enhancements:** Implemented sophisticated micro-animations (Framer Motion) on buttons, dropdowns, and page transitions to make the application feel "alive."
4. **Bug Fixing & Debugging:** The AI actively traced and resolved critical React runtime errors, routing misdirections, and state-management issues within the `AuthContext` to ensure a flawless login-to-dashboard pipeline.
5. **Branding Execution:** Seamlessly integrated the "AutoStock Pro" branding, including custom SVG favicons, typography adjustments (Inter SemiBold), and exact hex color matching across all components.

---

## 🚀 Getting Started

### 1. Run the Backend
Navigate to the `backend` directory, install dependencies, and start the FastAPI server:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*The API will be available at `http://localhost:8000`*

### 2. Run the Frontend
Navigate to the `frontend` directory, install Node modules, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
*The Web App will be available at `http://localhost:5173`*

### 3. Quick Login Testing
You can test the application using the predefined accounts provided on the `/login` page:
- **Admin:** `admin@dealership.com`
- **User:** `user@dealership.com`
