package com.yash.school_management_system.controller;

import com.yash.school_management_system.dto.LoginRequest;
import com.yash.school_management_system.dto.JwtResponse;
import com.yash.school_management_system.dto.RegisterRequest;
import com.yash.school_management_system.model.Role;
import com.yash.school_management_system.model.Student;
import com.yash.school_management_system.model.Teacher;
import com.yash.school_management_system.model.User;
import com.yash.school_management_system.repository.StudentRepository;
import com.yash.school_management_system.repository.TeacherRepository;
import com.yash.school_management_system.repository.UserRepository;
import com.yash.school_management_system.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("[AUTH DEBUG] Login attempt - Phone: " + loginRequest.getPhoneNumber() 
                    + ", DOB: " + loginRequest.getDateOfBirth() + ", Role: " + loginRequest.getRole());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getPhoneNumber(), loginRequest.getDateOfBirth()));

            System.out.println("[AUTH DEBUG] Authentication succeeded in manager");
            SecurityContextHolder.getContext().setAuthentication(authentication);

            org.springframework.security.core.userdetails.User userDetails = 
                    (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            
            User user = userRepository.findByPhoneNumber(userDetails.getUsername()).orElseThrow();
            
            Role selectedRole;
            try {
                selectedRole = Role.valueOf(loginRequest.getRole());
            } catch (IllegalArgumentException e) {
                System.out.println("[AUTH DEBUG] Invalid role string: " + loginRequest.getRole());
                return ResponseEntity.badRequest().body("Error: Invalid role specified.");
            }

            if (!user.getRoles().contains(selectedRole)) {
                System.out.println("[AUTH DEBUG] Role check failed. User roles: " + user.getRoles() + ", requested: " + selectedRole);
                return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                        .body("Access Denied: Invalid role for this account.");
            }

            // Single Session Enforcement: Generate and persist new session token
            String sessionToken = java.util.UUID.randomUUID().toString();
            user.setSessionToken(sessionToken);
            userRepository.save(user);

            String jwt = jwtUtil.generateToken(user.getPhoneNumber(), sessionToken);
            
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            System.out.println("[AUTH DEBUG] Token generated successfully for user " + user.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt, user.getUsername(), user.getEmail(), roles));
        } catch (Exception e) {
            System.err.println("[AUTH DEBUG] Authentication Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body("Authentication failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                .body("Error: Public registration is disabled. Please contact the administrator.");
    }
}
