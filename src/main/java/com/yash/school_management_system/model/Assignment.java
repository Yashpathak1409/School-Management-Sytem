package com.yash.school_management_system.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String dueDate;

    @Column(nullable = false)
    private Integer maxMarks;

    @Column(length = 1000)
    private String instructions;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
}
