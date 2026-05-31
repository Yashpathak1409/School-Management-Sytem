package com.yash.school_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileRequest {
    private Boolean isHosteler;
    private String transportType;
    private String villageName;
    private String aadhaarCardNo;
    private String enrolledCourse;
    private Double lastYearMarks;
    private String gender;
}
