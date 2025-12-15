package com.mahdiyounes.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {
    private long totalClients;
    private long totalComptes;
    private long comptesOuverts;
    private long comptesBloqués;
    private long comptesClotures;
}