package com.placement.portal.dto;

import com.placement.portal.model.Role;
import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private Role role; // ADMIN or STUDENT
    private String fullName; // Optional for admin, required for student
    private String rollNumber; // Required for student
    private String branch; // Required for student
    private Integer batchYear; // Required for student
}
