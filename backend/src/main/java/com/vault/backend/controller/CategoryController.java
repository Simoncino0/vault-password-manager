package com.vault.backend.controller;

import com.vault.backend.dto.CategoryRequest;
import com.vault.backend.dto.CategoryResponse;
import com.vault.backend.entity.User;
import com.vault.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.getAllByUser(user));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@AuthenticationPrincipal User user,
                                                   @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(@AuthenticationPrincipal User user,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable Long id) {
        categoryService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}