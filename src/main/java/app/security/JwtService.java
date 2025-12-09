package app.security;

import app.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

/**
 * Service for handling JWT (JSON Web Token) operations including generation, validation,
 * and extraction of claims from JWT tokens.
 */
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration:86400000}") // default 24h
    private long expirationMs;

    /**
     * Generates a JWT token for the given user entity.
     * @param user The authenticated user
     * @return A signed JWT token
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("email", user.getEmail());   // optional, for convenience
        claims.put("name", user.getName());     // optional, for display

        return createToken(claims, String.valueOf(user.getId())); // sub = user ID
    }

    public String generateToken(CustomUserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList());
        claims.put("email", userDetails.getEmail()); // unique
        claims.put("name", userDetails.getName());   // not unique

        return createToken(claims, String.valueOf(userDetails.getId())); // sub = user ID
    }


    private String createToken(Map<String, Object> claims, String subject) {
        String id = UUID.randomUUID().toString();

        return Jwts.builder()
                .setClaims(claims)
                .setId(id)
                .setSubject(subject) // sub = user ID
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validates if the given token is valid for the specified user ID.
     */
    public Boolean validateToken(String token, Long userId) {
        final String tokenSub = extractSubject(token);
        return (tokenSub.equals(String.valueOf(userId)) && !isTokenExpired(token));
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject); // returns user ID as string
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
