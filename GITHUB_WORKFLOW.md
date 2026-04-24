# GitHub Workflow Guide

This guide will teach you how to properly manage your code using Git and GitHub for your university project.

## 1. Initialize Git Repository
1. Open a terminal in the root project folder: `c:\Users\ashis\OneDrive\Desktop\Student_Placement_Tracking_Portal`
2. Initialize git:
   ```bash
   git init
   ```
3. Create a `.gitignore` file mapping node_modules, build outputs, and IDE files so they don't bloat your repo. Included with the code.

## 2. Create Project Folders
Your code should primarily be split into two main directories:
- `/backend` (Java/Spring Boot code)
- `/frontend` (React code)

## 3. Commit Backend Code
When you have created the backend structure:
```bash
git add backend/
git commit -m "feat: setup initial spring boot backend architecture"
```

## 4. Commit Frontend Code
When you have created the frontend React application:
```bash
git add frontend/
git commit -m "feat: setup react frontend with tailwind and vite"
```

## 5. Branching Strategy (For Features)
Never work directly on the `main` branch when developing a feature. Create a separate branch:
```bash
# Example: Adding authentication
git checkout -b feature/authentication
```
Once the feature text is done, merge it back:
```bash
git checkout main
git merge feature/authentication
```

## 6. Write Good Commit Messages
Follow professional conventions (Conventional Commits):
- `feat: added student dashboard component` (For new features)
- `fix: resolved jwt token expiration bug` (For bug fixes)
- `docs: updated setup guide in readme` (For documentation)
- `refactor: cleaned up user service structure` (For code improvements)

## 7. Push Code to GitHub
1. Go to GitHub and click "New Repository".
2. Name it `Student-Placement-Tracking-Portal` (do NOT initialize with README if you already have one locally).
3. Connect your local repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/Student-Placement-Tracking-Portal.git
   git branch -M main
   git push -u origin main
   ```

## 8. Create a Professional README
Ensure `README.md` at the root contains:
1. **Title and Description** of the project
2. **Tech Stack** used
3. **Features** listed clearly
4. **How to Run Local Instructions** (Referencing the SETUP_GUIDE.md or summarized)
5. **Screenshots** of the UI (upload to GitHub and link them)
