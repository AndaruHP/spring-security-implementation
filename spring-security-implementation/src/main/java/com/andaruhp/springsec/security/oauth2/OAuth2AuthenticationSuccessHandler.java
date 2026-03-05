package com.andaruhp.springsec.security.oauth2;

import com.andaruhp.springsec.entity.User;
import com.andaruhp.springsec.security.jwt.JwtTokenProvider;
import com.andaruhp.springsec.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String provider = oauthToken.getAuthorizedClientRegistrationId();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        if (provider.equals("github")) {
            providerId = oAuth2User.getAttribute("id").toString();
            if (email == null) {
                email = oAuth2User.getAttribute("login") + "@github.com";
            }
        }

        log.info("OAuth2 login success for provider: {}, email: {}", provider, email);

        User user = userService.createOrUpdateOAuth2User(provider.toUpperCase(), providerId, email, name);

        String token = jwtTokenProvider.generateToken(user.getUsername());

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:4200/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        clearAuthenticationAttributes(request);
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
