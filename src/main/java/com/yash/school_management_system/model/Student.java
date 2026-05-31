package com.yash.school_management_system.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String rollNumber;

    @Column(nullable = false)
    private String gradeLevel;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column
    private Boolean isHosteler;

    @Column
    private String transportType;

    @Column
    private String villageName;

    @Column
    private String aadhaarCardNo;

    @Column
    private String enrolledCourse;

    @Column
    private Double lastYearMarks;

    @Column
    private String section;

    @Column
    private String gender;

    @Column
    private String fatherName;

    @Column
    private String motherName;

    @Column
    private String parentPhoneNo;

    @Column
    private String parentProfession;

    @Column
    private String siblings;

    @Column(nullable = false)
    @Builder.Default
    private Boolean profileCompleted = false;

    @Column(nullable = false)
    @Builder.Default
    private Double totalBilledAmount = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double billedTuitionFee = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double billedSportsFee = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double billedLabFee = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double billedSchoolAccessoriesFee = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double billedTransportFee = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double billedHostelFee = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double billedOtherCharges = 0.0;

    @Column(length = 2000)
    private String timetable;
}
