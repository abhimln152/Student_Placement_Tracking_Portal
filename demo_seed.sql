USE placement_portal_db;

-- Demo accounts for college presentation
INSERT IGNORE INTO users (email, password, role)
VALUES ('admin@portal.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'ADMIN');

INSERT IGNORE INTO users (email, password, role)
VALUES ('student@portal.com', '$2a$10$vI84WZ1KuWp.Y96GDe7oA.UvR9W.pXl2tM.iG8G9vRzH.Z.v0N.C.', 'STUDENT');

-- Student profile used by the dashboard and application flow
INSERT IGNORE INTO student_profiles (user_id, full_name, roll_number, branch, batch_year, cgpa, skills, resume_url)
SELECT id, 'Test Student', 'ST001', 'Computer Science', 2026, 8.40, 'Java, Spring Boot, React, SQL', 'https://example.com/resume'
FROM users
WHERE email = 'student@portal.com';

-- Company and job used to demonstrate the hiring workflow
INSERT IGNORE INTO companies (name, description, website, industry)
VALUES ('Acme Tech', 'Campus hiring partner for software engineering roles.', 'https://acme.example', 'Information Technology');

INSERT IGNORE INTO job_postings (company_id, title, description, package_lpa, eligibility_cgpa, deadline, status)
SELECT c.id, 'Software Engineer Intern', 'Internship role focused on Java Spring Boot and React development.', 8.00, 7.00, '2026-12-31 23:59:00', 'OPEN'
FROM companies c
WHERE c.name = 'Acme Tech';

-- Start the workflow with one pending application so admins can shortlist/hire during the demo
INSERT IGNORE INTO applications (student_id, job_id, status)
SELECT sp.id, jp.id, 'PENDING'
FROM student_profiles sp
JOIN users u ON u.id = sp.user_id
JOIN job_postings jp ON jp.title = 'Software Engineer Intern'
JOIN companies c ON c.id = jp.company_id
WHERE u.email = 'student@portal.com'
  AND c.name = 'Acme Tech';