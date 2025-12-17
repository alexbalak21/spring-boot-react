package app.dto;

import app.security.CustomUserDetails;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class UserInfo {
    private Long id;
    private String name;
    private String email;
    private List<String> roles;
    private String createdAt;
    private String updatedAt;

    // Construct from your CustomUserDetails
    public UserInfo(CustomUserDetails user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getUsername();
        this.roles = user.getRoles();
        this.createdAt = user.getCreatedAt() != null ? user.getCreatedAt().toString() : null;
        this.updatedAt = user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null;
    }

    // Construct from Spring’s default User
    public UserInfo(User springUser) {
        this.id = null; // Spring’s User doesn’t carry an id
        this.name = null; // no name field
        this.email = springUser.getUsername();
        this.roles = springUser.getAuthorities().stream()
                               .map(GrantedAuthority::getAuthority)
                               .collect(Collectors.toList());
        this.createdAt = null;
        this.updatedAt = null;
    }
    
    // Construct from app.model.User entity
    public UserInfo(app.model.User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.roles = user.getRole() != null ? List.of(user.getRole().name()) : List.of();
        this.createdAt = user.getCreatedAt() != null ? user.getCreatedAt().toString() : null;
        this.updatedAt = user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null;
    }

    // getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public List<String> getRoles() { return roles; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }
}
