# Inc_car_dealershipInvetory
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
4. **Branding Execution:** Seamlessly integrated the "AutoStock Pro" branding, including custom SVG favicons, typography adjustments (Inter SemiBold), and exact hex color matching across all components.

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
- **pass:** `Admin@123!
- **User**`First register your self and after login via home page

  ## 🧪 Testing

This project follows the **Test-Driven Development (TDD)** methodology using **pytest**.

### Testing Frameworks

- **pytest** – Unit and integration testing
- **pytest-cov** – Test coverage reports
- **FastAPI TestClient** – API endpoint testing
- **SQLite Test Database** – Isolated testing environment

---

## Test Categories

### Authentication Tests
- ✅ User registration
- ✅ Duplicate email validation
- ✅ User login
- ✅ Invalid credentials
- ✅ JWT token generation
- ✅ JWT authentication
- ✅ Unauthorized access

### Role-Based Access Control (RBAC)
- ✅ Admin authorization
- ✅ User authorization
- ✅ Protected route testing
- ✅ Invalid token handling

### Vehicle Management Tests
- ✅ Add vehicle
- ✅ Get all vehicles
- ✅ Update vehicle
- ✅ Delete vehicle
- ✅ Validation errors

### Search Tests
- ✅ Search by make
- ✅ Search by model
- ✅ Search by category
- ✅ Search by price range
- ✅ Empty search results

### Inventory Tests
- ✅ Purchase vehicle
- ✅ Restock vehicle
- ✅ Stock validation
- ✅ Out-of-stock handling
- ✅ Database transaction rollback

### Integration Tests
- ✅ Register → Login → Add Vehicle
- ✅ Search → Purchase Vehicle
- ✅ Admin Inventory Management
- ✅ End-to-end API workflow

---

## Running Tests

Run all tests

```bash
pytest

# TDD Progress Log
## Phase 1: User Registration (RED Phase)
The following test cases were written and **FAILED** initially (as expected) due to missing endpoints/logic:
- ❌ Register new user (`404 Not Found`)
- ❌ Duplicate email (`404 Not Found`)
- ❌ Invalid email (`404 Not Found`)
- ❌ Password too short (`404 Not Found`)
- ❌ Missing fields (`404 Not Found`)
## Phase 2: User Registration (GREEN Phase)
The following test cases **PASSED** after implementing the User Model, User Schema, Password Hashing, User Repository, User Service, and Auth API:
- ✅ Register new user
- ✅ Duplicate email
- ✅ Invalid email
- ✅ Password too short
- ✅ Missing fields
All 5 tests are now successfully passing (`100%`).

## Phase 3: User Login (RED Phase)
The following test cases were written and **FAILED** initially due to missing login endpoints/logic:
- ❌ Successful Login (`404 Not Found`)
- ❌ Wrong Password (`404 Not Found`)
- ❌ User Does Not Exist (`404 Not Found`)
- ❌ Invalid Email (`404 Not Found`)
- ❌ Empty Password (`404 Not Found`)
- ❌ JWT Token Returned (`404 Not Found`)

## Phase 4: User Login (GREEN Phase)
The following test cases **PASSED** after implementing JWT utilities, LoginRequest schema, AuthService login logic, and the POST /login API route:
- ✅ Successful Login
- ✅ Wrong Password
- ✅ User Does Not Exist
- ✅ Invalid Email
- ✅ Empty Password
- ✅ JWT Token Returned
All 6 tests are now successfully passing (`100%`).

## Phase 5: JWT Authentication (RED Phase)
The following test cases were written and **FAILED** initially because the protected routes lacked authentication logic:
- ❌ Access Protected Route Without Token (`404 Not Found`)
- ❌ Access Protected Route With Invalid Token (`404 Not Found`)
- ❌ Access Protected Route With Valid Token (`404 Not Found`)
- ❌ Expired Token (`404 Not Found`)
- ❌ Wrong Authentication Scheme (`404 Not Found`)
- ❌ Missing Bearer Prefix (`404 Not Found`)
- ❌ Token Belongs to Deleted User (`404 Not Found`)

## Phase 6: JWT Authentication (GREEN Phase)
The following test cases **PASSED** after implementing the `get_current_user` dependency, strict JWT validation in `core/jwt.py`, and querying `UserRepository`:
- ✅ Access Protected Route Without Token
- ✅ Access Protected Route With Invalid Token
- ✅ Access Protected Route With Valid Token
- ✅ Expired Token
- ✅ Wrong Authentication Scheme
- ✅ Missing Bearer Prefix
- ✅ Token Belongs to Deleted User
All 7 tests are now successfully passing (`100%`).

## Phase 7: Vehicle CRUD API (RED Phase)
The following test cases were written and **FAILED** initially because the vehicle routes and models did not exist:
- ❌ Add Vehicle (`404 Not Found`)
- ❌ Normal User Cannot Add Vehicle (`404 Not Found`)
- ❌ Get All Vehicles (`404 Not Found`)
- ❌ Get Vehicle By ID (`404 Not Found`)
- ❌ Vehicle Not Found (`404 Not Found`)
- ❌ Update Vehicle (`404 Not Found`)
- ❌ User Cannot Update (`404 Not Found`)
- ❌ Delete Vehicle (`404 Not Found`)
- ❌ User Cannot Delete (`404 Not Found`)
- ❌ Validation Price (`404 Not Found`)
- ❌ Validation Quantity (`404 Not Found`)
- ❌ Duplicate Vehicle (`404 Not Found`)

## Phase 8: Vehicle CRUD API (GREEN Phase)
The following test cases **PASSED** after implementing the `Vehicle` model, `VehicleSchema`, `VehicleRepository`, `VehicleService`, and the API routes:
- ✅ Add Vehicle (Admin Only)
- ✅ Normal User Cannot Add Vehicle
- ✅ Get All Vehicles
- ✅ Get Vehicle By ID
- ✅ Vehicle Not Found (Returns 404)
- ✅ Update Vehicle (Admin Only)
- ✅ User Cannot Update
- ✅ Delete Vehicle (Admin Only)
- ✅ User Cannot Delete
- ✅ Validation Price (Must be > 0)
- ✅ Validation Quantity (Must be >= 0)
- ✅ Duplicate Vehicle (Returns 400)
All 12 tests are now successfully passing (`100%`).

## Phase 9: Vehicle Search API (RED Phase)
The following test cases were written and **FAILED** initially because the `/api/vehicles/search` endpoint and query parameters did not exist:
- ❌ Search by Make
- ❌ Search by Model
- ❌ Search by Category
- ❌ Minimum Price
- ❌ Maximum Price
- ❌ Price Range
- ❌ Available Vehicles (in stock)
- ❌ Combined Filters
- ❌ No Result
- ❌ Invalid Price

## Phase 10: Vehicle Search API (GREEN Phase)
The following test cases **PASSED** after implementing dynamic SQL query filtering in `VehicleRepository`, robust validation using FastAPI's `Query` parameters, and the new `/search` API route:
- ✅ Search by Make
- ✅ Search by Model
- ✅ Search by Category
- ✅ Minimum Price
- ✅ Maximum Price
- ✅ Price Range
- ✅ Available Vehicles (in stock)
- ✅ Combined Filters
- ✅ No Result
- ✅ Invalid Price (Returns 422 Unprocessable Entity / 400 Bad Request)
All 10 tests are now successfully passing (`100%`).


## Phase 11: Purchase Vehicle API (RED Phase)
The following test cases were written and **FAILED** initially because the /api/vehicles/{id}/purchase endpoint and logic did not exist:
- ❌ Purchase Vehicle Successfully
- ❌ Vehicle Not Found
- ❌ Out Of Stock
- ❌ Purchase More Than Stock
- ❌ Purchase Quantity Zero (Validation)
- ❌ Purchase Negative Quantity (Validation)
- ❌ Unauthorized User
- ❌ Invalid JWT
- ❌ Purchase History Created
- ❌ Remaining Quantity Updated
- ❌ Transaction Rollback
- ❌ Total Price Calculation

## Phase 12: Purchase Vehicle API (GREEN Phase)
The following test cases **PASSED** after implementing the PurchaseHistory model, PurchaseService, PurchaseRepository, Row-level database locking (with_for_update()), and the new API route:
- ✅ Purchase Vehicle Successfully
- ✅ Vehicle Not Found (Returns 404)
- ✅ Out Of Stock (Returns 400)
- ✅ Purchase More Than Stock (Returns 400)
- ✅ Purchase Quantity Zero (Returns 422)
- ✅ Purchase Negative Quantity (Returns 422)
- ✅ Unauthorized User (Returns 401)
- ✅ Invalid JWT (Returns 401)
- ✅ Purchase History Created (Transaction committed)
- ✅ Remaining Quantity Updated (Stock correctly decreased)
- ✅ Transaction Rollback (Verify stock doesn't change on failure)
- ✅ Total Price Calculation
All 12 tests are now successfully passing (100%).

## Phase 13: Restock Vehicle API (RED Phase)
The following test cases were written and **FAILED** initially because the /api/vehicles/{id}/restock endpoint and logic did not exist:
- ❌ Admin Can Restock Vehicle
- ❌ Normal User Cannot Restock
- ❌ Vehicle Not Found
- ❌ Quantity Must Be Positive
- ❌ Negative Quantity
- ❌ Unauthorized Request
- ❌ Invalid JWT
- ❌ Stock Updated
- ❌ Restock History Created
- ❌ Database Rollback
- ❌ Large Quantity
- ❌ Response Validation

## Phase 14: Restock Vehicle API (GREEN Phase)
The following test cases **PASSED** after implementing the RestockHistory model, RestockService, RestockRepository, and the new API route protected by get_current_admin:
- ✅ Admin Can Restock Vehicle
- ✅ Normal User Cannot Restock (Returns 403 Forbidden)
- ✅ Vehicle Not Found (Returns 404)
- ✅ Quantity Must Be Positive (Returns 422)
- ✅ Negative Quantity (Returns 422)
- ✅ Unauthorized Request (Returns 401)
- ✅ Invalid JWT (Returns 401)
- ✅ Stock Updated
- ✅ Restock History Created (Transaction committed)
- ✅ Database Rollback (Verify stock doesn't increase on failure)
- ✅ Large Quantity
- ✅ Response Validation
All 12 tests are now successfully passing (100%).

## Phase 15: Role-Based Authorization (RBAC) (RED Phase)
The following test cases were written and **FAILED** initially because the authorization checks relied on a hardcoded email rather than JWT role checking:
- ❌ User Can View Vehicles
- ❌ Admin Can View Vehicles
- ❌ User Cannot Add Vehicle
- ❌ Admin Can Add Vehicle
- ❌ User Cannot Update Vehicle
- ❌ Admin Can Update Vehicle
- ❌ User Cannot Delete Vehicle
- ❌ Admin Can Delete Vehicle
- ❌ User Cannot Restock
- ❌ Admin Can Restock
- ❌ Invalid Role
- ❌ JWT Missing Role
- ❌ Expired Admin Token
- ❌ Deleted Admin

## Phase 16: Role-Based Authorization (RBAC) (GREEN & REFACTOR Phase)
The following test cases **PASSED** after baking the 
ole into the User model and AuthService token generation, and refactoring get_current_admin to use a generic RoleChecker dependency class:
- ✅ User Can View Vehicles
- ✅ Admin Can View Vehicles
- ✅ User Cannot Add Vehicle (Returns 403 Forbidden)
- ✅ Admin Can Add Vehicle
- ✅ User Cannot Update Vehicle (Returns 403 Forbidden)
- ✅ Admin Can Update Vehicle
- ✅ User Cannot Delete Vehicle (Returns 403 Forbidden)
- ✅ Admin Can Delete Vehicle
- ✅ User Cannot Restock (Returns 403 Forbidden)
- ✅ Admin Can Restock
- ✅ Invalid Role (MANAGER Returns 403)
- ✅ JWT Missing Role (Returns 401 Unauthorized)
- ✅ Expired Admin Token (Returns 401 Unauthorized)
- ✅ Deleted Admin (Returns 401 Unauthorized)
All 14 tests are now successfully passing (100%).


## Phase 17: Backend Testing, Coverage & Quality (TDD Finalization)
The backend test suite is completely GREEN, achieving 97.5% coverage. CI workflow is set up and all code quality checks (flake8, mypy, black, isort) are passing. ✅

### Test Coverage Report
```text
Name                                      Stmts   Miss  Cover
-------------------------------------------------------------
app\__init__.py                               0      0   100%
app\api\__init__.py                           0      0   100%
app\api\auth.py                              23      0   100%
app\api\purchase.py                          15      0   100%
app\api\restock.py                           15      0   100%
app\api\vehicles.py                          40      6    85%
app\core\config.py                           17      0   100%
app\core\dependencies.py                     47      0   100%
app\core\exceptions.py                       17      0   100%
app\core\jwt.py                              14      0   100%
app\core\roles.py                             5      0   100%
app\core\security.py                          6      0   100%
app\database\base.py                          2      0   100%
app\database\database.py                     10      4    60%
app\main.py                                  10      1    90%
app\models\purchase.py                       14      0   100%
app\models\restock.py                        13      0   100%
app\models\user.py                           10      0   100%
app\models\vehicle.py                        15      0   100%
app\repositories\__init__.py                  0      0   100%
app\repositories\purchase_repository.py      22      1    95%
app\repositories\restock_repository.py       20      0   100%
app\repositories\user_repository.py          18      0   100%
app\repositories\vehicle_repository.py       44      0   100%
app\schemas\auth_schema.py                    4      0   100%
app\schemas\purchase_schema.py                7      0   100%
app\schemas\restock_schema.py                 8      0   100%
app\schemas\user.py                           9      0   100%
app\schemas\vehicle_schema.py                26      0   100%
app\services\__init__.py                      0      0   100%
app\services\auth_service.py                 18      0   100%
app\services\purchase_service.py             36      4    89%
app\services\restock_service.py              35      8    77%
app\services\user_service.py                 14      0   100%
app\services\vehicle_service.py              41      2    95%
app\tests\__init__.py                         0      0   100%
app\tests\conftest.py                        23      0   100%
app\tests\test_integration.py                40      0   100%
app\tests\test_jwt_auth.py                   34      0   100%
app\tests\test_login.py                      30      0   100%
app\tests\test_purchase.py                   83      0   100%
app\tests\test_rbac.py                       74      0   100%
app\tests\test_register.py                   21      0   100%
app\tests\test_restock.py                    88      2    98%
app\tests\test_vehicle.py                    81      0   100%
app\tests\test_vehicle_search.py             81      0   100%
-------------------------------------------------------------
TOTAL                                      1130     28    98%
`

## Phase 12.1: Login Page Frontend (RED Phase)
The following test cases were written and **FAILED** initially because the Login component and its logic did not exist:
- ❌ renders login form correctly
- ❌ validates email input
- ❌ validates password input
- ❌ calls API on successful form submission
- ❌ redirects on success
- ❌ displays error message on failed login

## Phase 12.1: Login Page Frontend (GREEN & REFACTOR Phase)
The following test cases **PASSED** after implementing the Login component using `react-hook-form`, `react-router-dom`, `useAuth` hook, and updating the UI with rich aesthetics:
- ✅ renders login form correctly
- ✅ validates email input
- ✅ validates password input
- ✅ calls API on successful form submission
- ✅ redirects on success
- ✅ displays error message on failed login
All 6 tests are now successfully passing (`100%`).

## Phase 12.2: Register Page Frontend (RED Phase)
The following test cases were written and **FAILED** initially because the Register component and its logic did not exist:
- ❌ renders register form correctly
- ❌ validates required inputs
- ❌ calls API and redirects on successful registration
- ❌ displays error message on duplicate email

## Phase 12.2: Register Page Frontend (GREEN & REFACTOR Phase)
The following test cases **PASSED** after implementing the Register component with 
eact-hook-form, 
eact-router-dom, comprehensive validation, toast notifications, loading spinners, and updating the UI with rich aesthetics matching the Login page:
- ✅ renders register form correctly
- ✅ validates required inputs
- ✅ calls API and redirects on successful registration
- ✅ displays error message on duplicate email
All 4 tests are now successfully passing (100%).

## Phase 12.3: Navbar Frontend (RED Phase)
The following test cases were written and **FAILED** initially because the Navbar component did not exist:
- ❌ renders logo, search, and login/register links when not logged in
- ❌ renders dashboard and logout buttons when logged in as normal user
- ❌ renders admin menu when logged in as ADMIN
- ❌ calls logout function when logout button is clicked

## Phase 12.3: Navbar Frontend (GREEN & REFACTOR Phase)
The following test cases **PASSED** after implementing the Navbar component with dynamic role-based link visibility, a sticky glassmorphism design, and an integrated search UI:
- ✅ renders logo, search, and login/register links when not logged in
- ✅ renders dashboard and logout buttons when logged in as normal user
- ✅ renders admin menu when logged in as ADMIN
- ✅ calls logout function when logout button is clicked
All 4 tests are now successfully passing (100%).

## Phase 12.9: Protected Routes (RED & GREEN Phase)
The following test cases for ProtectedRoute and AdminRoute were written and **PASSED** after implementation:
- ✅ redirects to /login if user is not authenticated
- ✅ renders children if user is authenticated
- ✅ AdminRoute redirects to /login if user is not authenticated
- ✅ AdminRoute redirects to /dashboard if user is authenticated but not ADMIN
- ✅ AdminRoute renders children if user is authenticated and is ADMIN

## Phase 12.5: Vehicle Card Frontend (RED & GREEN Phase)
The following test cases for VehicleCard **PASSED**:
- ✅ renders vehicle details correctly
- ✅ purchase button is enabled when quantity > 0
- ✅ purchase button is disabled and shows Out of Stock when quantity is 0
- ✅ renders a placeholder image when image_url is missing

## Phase 12.6: Search Filter Frontend (RED & GREEN Phase)
The following test cases for SearchFilter **PASSED**:
- ✅ renders all filter inputs
- ✅ calls onSearch with applied filters
- ✅ calls onReset and clears inputs when reset button is clicked

## Phase 12.4: Dashboard Frontend (RED & GREEN Phase)
The following test cases for Dashboard **PASSED**:
- ✅ renders loading spinner initially
- ✅ renders vehicle list on API success
- ✅ renders error state on API failure
- ✅ renders empty state when no vehicles are found
- ✅ calls API with search params when filter is applied

## Phase 12.7: Purchase Flow Frontend (RED & GREEN Phase)
The following test cases for PurchaseModal **PASSED**:
- ✅ renders correctly with vehicle details
- ✅ validates quantity limits
- ✅ calls API and onSuccess callback on successful purchase
- ✅ displays error toast on API failure

## Phase 12.8: Admin Dashboard Frontend (RED & GREEN Phase)
The following test cases for AdminDashboard and AdminVehicleForm **PASSED**:
- ✅ renders inventory table
- ✅ opens add vehicle modal when Add Vehicle is clicked
- ✅ calls API and refreshes table on successful add
- ✅ calls API on delete

All requested UI pages and features (Home, Login, Register, User Dashboard, Search, Purchase Flow, Admin Dashboard, CRUD Operations) have been implemented, fully tested, and are responsive! ✅

## UI Redesign & Dashboard Enhancement (Completed)
- Integrated 
echarts for rich data visualization on the Admin Dashboard.
- Implemented global Sidebar navigation, replacing the legacy Navbar.
- Added **Purchase History** view for Users.
- Enhanced Dashboard layout with left-aligned filters and dynamic hero sections.
- Verified Unsplash real-world car images by re-seeding the database.
# AutoStock Pro - AI Chat History & Prompts 🤖💬

This file documents the key prompts and chat history used to design, build, test, and debug the frontend application for **AutoStock Pro** in collaboration with the AI Assistant.

---

## 🎨 Phase 1: Core Theme & Premium UI Setup

### **Developer Prompt:**
> "Initialize the frontend styling. We need a premium, modern design for our Car Dealership system, 'AutoStock Pro'.
> - Use a custom, high-end color palette: vibrant Orange (`#F97316`) for primary actions/accents, and a sophisticated Dark Gray/Slate (`#111827` / `#1f2937`) for background containers and dark mode elements.
> - Avoid default Tailwind/HTML colors (no generic red, blue, green). Set up a cohesive styling sheet (`index.css`) with CSS variables.
> - Import and use the Google Font 'Inter' for modern typography.
> - Create a responsive `TopNavbar` layout displaying the brand name 'AutoStock Pro' with a minimal orange car icon, links to 'Home' and 'Inventory', and a dynamic User section (showing Login/Register or a profile dropdown depending on auth state)."

### **AI Output & Actions:**
- Configured custom utility styling in `index.css`.
- Built `TopNavbar.jsx` with responsive drawer/dropdown layouts.
- Styled components using Framer Motion for smooth micro-animations during transitions.

---

## 🔐 Phase 2: Authentication, Profile Context & Protected Routes

### **Developer Prompt:**
> "Set up the authentication flow for the frontend application. 
> - Integrate with our backend's JWT token auth system.
> - Implement a React `AuthContext` to store user authentication state globally.
> - When a user logs in, decode the JWT token (extract user ID and role) using `jwt-decode`.
> - Create a `ProtectedRoute` component to prevent unauthenticated users from visiting `/dashboard` and `/history`.
> - Create a strict `AdminRoute` component to ensure only users with the `'admin'` role can access routes starting with `/admin`."

### **AI Output & Actions:**
- Designed and implemented `AuthContext.jsx` for global state persistence.
- Built helper route wrappers: `ProtectedRoute.jsx` and `AdminRoute.jsx` leveraging react-router-dom.
- Configured Axios interceptors to automatically append JWT bearer tokens to requests.

---

## 📊 Phase 3: Premium Admin & User Dashboards

### **Developer Prompt:**
> "I need to design two distinct dashboard dashboards:
> 1. **User Dashboard:** A personal space showing their purchase history, total spending metrics, active orders, and recent transactions, complete with aesthetic fallback car images from Unsplash.
> 2. **Admin Dashboard:** A dark-themed premium dashboard. Include:
>    - KPI cards: Total Vehicles in Inventory, Total Users, Total Revenue, and Low Stock Alerts.
>    - Interactive forms to add new vehicles, edit pricing/quantity, and restock existing models.
>    - Ensure lists have full CRUD functionality (Edit, Delete, Restock) and load dynamically from the backend APIs."

### **AI Output & Actions:**
- Developed page components: `Dashboard.jsx`, `PurchaseHistory.jsx`, and `AdminDashboard.jsx`.
- Placed cards, dynamic tables, and custom alerts.
- Handled stock deductions dynamically upon successful purchases.

---

## 🛠️ Phase 4: Bug Fixing & UX Refinements

### **Developer Prompt:**
> "We have a few critical issues on our frontend that need fixing:
> 1. Clicking 'Buy Now' on public vehicle cards redirects to `/login` even if logged in. Update it to navigate to the detailed vehicle page instead.
> 2. When the Admin logs in, they are redirected to `/dashboard` (the user dashboard) and have to manually find the Admin panel. Change it to automatically read the decoded JWT role and redirect Admins straight to `/admin` upon login.
> 3. Add 'Quick Login' buttons for User and Admin to the login form to speed up testing. Clicking these should auto-fill the forms.
> 4. Ensure the 'Admin Dashboard' button is completely hidden from the public/user navbar to avoid confusion.
> 5. The browser tab still shows the default Vite lightning bolt logo and the title 'Car Dealership Inventory'. Replace it with a custom orange car silhouette favicon and update the title to 'AutoStock Pro'."

### **AI Output & Actions:**
- Reprogrammed redirect rules in `Login.jsx` using `jwtDecode` logic.
- Cleared reference errors by importing missing Lucide-React icons (`User`, `Settings`).
- Cleaned up the public navbar in `TopNavbar.jsx`.
- Wrote a custom SVG car favicon directly to the Vite assets folder (`public/favicon.svg`) and linked it in `index.html`.
