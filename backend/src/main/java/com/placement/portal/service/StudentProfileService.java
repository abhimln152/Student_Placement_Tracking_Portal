package com.placement.portal.service;

import com.placement.portal.model.StudentProfile;
import com.placement.portal.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentProfileService {

    @Autowired
    private StudentProfileRepository repository;

    public Optional<StudentProfile> getProfileByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public StudentProfile updateProfile(Long userId, StudentProfile updatedProfile) {
        StudentProfile existing = repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existing.setFullName(updatedProfile.getFullName());
        existing.setBranch(updatedProfile.getBranch());
        existing.setBatchYear(updatedProfile.getBatchYear());
        existing.setCgpa(updatedProfile.getCgpa());
        existing.setSkills(updatedProfile.getSkills());
        existing.setResumeUrl(updatedProfile.getResumeUrl());
        
        return repository.save(existing);
    }
    
    public List<StudentProfile> getAllStudents() {
        return repository.findAll();
    }
}
