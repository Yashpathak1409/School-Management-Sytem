package com.yash.school_management_system.controller;

import com.yash.school_management_system.model.Grade;
import com.yash.school_management_system.model.Student;
import com.yash.school_management_system.repository.GradeRepository;
import com.yash.school_management_system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private GradeRepository gradeRepository;

    private Student getLoggedInStudent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String phoneNumber = authentication.getName();
        return studentRepository.findByUserPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Student profile not found for phone number: " + phoneNumber));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            return ResponseEntity.ok(getLoggedInStudent());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody com.yash.school_management_system.dto.StudentProfileRequest profileRequest) {
        try {
            Student student = getLoggedInStudent();

            // Validation
            if (profileRequest.getIsHosteler() == null) {
                return ResponseEntity.badRequest().body("Hosteler status is required.");
            }
            if (profileRequest.getTransportType() == null || profileRequest.getTransportType().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Transport type selection is required.");
            }
            if (profileRequest.getVillageName() == null || profileRequest.getVillageName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Village/City name is required.");
            }
            if (profileRequest.getAadhaarCardNo() == null || !profileRequest.getAadhaarCardNo().matches("^\\d{12}$")) {
                return ResponseEntity.badRequest().body("Aadhaar Card Number must be exactly 12 digits.");
            }
            if (profileRequest.getEnrolledCourse() == null || profileRequest.getEnrolledCourse().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Enrolled course is required.");
            }
            if (profileRequest.getLastYearMarks() == null || profileRequest.getLastYearMarks() < 0.0 || profileRequest.getLastYearMarks() > 100.0) {
                return ResponseEntity.badRequest().body("Last Year Marks must be a percentage between 0 and 100.");
            }
            if (profileRequest.getGender() == null || profileRequest.getGender().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Gender is required.");
            }

            // Map fields
            student.setIsHosteler(profileRequest.getIsHosteler());
            student.setTransportType(profileRequest.getTransportType());
            student.setVillageName(profileRequest.getVillageName());
            student.setAadhaarCardNo(profileRequest.getAadhaarCardNo());
            student.setEnrolledCourse(profileRequest.getEnrolledCourse());
            student.setLastYearMarks(profileRequest.getLastYearMarks());
            student.setGender(profileRequest.getGender());

            // Section Auto-Allocation Logic
            if (profileRequest.getLastYearMarks() >= 85.0) {
                student.setSection("Section A");
            } else if (profileRequest.getLastYearMarks() >= 60.0) {
                student.setSection("Section B");
            } else {
                student.setSection("Section C");
            }

            student.setProfileCompleted(true);
            Student savedStudent = studentRepository.save(student);
            return ResponseEntity.ok(savedStudent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }

    @GetMapping("/grades")
    public ResponseEntity<List<Grade>> getGrades() {
        Student student = getLoggedInStudent();
        List<Grade> grades = gradeRepository.findByStudentId(student.getId());
        return ResponseEntity.ok(grades);
    }

    @Autowired
    private com.yash.school_management_system.repository.FeeRecordRepository feeRecordRepository;

    @GetMapping("/fees")
    public ResponseEntity<?> getFees() {
        try {
            Student student = getLoggedInStudent();
            List<com.yash.school_management_system.model.FeeRecord> fees = feeRecordRepository.findByStudentId(student.getId());
            return ResponseEntity.ok(fees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
