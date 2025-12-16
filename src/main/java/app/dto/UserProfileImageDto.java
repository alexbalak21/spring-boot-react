package app.dto;

import java.util.Base64;

public class UserProfileImageDto {
    private String imageData;

    public UserProfileImageDto(byte[] imageData) {
        this.imageData = Base64.getEncoder().encodeToString(imageData);
    }

    public String getImageData() {
        return imageData;
    }
}
