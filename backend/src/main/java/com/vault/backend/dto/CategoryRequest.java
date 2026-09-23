package com.vault.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank(message = "Il nome è obbligatorio")
    @Size(max = 50, message = "Il nome deve avere al massimo 50 caratteri")
    private String name;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}