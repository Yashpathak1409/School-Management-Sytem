package com.yash.school_management_system.repository;

import com.yash.school_management_system.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByUserUsername(String username);
    Optional<Student> findByUserPhoneNumber(String phoneNumber);
    Optional<Student> findByUserId(Long userId);
    Boolean existsByRollNumber(String rollNumber);
}
