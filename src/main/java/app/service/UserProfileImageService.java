package app.service;

import net.coobird.thumbnailator.Thumbnails;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import app.model.User;
import app.model.UserProfileImage;
import app.repository.UserProfileImageRepository;

@Service
public class UserProfileImageService {

    @Autowired
    private UserProfileImageRepository repository;

    public UserProfileImage saveCompressedImage(User user, MultipartFile file) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // Compress and resize
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(originalImage)
                  .size(120, 120)       
                  .outputQuality(0.8)   
                  .outputFormat("jpg")
                  .toOutputStream(baos);

        UserProfileImage profileImage = new UserProfileImage();
        profileImage.setUser(user);
        profileImage.setImageData(baos.toByteArray());

        return repository.save(profileImage);
    }
}
