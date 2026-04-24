package com.placement.portal;

import com.placement.portal.model.Role;
import com.placement.portal.model.User;
import com.placement.portal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortalApplication.class, args);
    }

    @Bean
    public CommandLineRunner setupData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@portal.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@portal.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }
            if (userRepository.findByEmail("student@portal.com").isEmpty()) {
                User student = new User();
                student.setEmail("student@portal.com");
                student.setPassword(passwordEncoder.encode("password123"));
                student.setRole(Role.STUDENT);
                userRepository.save(student);
            }
        };
    }
}
