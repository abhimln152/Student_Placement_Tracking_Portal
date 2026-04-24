# Deployment Guide

This document provides a step-by-step guide on deploying your full-stack project for free online so it can be demonstrated to your university professors easily.

## Database: MySQL Cloud (Aiven / PlanetScale / AWS RDS)

1. **Choose a Provider**: [Aiven](https://aiven.io/mysql) offers free tier MySQL databases, or use AWS RDS Free Tier.
2. **Create Database**: Follow the provider's UI to spin up a new MySQL instance.
3. **Save Credentials**: You will get a Host URL, Port (usually `3306`), Username, and Password.
4. **Update Backend**: Pass these credentials as environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `APP_CORS_ALLOWED_ORIGINS` should include your frontend URL

## Backend: Render or Railway

Render offers a free tier for web services (ideal for Spring Boot).

1. **Push your code to GitHub**.
2. Go to [Render](https://render.com) and create an account.
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. In the Service Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Docker` or `Java` (Depending on how we containerize. Generally, running via Maven is easiest. Set Build Command: `./mvnw clean package -DskipTests`, Start Command: `java -jar target/placement-portal-0.0.1-SNAPSHOT.jar`).
6. **Environment Variables**: Add your Database credentials:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://YOUR_CLOUD_DB_HOST:3306/YOUR_DB_NAME`
   - `SPRING_DATASOURCE_USERNAME`: `YOUR_DB_USER`
   - `SPRING_DATASOURCE_PASSWORD`: `YOUR_DB_PASSWORD`
   - `APP_CORS_ALLOWED_ORIGINS`: `https://YOUR_FRONTEND_DOMAIN`
   - `PORT`: leave default if your host sets it automatically
7. Click **Deploy**. Note the URL (e.g., `https://placement-backend.onrender.com`).

## Frontend: Vercel or Netlify

Vercel is highly recommended for React + Vite apps.

1. Go to [Vercel](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** and import your repository.
3. In the Configuration:
   - **Root Directory**: Select `/frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://placement-backend.onrender.com/api`)
5. Click **Deploy**.

## Demo Data

For a college presentation, import `schema.sql` and then `demo_seed.sql` so the app opens with:

- Admin login ready
- Student login ready
- One company
- One open job drive
- One pending application that can be shortlisted/hired live

## Final Tests

Once deployed, go to the Vercel frontend URL and log in with the seeded demo accounts:

- Admin: `admin@portal.com` / `admin123`
- Student: `student@portal.com` / `password123`

Then show the full workflow:

1. Admin views dashboard.
2. Admin creates or reviews jobs.
3. Student opens job listings and applies.
4. Admin changes the application status to `SHORTLISTED` or `HIRED`.
5. Student sees the updated status in My Applications.

This is the most reliable way to present the project in college because it avoids manual setup during the demo.
