package com.yash.school_management_system.controller;

import com.yash.school_management_system.model.*;
import com.yash.school_management_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private PasswordEncoder encoder;

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/grades")
    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    @PostMapping("/grades")
    public ResponseEntity<?> assignGrade(@RequestBody Map<String, String> payload) {
        Long studentId = Long.parseLong(payload.get("studentId"));
        String subject = payload.get("subject");
        String marks = payload.get("marks");
        String remarks = payload.get("remarks");

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Optional<Grade> existingGradeOpt = gradeRepository.findByStudentAndSubject(student, subject);
        Grade grade;
        if (existingGradeOpt.isPresent()) {
            grade = existingGradeOpt.get();
            grade.setMarks(marks);
            grade.setRemarks(remarks);
        } else {
            grade = Grade.builder()
                    .student(student)
                    .subject(subject)
                    .marks(marks)
                    .remarks(remarks)
                    .build();
        }

        gradeRepository.save(grade);
        return ResponseEntity.ok("Grade assigned/updated successfully!");
    }

    @PostMapping("/grades/by-roll-number")
    public ResponseEntity<?> assignGradeByRollNumber(@RequestBody Map<String, String> payload) {
        String rollNumber = payload.get("rollNumber");
        String subject = payload.get("subject");
        String marks = payload.get("marks");
        String remarks = payload.get("remarks");

        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new RuntimeException("Error: Student with Roll Number " + rollNumber + " not found!"));

        Optional<Grade> existingGradeOpt = gradeRepository.findByStudentAndSubject(student, subject);
        Grade grade;
        if (existingGradeOpt.isPresent()) {
            grade = existingGradeOpt.get();
            grade.setMarks(marks);
            grade.setRemarks(remarks);
        } else {
            grade = Grade.builder()
                    .student(student)
                    .subject(subject)
                    .marks(marks)
                    .remarks(remarks)
                    .build();
        }

        gradeRepository.save(grade);
        return ResponseEntity.ok("Grade assigned/updated successfully!");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getTeacherProfile(Principal principal) {
        String phoneNumber = principal.getName();
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        return ResponseEntity.ok(teacher);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateTeacherProfile(Principal principal, @RequestBody Map<String, String> payload) {
        String phoneNumber = principal.getName();
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        String newUsername = payload.get("username");
        String newEmail = payload.get("email");
        String newPhoneNumber = payload.get("phoneNumber");
        String newDateOfBirth = payload.get("dateOfBirth");
        String name = payload.get("name");
        String department = payload.get("department");

        // Validate uniqueness constraints
        if (newUsername != null && !user.getUsername().equals(newUsername) && userRepository.existsByUsername(newUsername)) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        if (newEmail != null && !user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        if (newPhoneNumber != null && !user.getPhoneNumber().equals(newPhoneNumber) && userRepository.existsByPhoneNumber(newPhoneNumber)) {
            return ResponseEntity.badRequest().body("Error: Phone number is already registered!");
        }

        if (newUsername != null) user.setUsername(newUsername);
        if (newEmail != null) user.setEmail(newEmail);
        if (newPhoneNumber != null) user.setPhoneNumber(newPhoneNumber);
        if (newDateOfBirth != null) {
            if (!newDateOfBirth.equals(user.getDateOfBirth())) {
                user.setDateOfBirth(newDateOfBirth);
                user.setPassword(encoder.encode(newDateOfBirth));
            }
        }
        userRepository.save(user);

        if (name != null) teacher.setName(name);
        if (department != null) teacher.setDepartment(department);
        teacherRepository.save(teacher);

        return ResponseEntity.ok("Profile updated successfully!");
    }

    @GetMapping("/assignments")
    public ResponseEntity<?> getAssignments(Principal principal) {
        String phoneNumber = principal.getName();
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        List<Assignment> assignments = assignmentRepository.findByTeacherId(teacher.getId());
        return ResponseEntity.ok(assignments);
    }

    @PostMapping("/assignments")
    public ResponseEntity<?> createAssignment(Principal principal, @RequestBody Map<String, Object> payload) {
        String phoneNumber = principal.getName();
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        String title = (String) payload.get("title");
        String subject = (String) payload.get("subject");
        String dueDate = (String) payload.get("dueDate");
        Integer maxMarks = Integer.parseInt(payload.get("maxMarks").toString());
        String instructions = (String) payload.get("instructions");

        Assignment assignment = Assignment.builder()
                .title(title)
                .subject(subject)
                .dueDate(dueDate)
                .maxMarks(maxMarks)
                .instructions(instructions)
                .teacher(teacher)
                .build();

        assignmentRepository.save(assignment);
        return ResponseEntity.ok("Assignment created successfully!");
    }
}
