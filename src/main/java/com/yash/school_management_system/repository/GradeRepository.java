package com.yash.school_management_system.repository;

import com.yash.school_management_system.model.Grade;
import com.yash.school_management_system.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByStudentRollNumber(String rollNumber);
    Optional<Grade> findByStudentAndSubject(Student student, String subject);
}
