package app.service;

import app.dto.LoginRequest;
import app.dto.RegisterRequest;
import app.dto.UserInfo;
import app.model.User;
import app.model.UserRole;
import app.repository.UserRepository;
import app.security.CustomUserDetails;
import app.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -------------------------
    // LOGIN
    // -------------------------
    public Map<String, Object> login(LoginRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        String accessToken = jwtService.generateToken(principal);
        String refreshToken = jwtService.generateRefreshToken(principal.getId());

        return Map.of(
                "access_token", accessToken,
                "refresh_token", refreshToken,
                "user", new UserInfo(principal)
        );
    }

    // -------------------------
    // REGISTER
    // -------------------------
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);

        userRepository.save(user);
    }

    // -------------------------
    // REFRESH TOKEN
    // -------------------------
    public Map<String, String> refresh(String refreshToken) {
        if (!jwtService.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        Long userId = jwtService.getUserIdFromRefreshToken(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user.getId());

        return Map.of(
                "access_token", newAccessToken,
                "refresh_token", newRefreshToken
        );
    }
}
