package com.yash.school_management_system.security;

import com.yash.school_management_system.model.Role;
import com.yash.school_management_system.model.User;
import com.yash.school_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin if no users exist in the system
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@school.com")
                    .phoneNumber("1234567890")
                    .dateOfBirth("2000-01-01")
                    .password(passwordEncoder.encode("2000-01-01"))
                    .roles(Set.of(Role.ROLE_ADMIN))
                    .build();

            userRepository.save(admin);
            System.out.println("Default Admin Account initialized. Phone: 1234567890, DOB: 2000-01-01");
        }

        // Fix Abhishek Sharma's DOB if it is the incorrect 20004-12-12
        userRepository.findByPhoneNumber("7217362423").ifPresent(user -> {
            if ("20004-12-12".equals(user.getDateOfBirth())) {
                user.setDateOfBirth("2004-12-12");
                user.setPassword(passwordEncoder.encode("2004-12-12"));
                userRepository.save(user);
                System.out.println("[DB INITIALIZER] Corrected Abhishek Sharma's DOB and password to 2004-12-12");
            }
        });
    }
}
