// src/main/java/com/javabite/code/coffeehub/dto/req/MenuItemRequest.java
package com.javabite.code.coffeehub.dto.req;

public class MenuItemRequest {
    private String name;
    private Long categoryId;
    private int priceCents;

    // getters & setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public int getPriceCents() { return priceCents; }
    public void setPriceCents(int priceCents) { this.priceCents = priceCents; }
}
