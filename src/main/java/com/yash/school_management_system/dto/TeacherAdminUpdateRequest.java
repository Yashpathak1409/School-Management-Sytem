package com.yash.school_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherAdminUpdateRequest {
    // User fields
    private String username;
    private String email;
    private String phoneNumber;
    private String dateOfBirth;

    // Teacher fields
    private String name;
    private String department;
    private Double basicSalary;
    private Double allowance;
    private Double deduction;
    private String timetable;
}
