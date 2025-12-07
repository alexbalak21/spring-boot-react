package app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
public class CsrfConfig {

    @Bean
    public CookieCsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository tokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        tokenRepository.setCookieCustomizer(cookie -> cookie
            .httpOnly(false)
            .secure(false)   // set true in production with HTTPS
            .sameSite("Lax")
            .path("/")
        );
        return tokenRepository;
    }

    @Bean
    public CsrfTokenRequestAttributeHandler csrfTokenRequestHandler() {
        CsrfTokenRequestAttributeHandler handler = new CsrfTokenRequestAttributeHandler();
        handler.setCsrfRequestAttributeName("_csrf");
        return handler;
    }

    @Bean
    public RequestMatcher csrfIgnoreMatcher() {
        return request ->
            "POST".equalsIgnoreCase(request.getMethod()) &&
            "/api/csrf".equals(request.getRequestURI());
    }
}
