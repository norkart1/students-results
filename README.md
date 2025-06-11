# Result Management System

A modern, full-featured academic result management system for schools and institutions. Built with Next.js, TypeScript, MongoDB, and Tailwind CSS, it provides robust tools for managing students, subjects, batches, and examination results, with advanced analytics and reporting.

---

## 🚀 Features

- **Student Management**: Register, update, and manage student records with batch assignments, including profile photo support.
- **Subject Management**: Define subjects (with Arabic names supported), codes, and mark schemes.
- **Batch/Class Management**: Organize students into batches/classes and manage batch-specific exams.
- **Result Processing**: Automated calculation of total marks, percentages, grades, and ranks. Customizable grading scale and rank suffixes (st, nd, rd, th).
- **Result Cards**: Professionally formatted, printable result cards for students, including:
  - Subject-wise marks breakdown (written, CE, total)
  - Subject names in English and Arabic
  - Color-coded performance bars for each subject
  - Student profile photo and details
  - Class rank with ordinal suffix
  - Overall performance bar and grade
  - Principal's signature (SVG image)
  - Performance analysis/remarks auto-generated based on percentage
  - Publication date auto-filled
- **Reports & Analytics**: Visualize performance with charts, grade distributions, subject analytics, and batch comparisons.
- **Admin Panel**: Secure admin dashboard for managing all data, seeding sample data, and system status.
- **Data Export/Backup**: (Coming soon) Export data for backup or migration.
- **Responsive UI**: Mobile-friendly, modern interface with dark mode support.
- **Customizable Branding**: Easily update site name, logo, and principal's signature via static assets and environment variables.
- **API Endpoints**: RESTful API for all core entities (students, subjects, batches, results, reports, seeding, system status).
- **Sample Data Seeding**: Load demo data via admin panel or CLI script.
- **Error Handling & Validation**: Robust validation for forms and API routes.
- **Accessibility**: Uses accessible UI primitives (Radix UI, shadcn/ui).

---

## 🗂️ Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard and management pages
│   ├── api/             # API routes (students, subjects, batches, results, reports, seed, etc.)
│   ├── result/          # Public result card view
│   ├── globals.css      # Main global styles
│   └── ...
├── components/          # Reusable UI and admin components
│   └── ui/              # UI primitives (button, card, table, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries (e.g., MongoDB connection)
├── models/              # Mongoose models (Student, Subject, Batch, Result)
├── public/              # Static assets (images, logos, signature)
├── scripts/             # Data seeding scripts
├── styles/              # Additional global styles
├── tailwind.config.ts   # Tailwind CSS configuration
├── package.json         # Project dependencies and scripts
└── ...
```

---

## ⚙️ Getting Started

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd result-management-system
```

### 2. Install dependencies
```sh
pnpm install
# or
yarn install
# or
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:

```env
# .env.local
MONGODB_URI=mongodb://localhost:27017/result-management-system
NEXT_PUBLIC_SITE_NAME=ASAS MALIKI EXAMINATION
ADMIN_EMAIL=micthrissur@gmail.com
```

### 4. Run the development server
```sh
pnpm dev
# or
yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧪 Sample Data
- Use the **Admin Panel → Settings** to load sample data (students, subjects, batches, results) for demo/testing.
- Or run the seeding script manually:

```sh
pnpm exec tsx scripts/seed-data.js
```

---

## 📊 API Endpoints
- `/api/students` — Manage students
- `/api/subjects` — Manage subjects
- `/api/batches` — Manage batches
- `/api/results` — Manage results
- `/api/reports` — Analytics and reporting
- `/api/seed` — Seed sample data
- `/api/system-status` — System health/status

---

## 📝 Technologies Used
- **Next.js** (App Router, API routes)
- **TypeScript**
- **MongoDB** (with Mongoose)
- **Supabase** ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
- **Tailwind CSS**
- **Radix UI** & **shadcn/ui**
- **Recharts** (analytics)

---

## 🆕 Recent Enhancements

- **Principal's Signature Widget**: SVG signature image is now displayed on result cards for authenticity.
- **Profile Photo Support**: Student avatars/photos shown on result cards and admin panel.
- **Dynamic Performance Analysis**: Auto-generated remarks based on student percentage.
- **Ordinal Rank Suffixes**: Class rank now displays with correct English ordinal (1st, 2nd, 3rd, etc.).
- **Arabic Subject Names**: Full support for Arabic subject names and right-to-left display.
- **Color-coded Performance Bars**: Visual feedback for both subject-wise and overall performance.
- **Auto-filled Result Date**: Result publication date is shown automatically on result cards.
- **Robust Error Handling**: Improved validation and error messages across forms and APIs.
- **Supabase Integration**: Added support for Supabase as a backend service for authentication, storage, or real-time features (if applicable to your project setup).

---

## 📦 Sample `.env.local`
```env
MONGODB_URI=mongodb://localhost:27017/result-management-system
NEXT_PUBLIC_SITE_NAME=ASAS MALIKI EXAMINATION
ADMIN_EMAIL=micthrissur@gmail.com
```

---

## 📚 License
This project is for educational and demonstration purposes. Please contact the author for production/commercial use.

---

## 👤 Author
- Salman MP
- Email: hello@salmanmp.me

---

## 🌟 Acknowledgements
- Inspired by real-world academic result management needs.
- UI powered by [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/).
- Backend and real-time features powered by [Supabase](https://supabase.com/).
