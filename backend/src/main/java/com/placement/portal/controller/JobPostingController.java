package com.placement.portal.controller;

import com.placement.portal.model.JobPosting;
import com.placement.portal.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobPostingController {

    @Autowired
    private JobPostingService jobService;

    // Both Admin and Student can view open jobs
    @GetMapping
    public ResponseEntity<?> getOpenJobs() {
        return ResponseEntity.ok(jobService.getOpenJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.getJobById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Admin Only
    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobPosting job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    // Admin Only
    @GetMapping("/all")
    public ResponseEntity<?> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // Admin Only
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam JobPosting.JobStatus status) {
        return ResponseEntity.ok(jobService.updateJobStatus(id, status));
    }
}
