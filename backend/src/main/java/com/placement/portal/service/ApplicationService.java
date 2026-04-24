package com.placement.portal.service;

import com.placement.portal.model.Application;
import com.placement.portal.model.JobPosting;
import com.placement.portal.model.StudentProfile;
import com.placement.portal.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentProfileService studentService;

    @Autowired
    private JobPostingService jobService;

    public Application applyForJob(Long studentId, Long jobId) {
        // Validation constraint checking logic
        if (applicationRepository.findByStudentIdAndJobId(studentId, jobId).isPresent()) {
            throw new RuntimeException("Already applied for this job.");
        }

        StudentProfile student = studentService.getProfileByUserId(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        JobPosting job = jobService.getJobById(jobId);

        if (job.getStatus() == JobPosting.JobStatus.CLOSED) {
            throw new RuntimeException("Job posting is closed.");
        }

        if (student.getCgpa().compareTo(job.getEligibilityCgpa()) < 0) {
            throw new RuntimeException("Student does not meet the eligibility CGPA.");
        }

        Application app = new Application();
        app.setStudent(student);
        app.setJob(job);
        app.setStatus(Application.AppStatus.PENDING);
        
        return applicationRepository.save(app);
    }

    public List<Application> getStudentApplications(Long studentId) {
        StudentProfile student = studentService.getProfileByUserId(studentId).orElseThrow();
        return applicationRepository.findByStudentId(student.getId());
    }

    public List<Application> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Application updateApplicationStatus(Long applicationId, Application.AppStatus newStatus) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        app.setStatus(newStatus);
        return applicationRepository.save(app);
    }
}
