package com.vault.backend.service;

import com.vault.backend.dto.CategoryRequest;
import com.vault.backend.dto.CategoryResponse;
import com.vault.backend.entity.Category;
import com.vault.backend.entity.User;
import com.vault.backend.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllByUser(User user) {
        return categoryRepository.findByUserIdOrderByNameAsc(user.getId())
                .stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName()))
                .toList();
    }

    public CategoryResponse create(User user, CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setUser(user);
        Category saved = categoryRepository.save(category);
        return new CategoryResponse(saved.getId(), saved.getName());
    }

    public CategoryResponse update(User user, Long id, CategoryRequest request) {
        Category category = getCategoryOwnedBy(user, id);
        category.setName(request.getName());
        Category saved = categoryRepository.save(category);
        return new CategoryResponse(saved.getId(), saved.getName());
    }

    public void delete(User user, Long id) {
        Category category = getCategoryOwnedBy(user, id);
        categoryRepository.delete(category);
    }

    private Category getCategoryOwnedBy(User user, Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria non trovata"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Non hai i permessi per questa categoria");
        }
        return category;
    }
}