package com.yash.school_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student;

    @Column(nullable = false)
    private Double amountPaid;

    @Column(nullable = false)
    private Double tuitionFee;

    @Column(nullable = false)
    private Double sportsFee;

    @Column(nullable = false)
    private Double labFee;

    @Column(nullable = false)
    private Double schoolAccessoriesFee;

    @Column(nullable = false)
    private Double transportFee;

    @Column(nullable = false)
    private Double hostelFee;

    @Column(nullable = false)
    private Double otherCharges;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private String year;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @Column
    private String remarks;
}
