package app.controller;

import app.dto.UpdatePasswordRequest;
import app.dto.UpdateUserRequest;
import app.dto.UserInfo;
import app.dto.UserProfileImageDto;
import app.model.User;
import app.model.UserProfileImage;
import app.security.CustomUserDetails;
import app.service.UserService;
import io.jsonwebtoken.io.IOException;
import app.service.UserProfileImageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final UserProfileImageService userProfileImageService;

    public UserController(UserService userService,
            UserProfileImageService userProfileImageService) {
        this.userService = userService;
        this.userProfileImageService = userProfileImageService;
    }

    // Get current authenticated user
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user")
    public ResponseEntity<UserInfo> currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).build();
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails user) {
            return ResponseEntity.ok(new UserInfo(user));
        }

        return ResponseEntity.status(500).body(null);
    }

    // Update profile (name, email, etc.)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/user/profile")
    public ResponseEntity<UserInfo> updateProfile(@Valid @RequestBody UpdateUserRequest updateRequest) {
        try {
            CustomUserDetails currentUser = userService.getCurrentUser();
            User updatedUser = userService.updateUser(currentUser.getId(), updateRequest);
            return ResponseEntity.ok(new UserInfo(updatedUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // Update password (requires current password check)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/user/password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest passwordRequest) {
        try {
            CustomUserDetails currentUser = userService.getCurrentUser();
            userService.updatePassword(currentUser.getId(), passwordRequest);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating password");
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/user/profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty() || !file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            CustomUserDetails currentUser = userService.getCurrentUser();
            UserProfileImage saved = userProfileImageService.saveCompressedImage(currentUser.getUser(), file);

            // Return DTO instead of raw string
            return ResponseEntity.ok(new UserProfileImageDto(saved.getImageData()));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Invalid image file");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload profile image");
        }
    }
}
