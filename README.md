# Student Placement Tracking Portal

A Spring Boot + React portal for managing campus placement workflows. It includes admin and student login, company management, job postings, applications, and status tracking from pending to hired.

## Demo Accounts

| Role    | Email              | Password    |
| ------- | ------------------ | ----------- |
| Admin   | admin@portal.com   | admin123    |
| Student | student@portal.com | password123 |

## What the demo shows

1. Admin creates a company.
2. Admin posts a job drive.
3. Student applies.
4. Admin shortlists or hires the student.
5. Student sees the updated status in My Applications.

## Local Run

Use the bundled scripts from the project root:

1. Run [run_db.bat](run_db.bat)
2. Run [run_backend.bat](run_backend.bat)
3. Run [run_frontend.bat](run_frontend.bat)
4. Open http://localhost:5173

If you want the built-in demo data, import [schema.sql](schema.sql) first and then run [demo_seed.sql](demo_seed.sql).

## Deployment Environment Variables

Backend:

- `SPRING_DATASOURCE_URL` - Cloud MySQL URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `APP_CORS_ALLOWED_ORIGINS` - Frontend URL(s), comma-separated
- `PORT` - Backend port if your host provides one

Frontend:

- `VITE_API_BASE_URL` - Backend API URL, for example `https://your-backend.onrender.com/api`

## GitHub Push

1. Create a new GitHub repository named something like `Student-Placement-Tracking-Portal`.
2. From the project root, run:

```bash
git init
git add .
git commit -m "feat: prepare placement portal for github and deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Student-Placement-Tracking-Portal.git
git push -u origin main
```

3. Make sure the root `.gitignore` keeps `node_modules`, `target`, `dist`, and local database data out of Git.

If you need deployment guidance, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).
