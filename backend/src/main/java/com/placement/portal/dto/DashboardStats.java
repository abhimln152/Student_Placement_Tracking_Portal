package com.placement.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private long totalStudents;
    private long totalPlacedStudents;
    private long totalCompanies;
    private long activeJobs;
}
