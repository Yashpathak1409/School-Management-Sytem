package com.yash.school_management_system.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String department;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "basic_salary")
    private Double basicSalary;

    @Column(name = "allowance")
    private Double allowance;

    @Column(name = "deduction")
    private Double deduction;

    @Column(name = "timetable", length = 2000)
    private String timetable;
}
