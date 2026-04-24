package com.placement.portal.controller;

import com.placement.portal.dto.AuthResponse;
import com.placement.portal.dto.LoginRequest;
import com.placement.portal.dto.SignupRequest;
import com.placement.portal.model.Role;
import com.placement.portal.model.StudentProfile;
import com.placement.portal.model.User;
import com.placement.portal.repository.StudentProfileRepository;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.security.CustomUserDetailsService;
import com.placement.portal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already taken!");
        }

        // Create new user's account
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user = userRepository.save(user);

        // If STUDENT, also create a basic profile
        if (request.getRole() == Role.STUDENT) {
            if (request.getRollNumber() == null || request.getFullName() == null) {
                return ResponseEntity.badRequest().body("Error: Student details (name, roll) are required.");
            }
            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setFullName(request.getFullName());
            profile.setRollNumber(request.getRollNumber());
            profile.setBranch(request.getBranch() != null ? request.getBranch() : "N/A");
            profile.setBatchYear(request.getBatchYear() != null ? request.getBatchYear() : 2025);
            profile.setCgpa(BigDecimal.ZERO); // Default initially
            studentProfileRepository.save(profile);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwt = jwtUtil.generateToken(userDetails, user.getRole().name());

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getRole(), user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect email or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        User user = userRepository.findByEmail(loginRequest.getEmail()).get();
        final String jwt = jwtUtil.generateToken(userDetails, user.getRole().name());

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getRole(), user.getId()));
    }
}
