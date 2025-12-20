package app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import app.service.CustomUserDetailsService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Skip JWT validation for refresh token endpoint
        if ("/api/auth/refresh-token".equals(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            final String subject = jwtService.extractSubject(jwt);

            if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Long userId = Long.parseLong(subject);
                UserDetails userDetails = userDetailsService.loadUserById(userId);

                if (jwtService.validateToken(jwt, userId)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warn("JWT validation failed for user ID {}", userId);
                }
            }

            filterChain.doFilter(request, response);

        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            logger.warn("Access token expired");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setHeader("X-Token-Expired", "true");
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"access_token_expired\"}");
        } catch (Exception e) {
            logger.error("JWT authentication failed", e);
            filterChain.doFilter(request, response);
        }
    }
}
