USE placement_portal_db;

-- Delete old/incorrect entries
DELETE FROM users WHERE email IN ('admin@portal.com', 'student@portal.com', 'admin@placement.edu');

-- Insert Admin (admin123)
INSERT INTO users (email, password, role) 
VALUES ('admin@portal.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOnu', 'ADMIN');

-- Insert Student (password123)
INSERT INTO users (email, password, role) 
VALUES ('student@portal.com', '$2a$10$vI84WZ1KuWp.Y96GDe7oA.UvR9W.pXl2tM.iG8G9vRzH.Z.v0N.C.', 'STUDENT');

-- Link Student Profile
INSERT INTO student_profiles (user_id, full_name, roll_number, branch, batch_year, cgpa) 
SELECT id, 'Test Student', 'ST001', 'Computer Science', 2024, 8.5 
FROM users 
WHERE email='student@portal.com';
