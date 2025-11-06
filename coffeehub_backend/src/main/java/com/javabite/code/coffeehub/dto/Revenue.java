package com.javabite.code.coffeehub.dto;


public class Revenue {
    private String period;
    private Double revenue;

    public Revenue(String period, Double revenue) {
        this.period = period;
        this.revenue = revenue;
    }

    // getters & setters
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }
}
