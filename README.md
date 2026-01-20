# TalentScout - Enterprise Recruitment Platform

TalentScout is a modern, enterprise-grade job board and recruitment platform inspired by industry leaders like Indeed. It connects candidates with recruiters through a seamless, intuitive, and secure interface.

![Job Search Support](https://img.shields.io/badge/Job%20Search-Advanced-blue)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-blue)
![Laravel](https://img.shields.io/badge/Backend-Laravel-red)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### for Candidates
*   **Advanced Job Search**: Filter by keywords, location, job type, experience level, and date posted.
*   **Apply Flow**: Easy application process with cover letter support.
*   **Dashboard**: Manage profile and view application status.
*   **Real-time Filters**: Instant search results without page reloads.

### for Recruiters
*   **Post Jobs**: Create detailed job listings with requirements and salary ranges.
*   **Manage Applications**: Review applicants and download resumes.
*   **Company Profile**: Showcase company details and branding.

### Platform Highlights
*   **Responsive Design**: Fully optimized for mobile and desktop.
*   **Security**: Role-based access control (RBAC).
*   **Performance**: Optimized API responses and database indexing.

## 🛠️ Tech Stack

**Frontend:**
*   React.js (Vite)
*   Tailwind CSS (Styling)
*   Headless UI & Heroicons (Components)
*   Axios (API Integration)

**Backend:**
*   Laravel 10+ (API)
*   MySQL (Database)
*   Laravel Sanctum (Authentication)

## 📦 Installation & Setup

### Prerequisites
*   Node.js & npm
*   PHP & Composer
*   MySQL (XAMPP/Laragon recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/Nasir0347/telentscout.git
cd talentscout
```

### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
# Configure your database in .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env 
# Ensure VITE_API_URL=http://localhost:8000/api
npm run dev
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
