# Project Setup Guide

---

# 🚀 QUICK RUN GUIDE (Recommended)
I have prepared **one-click scripts** so you don't have to install anything manually!

### Steps to Run:
1.  **Open the project folder** (`Student_Placement_Tracking_Portal`) on your Desktop.
2.  **Run `run_db.bat`**: Double-click this to start the database. (Keep the window open)
3.  **Run `run_backend.bat`**: Double-click this to start the Backend. (Wait until it says "Started PortalApplication")
4.  **Run `run_frontend.bat`**: Double-click this to start the Frontend.

### 🌐 Access the App
Open your browser and go to: [**http://localhost:5173**](http://localhost:5173)

---

## 🔑 Login Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@portal.com` | `admin123` |
| **Student** | `student@portal.com` | `password123` |

---

## 1. Prerequisites (For Reference Only)

### Java (JDK 17+)
1. Download Java JDK 17+ from Oracle or Adoptium.
2. Install and set the `JAVA_HOME` environment variable.
3. Verify by running: `java -version`

### MySQL Server
1. Download MySQL Community Server and MySQL Workbench.
2. Install with default settings and set a strong root password.
3. Verify by opening MySQL Workbench and connecting to your database.

### Node.js (Frontend)
1. Download Node.js LTS from the official website.
2. Install with default settings.
3. Verify by running: `node -v` and `npm -v`

---

## 2. Database Connection (MySQL)

1. Open MySQL Workbench.
2. Create the database:
   ```sql
   CREATE DATABASE placement_portal_db;
   ```
3. Update the `backend/src/main/resources/application.properties` with your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/placement_portal_db
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

---

## 3. How to Run Backend (Spring Boot)

1. Open a terminal.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Run the application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows use `mvnw spring-boot:run`)*
4. The backend will start on `http://localhost:8080`.

---

## 4. How to Run Frontend (React)

1. Open a new terminal.
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. The frontend will start at `http://localhost:5173`. Open this URL in your browser.

---

## 5. How to Test APIs (Postman)

1. Download and install Postman.
2. Create a new Request.
3. Set the method to `POST`.
4. Enter the URL: `http://localhost:8080/api/auth/signup`
5. Go to the "Body" tab, select "raw" and "JSON".
6. Enter this payload:
   ```json
   {
     "email": "student@example.com",
     "password": "password123",
     "role": "STUDENT"
   }
   ```
7. Click "Send" and check for a successful response.
8. Repeat for login endpoints, extract the JWT token, and use it in the "Authorization" header (`Bearer <YOUR_TOKEN>`) for all subsequent requests.
