# GymFlow – Fitness Member Centre

* **Member Management:** Full CRUD (Create, Read, Update, Delete) functionality.
* **Dynamic Dashboard:** Real-time overview of member statistics.
* **Modern UI/UX:** Built with React, Tailwind CSS, and Lucide-React icons.
* **Secure Authentication:** Token-based authentication with custom logout confirmation flows.

## Tech Stack

**Frontend:**
* React.js
* Tailwind CSS (Styling)
* Lucide React (Icons)
* React Router (Navigation)
* Axios (API Requests)

**Backend:**
* Laravel (RESTful API)
* MySQL (Database)
* Laravel Sanctum (Authentication)

---

## Installation & Setup

### 1. Backend (Laravel)
```bash
# Clone the repository
git clone https://github.com/nuraziilahawg-dev/fitness-centre-dashboard

# Install dependencies
composer install

# Set up environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate
php artisan db:seed
php artisan serve

### 1. Frontend (React)
cd fitness-centre-frontend
npm install
npm run dev

