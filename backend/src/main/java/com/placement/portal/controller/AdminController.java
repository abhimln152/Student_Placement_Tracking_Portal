package com.placement.portal.controller;

import com.placement.portal.model.Company;
import com.placement.portal.service.CompanyService;
import com.placement.portal.service.StudentProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private StudentProfileService studentService;

    @Autowired
    private CompanyService companyService;

    // Student Management
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Company Management
    @PostMapping("/companies")
    public ResponseEntity<?> addCompany(@RequestBody Company company) {
        return ResponseEntity.ok(companyService.addCompany(company));
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @Autowired
    private com.placement.portal.repository.JobPostingRepository jobRepository;

    @Autowired
    private com.placement.portal.repository.ApplicationRepository applicationRepository;

    // Analytics Dashboard Stats
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getStats() {
        long totalStudents = studentService.getAllStudents().size();
        long totalCompanies = companyService.getAllCompanies().size();
        long activeJobs = jobRepository.findByStatus(com.placement.portal.model.JobPosting.JobStatus.OPEN).size();
        long totalPlaced = applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == com.placement.portal.model.Application.AppStatus.HIRED)
                .map(a -> a.getStudent().getId())
                .distinct()
                .count();

        return ResponseEntity.ok(new com.placement.portal.dto.DashboardStats(
                totalStudents, totalPlaced, totalCompanies, activeJobs));
    }
}
