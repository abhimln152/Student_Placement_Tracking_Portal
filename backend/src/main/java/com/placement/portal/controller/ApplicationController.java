package com.placement.portal.controller;

import com.placement.portal.model.Application;
import com.placement.portal.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService appService;

    // Student applying
    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestParam Long userId, @RequestParam Long jobId) {
        try {
            return ResponseEntity.ok(appService.applyForJob(userId, jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Student views their own
    @GetMapping("/student/{userId}")
    public ResponseEntity<?> getStudentApplications(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(appService.getStudentApplications(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin views applicants for a job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(appService.getJobApplications(jobId));
    }

    // Admin updates status (Shortlisted, Rejected, Hired)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam Application.AppStatus status) {
        try {
            return ResponseEntity.ok(appService.updateApplicationStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
