package com.placement.portal.service;

import com.placement.portal.model.JobPosting;
import com.placement.portal.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostingService {

    @Autowired
    private JobPostingRepository repository;

    public JobPosting createJob(JobPosting job) {
        job.setStatus(JobPosting.JobStatus.OPEN);
        return repository.save(job);
    }

    public List<JobPosting> getAllJobs() {
        return repository.findAll();
    }

    public List<JobPosting> getOpenJobs() {
        return repository.findByStatus(JobPosting.JobStatus.OPEN);
    }

    public JobPosting getJobById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public JobPosting updateJobStatus(Long id, JobPosting.JobStatus status) {
        JobPosting job = getJobById(id);
        job.setStatus(status);
        return repository.save(job);
    }
}
