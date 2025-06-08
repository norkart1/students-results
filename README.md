# Result Management System

A modern, full-featured academic result management system for schools and institutions. Built with Next.js, TypeScript, MongoDB, and Tailwind CSS, it provides robust tools for managing students, subjects, batches, and examination results, with advanced analytics and reporting.

---

## 🚀 Features

- **Student Management**: Register, update, and manage student records with batch assignments.
- **Subject Management**: Define subjects (with Arabic names supported), codes, and mark schemes.
- **Batch/Class Management**: Organize students into batches/classes and manage batch-specific exams.
- **Result Processing**: Automated calculation of total marks, percentages, grades, and ranks.
- **Reports & Analytics**: Visualize performance with charts, grade distributions, subject analytics, and batch comparisons.
- **Admin Panel**: Secure admin dashboard for managing all data, seeding sample data, and system status.
- **Result Cards**: Professionally formatted, printable result cards for students.
- **Data Export/Backup**: (Coming soon) Export data for backup or migration.
- **Responsive UI**: Mobile-friendly, modern interface with dark mode support.

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
├── public/              # Static assets (images, logos)
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
ADMIN_EMAIL=admin@asamaliki.edu
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
- **Tailwind CSS**
- **Radix UI** & **shadcn/ui**
- **Recharts** (analytics)

---

## 📦 Sample `.env.local`
```env
MONGODB_URI=mongodb://localhost:27017/result-management-system
NEXT_PUBLIC_SITE_NAME=ASAS MALIKI EXAMINATION
ADMIN_EMAIL=admin@asamaliki.edu
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
