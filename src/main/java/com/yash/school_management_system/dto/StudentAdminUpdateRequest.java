package com.yash.school_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAdminUpdateRequest {
    // User fields
    private String username;
    private String email;
    private String phoneNumber;
    private String dateOfBirth;

    // Student fields
    private String name;
    private String rollNumber;
    private String gradeLevel;

    private Boolean isHosteler;
    private String transportType;
    private String villageName;
    private String aadhaarCardNo;
    private String enrolledCourse;
    private Double lastYearMarks;
    private String gender;

    // Family details
    private String fatherName;
    private String motherName;
    private String parentPhoneNo;
    private String parentProfession;
    private String siblings;

    private String timetable;
}
