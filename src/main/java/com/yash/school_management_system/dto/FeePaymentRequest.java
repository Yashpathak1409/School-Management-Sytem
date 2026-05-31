package com.yash.school_management_system.dto;

import lombok.Data;

@Data
public class FeePaymentRequest {
    private String rollNumber;
    private Double amountPaid;
    private Double tuitionFee;
    private Double sportsFee;
    private Double labFee;
    private Double schoolAccessoriesFee;
    private Double transportFee;
    private Double hostelFee;
    private Double otherCharges;
    private String month;
    private String year;
    private String remarks;
}
