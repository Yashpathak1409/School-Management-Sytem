package com.yash.school_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String role; // ADMIN, TEACHER, STUDENT

    // Student profile details (only if role is STUDENT)
    private String studentName;
    private String rollNumber;
    private String gradeLevel;

    // Teacher profile details (only if role is TEACHER)
    private String teacherName;
    private String department;
}
