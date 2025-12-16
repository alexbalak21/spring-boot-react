package app.repository;

import app.model.UserProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileImageRepository extends JpaRepository<UserProfileImage, Long> {
    Optional<UserProfileImage> findByUserId(Long userId);
}
