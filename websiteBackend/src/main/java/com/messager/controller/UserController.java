package com.messager.controller;

import com.messager.model.User;
import com.messager.repository.UserRepository;
import com.messager.exception.ResourceNotFoundException;
import com.messager.payload.*;
import com.messager.security.CurrentUser;
import com.messager.security.UserPrincipal;
import com.messager.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController
{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserUtils userUtils;


    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser)
    {
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
        return userSummary;
    }

    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username)
    {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email)
    {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @PostMapping("/users/getBySearch")
    public List<User> getUsersBySearch(@RequestParam(value = "username") String username)
    {
        return userRepository.findUsersByUsername(username);
    }

    @GetMapping("/users/getAllUsers")
    public List<String> getAllUsers()
    {
        return userRepository.findAllUsers();
    }

    @GetMapping("/users/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username)
    {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt());
        userUtils.initUserAvatar(userProfile, user);
        return userProfile;
    }
}
