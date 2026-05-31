package com.yash.school_management_system.controller;

import com.yash.school_management_system.model.Role;
import com.yash.school_management_system.model.Student;
import com.yash.school_management_system.model.Teacher;
import com.yash.school_management_system.model.User;
import com.yash.school_management_system.repository.StudentRepository;
import com.yash.school_management_system.repository.TeacherRepository;
import com.yash.school_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private com.yash.school_management_system.repository.FeeRecordRepository feeRecordRepository;

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        String name = payload.get("name");
        String rollNumber = payload.get("rollNumber");
        String gradeLevel = payload.get("gradeLevel");
        String phoneNumber = payload.get("phoneNumber");
        String dateOfBirth = payload.get("dateOfBirth");

        if (phoneNumber == null || dateOfBirth == null) {
            return ResponseEntity.badRequest().body("Error: Phone number and Date of Birth are required!");
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            return ResponseEntity.badRequest().body("Error: Phone number is already registered!");
        }

        if (studentRepository.existsByRollNumber(rollNumber)) {
            return ResponseEntity.badRequest().body("Error: Roll number is already registered!");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .phoneNumber(phoneNumber)
                .dateOfBirth(dateOfBirth)
                .password(encoder.encode(dateOfBirth)) // DOB is hashed as password
                .roles(Set.of(Role.ROLE_STUDENT))
                .build();

        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .name(name)
                .rollNumber(rollNumber)
                .gradeLevel(gradeLevel)
                .user(savedUser)
                .fatherName(payload.get("fatherName"))
                .motherName(payload.get("motherName"))
                .parentPhoneNo(payload.get("parentPhoneNo"))
                .parentProfession(payload.get("parentProfession"))
                .siblings(payload.get("siblings"))
                .build();

        studentRepository.save(student);
        return ResponseEntity.ok("Student created successfully!");
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody com.yash.school_management_system.dto.StudentAdminUpdateRequest request) {
        try {
            Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student not found."));

            User user = student.getUser();

            // Validate uniqueness constraints
            if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }
            if (!user.getPhoneNumber().equals(request.getPhoneNumber()) && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                return ResponseEntity.badRequest().body("Error: Phone number is already registered!");
            }
            if (!student.getRollNumber().equals(request.getRollNumber()) && studentRepository.existsByRollNumber(request.getRollNumber())) {
                return ResponseEntity.badRequest().body("Error: Roll number is already registered!");
            }

            // Update user details
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            
            // If date of birth has changed, update password to encrypted new DOB
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().equals(user.getDateOfBirth())) {
                user.setDateOfBirth(request.getDateOfBirth());
                user.setPassword(encoder.encode(request.getDateOfBirth()));
            }
            userRepository.save(user);

            // Update student details
            student.setName(request.getName());
            student.setRollNumber(request.getRollNumber());
            student.setGradeLevel(request.getGradeLevel());

            student.setIsHosteler(request.getIsHosteler());
            student.setTransportType(request.getTransportType());
            student.setVillageName(request.getVillageName());
            student.setAadhaarCardNo(request.getAadhaarCardNo());
            student.setEnrolledCourse(request.getEnrolledCourse());
            student.setGender(request.getGender());

            if (request.getLastYearMarks() != null) {
                student.setLastYearMarks(request.getLastYearMarks());
                // Re-allocate section based on edited marks
                if (request.getLastYearMarks() >= 85.0) {
                    student.setSection("Section A");
                } else if (request.getLastYearMarks() >= 60.0) {
                    student.setSection("Section B");
                } else {
                    student.setSection("Section C");
                }
            }

            // Update family details
            student.setFatherName(request.getFatherName());
            student.setMotherName(request.getMotherName());
            student.setParentPhoneNo(request.getParentPhoneNo());
            student.setParentProfession(request.getParentProfession());
            student.setSiblings(request.getSiblings());
            student.setTimetable(request.getTimetable());

            studentRepository.save(student);
            return ResponseEntity.ok("Student updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating student: " + e.getMessage());
        }
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return ResponseEntity.ok("Student deleted successfully!");
    }

    @GetMapping("/teachers")
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @PostMapping("/teachers")
    public ResponseEntity<?> createTeacher(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        String name = payload.get("name");
        String department = payload.get("department");
        String phoneNumber = payload.get("phoneNumber");
        String dateOfBirth = payload.get("dateOfBirth");

        if (phoneNumber == null || dateOfBirth == null) {
            return ResponseEntity.badRequest().body("Error: Phone number and Date of Birth are required!");
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            return ResponseEntity.badRequest().body("Error: Phone number is already registered!");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .phoneNumber(phoneNumber)
                .dateOfBirth(dateOfBirth)
                .password(encoder.encode(dateOfBirth)) // DOB is hashed as password
                .roles(Set.of(Role.ROLE_TEACHER))
                .build();

        User savedUser = userRepository.save(user);

        Teacher teacher = Teacher.builder()
                .name(name)
                .department(department)
                .user(savedUser)
                .basicSalary(payload.containsKey("basicSalary") ? Double.parseDouble(payload.get("basicSalary")) : 45000.0)
                .allowance(payload.containsKey("allowance") ? Double.parseDouble(payload.get("allowance")) : 5000.0)
                .deduction(payload.containsKey("deduction") ? Double.parseDouble(payload.get("deduction")) : 2000.0)
                .timetable(payload.getOrDefault("timetable", "Monday: 09:00 AM - 10:00 AM (Mathematics - Grade 10-A)"))
                .build();

        teacherRepository.save(teacher);
        return ResponseEntity.ok("Teacher created successfully!");
    }

    @PutMapping("/teachers/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @RequestBody com.yash.school_management_system.dto.TeacherAdminUpdateRequest request) {
        try {
            Teacher teacher = teacherRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Teacher not found."));

            User user = teacher.getUser();

            // Validate uniqueness constraints
            if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }
            if (!user.getPhoneNumber().equals(request.getPhoneNumber()) && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                return ResponseEntity.badRequest().body("Error: Phone number is already registered!");
            }

            // Update user details
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());

            // If date of birth has changed, update password to encrypted new DOB
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().equals(user.getDateOfBirth())) {
                user.setDateOfBirth(request.getDateOfBirth());
                user.setPassword(encoder.encode(request.getDateOfBirth()));
            }
            userRepository.save(user);

            // Update teacher details
            teacher.setName(request.getName());
            teacher.setDepartment(request.getDepartment());
            teacher.setBasicSalary(request.getBasicSalary());
            teacher.setAllowance(request.getAllowance());
            teacher.setDeduction(request.getDeduction());
            teacher.setTimetable(request.getTimetable());

            teacherRepository.save(teacher);
            return ResponseEntity.ok("Teacher updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating teacher: " + e.getMessage());
        }
    }

    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        teacherRepository.deleteById(id);
        return ResponseEntity.ok("Teacher deleted successfully!");
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
      Map<String, Object> stats = new HashMap<>();
      stats.put("totalStudents", studentRepository.count());
      stats.put("totalTeachers", teacherRepository.count());
      stats.put("totalUsers", userRepository.count());
      return stats;
    }

    @GetMapping("/fees")
    public List<com.yash.school_management_system.model.FeeRecord> getAllFees() {
        return feeRecordRepository.findAll();
    }

    @PostMapping("/fees/deposit")
    public ResponseEntity<?> depositFee(@RequestBody com.yash.school_management_system.dto.FeePaymentRequest request) {
        try {
            if (request.getRollNumber() == null || request.getRollNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Roll number is required!");
            }
            if (request.getMonth() == null || request.getMonth().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Target month is required!");
            }
            if (request.getYear() == null || request.getYear().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Target year is required!");
            }

            Student student = studentRepository.findByRollNumber(request.getRollNumber().trim())
                    .orElseThrow(() -> new RuntimeException("Student not found for Roll Number: " + request.getRollNumber()));

            Double tuition = request.getTuitionFee() != null ? request.getTuitionFee() : 0.0;
            Double sports = request.getSportsFee() != null ? request.getSportsFee() : 0.0;
            Double lab = request.getLabFee() != null ? request.getLabFee() : 0.0;
            Double accessories = request.getSchoolAccessoriesFee() != null ? request.getSchoolAccessoriesFee() : 0.0;
            Double transport = request.getTransportFee() != null ? request.getTransportFee() : 0.0;
            Double hostel = request.getHostelFee() != null ? request.getHostelFee() : 0.0;
            Double other = request.getOtherCharges() != null ? request.getOtherCharges() : 0.0;

            Double totalSum = tuition + sports + lab + accessories + transport + hostel + other;

            if (totalSum <= 0.0) {
                return ResponseEntity.badRequest().body("Error: Total fee payment amount must be greater than zero!");
            }

            com.yash.school_management_system.model.FeeRecord fee = com.yash.school_management_system.model.FeeRecord.builder()
                    .student(student)
                    .amountPaid(totalSum)
                    .tuitionFee(tuition)
                    .sportsFee(sports)
                    .labFee(lab)
                    .schoolAccessoriesFee(accessories)
                    .transportFee(transport)
                    .hostelFee(hostel)
                    .otherCharges(other)
                    .month(request.getMonth())
                    .year(request.getYear())
                    .paymentDate(java.time.LocalDateTime.now())
                    .remarks(request.getRemarks())
                    .build();

            feeRecordRepository.save(fee);
            return ResponseEntity.ok("Fee deposited successfully for student " + student.getName() + " (Roll No: " + student.getRollNumber() + ")");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing fee deposit: " + e.getMessage());
        }
    }

    @PostMapping("/fees/assign")
    public ResponseEntity<?> assignFee(@RequestBody com.yash.school_management_system.dto.FeePaymentRequest request) {
        try {
            if (request.getRollNumber() == null || request.getRollNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Roll number is required!");
            }

            Student student = studentRepository.findByRollNumber(request.getRollNumber().trim())
                    .orElseThrow(() -> new RuntimeException("Student not found for Roll Number: " + request.getRollNumber()));

            Double tuition = request.getTuitionFee() != null ? request.getTuitionFee() : 0.0;
            Double sports = request.getSportsFee() != null ? request.getSportsFee() : 0.0;
            Double lab = request.getLabFee() != null ? request.getLabFee() : 0.0;
            Double accessories = request.getSchoolAccessoriesFee() != null ? request.getSchoolAccessoriesFee() : 0.0;
            Double transport = request.getTransportFee() != null ? request.getTransportFee() : 0.0;
            Double hostel = request.getHostelFee() != null ? request.getHostelFee() : 0.0;
            Double other = request.getOtherCharges() != null ? request.getOtherCharges() : 0.0;

            Double totalSum = tuition + sports + lab + accessories + transport + hostel + other;

            if (totalSum <= 0.0) {
                return ResponseEntity.badRequest().body("Error: Total assigned fee amount must be greater than zero!");
            }

            student.setBilledTuitionFee(tuition);
            student.setBilledSportsFee(sports);
            student.setBilledLabFee(lab);
            student.setBilledSchoolAccessoriesFee(accessories);
            student.setBilledTransportFee(transport);
            student.setBilledHostelFee(hostel);
            student.setBilledOtherCharges(other);
            student.setTotalBilledAmount(totalSum);
            studentRepository.save(student);

            return ResponseEntity.ok("Successfully assigned Rs. " + String.format("%.2f", totalSum) + " billing target to student " + student.getName() + " (Roll No: " + student.getRollNumber() + ")");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error assigning fee: " + e.getMessage());
        }
    }

    @PutMapping("/timetable/teacher")
    public ResponseEntity<?> updateTeacherTimetable(@RequestBody Map<String, String> payload) {
        try {
            Long id = Long.parseLong(payload.get("id"));
            String timetable = payload.get("timetable");
            Teacher teacher = teacherRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            teacher.setTimetable(timetable);
            teacherRepository.save(teacher);
            return ResponseEntity.ok("Teacher timetable updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating teacher timetable: " + e.getMessage());
        }
    }

    @PutMapping("/timetable/class")
    public ResponseEntity<?> updateClassTimetable(@RequestBody Map<String, String> payload) {
        try {
            String gradeLevel = payload.get("gradeLevel");
            String timetable = payload.get("timetable");
            List<Student> students = studentRepository.findAll();
            for (Student student : students) {
                if (gradeLevel.equalsIgnoreCase(student.getGradeLevel())) {
                    student.setTimetable(timetable);
                    studentRepository.save(student);
                }
            }
            return ResponseEntity.ok("Class " + gradeLevel + " timetable updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating class timetable: " + e.getMessage());
        }
    }

    @PutMapping("/timetable/student")
    public ResponseEntity<?> updateStudentTimetable(@RequestBody Map<String, String> payload) {
        try {
            Long id = Long.parseLong(payload.get("id"));
            String timetable = payload.get("timetable");
            Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            student.setTimetable(timetable);
            studentRepository.save(student);
            return ResponseEntity.ok("Student timetable updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating student timetable: " + e.getMessage());
        }
    }
}
