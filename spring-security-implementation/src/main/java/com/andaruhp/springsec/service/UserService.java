package com.andaruhp.springsec.service;

import com.andaruhp.springsec.entity.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    User createUser(User user);
    User createOrUpdateOAuth2User(String provider, String providerId, String email, String name);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
