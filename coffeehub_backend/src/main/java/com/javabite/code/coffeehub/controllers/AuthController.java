package com.javabite.code.coffeehub.controllers;

import com.javabite.code.coffeehub.Auth.JwtHelper;
import com.javabite.code.coffeehub.config.AuthConfig;
import com.javabite.code.coffeehub.dto.req.JwtRequest;
import com.javabite.code.coffeehub.dto.req.UserRequestDto;
import com.javabite.code.coffeehub.dto.resp.ErrorResponseDto;
import com.javabite.code.coffeehub.dto.resp.JwtResponse;
import com.javabite.code.coffeehub.dto.resp.UserResponseDto;
import com.javabite.code.coffeehub.exp.UserAlreadyExistsException;
import com.javabite.code.coffeehub.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthConfig authConfig;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private AuthenticationManager manager;
    @Autowired
    private JwtHelper helper;


    @Autowired
    private UserService userService;


    // @PostMapping("/create")
    // public ResponseEntity<?> createUser(@RequestBody UserRequestDto userRequestDto) {
    //     try {
    //         UserResponseDto userResponseDto = userService.createUser(userRequestDto);
    //         UserDetails userDetails = userDetailsService.loadUserByUsername(userResponseDto.getEmail());
    //         System.out.println("from db info");
    //         System.out.println(userDetails.getUsername());
    //         System.out.println(userDetails.getPassword());

    //         String token = this.helper.generateToken(userDetails);
    //         JwtResponse jwtResponse = JwtResponse.builder().token(token).build();
    //         return new ResponseEntity<>(jwtResponse, HttpStatus.CREATED);
    //     } catch (UserAlreadyExistsException ex) {
    //         // Handle the exception and return an appropriate response
    //         return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponseDto("User already exists: " + ex.getMessage()));
    //     }
    // }



@GetMapping("/me")
public ResponseEntity<?> me() {

    var authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null ||
        !authentication.isAuthenticated() ||
        authentication.getPrincipal().equals("anonymousUser")) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Not authenticated");
    }

    UserDetails userDetails = (UserDetails) authentication.getPrincipal();

    Map<String, Object> response = Map.of(
            "email", userDetails.getUsername(),
            "roles", userDetails.getAuthorities()
    );

    return ResponseEntity.ok(response);
}


    @PostMapping("/create")
public ResponseEntity<?> createUser(@RequestBody UserRequestDto userRequestDto,
                                    HttpServletResponse response) {

    try {
        // 1. Create user
        UserResponseDto userResponseDto = userService.createUser(userRequestDto);

        // 2. Load user details
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(userResponseDto.getEmail());

        // 3. Generate tokens
        String accessToken = helper.generateAccessToken(userDetails);
        String refreshToken = helper.generateRefreshToken(userDetails);

        // 4. Store Access Token in HttpOnly cookie
        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false); // true in production (HTTPS)
        accessCookie.setPath("/");
        accessCookie.setMaxAge(15 * 60); // 15 minutes

        // 5. Store Refresh Token in HttpOnly cookie
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/auth/refresh");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        // 6. Return success (NO TOKEN IN BODY)
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered and logged in successfully");

    } catch (UserAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponseDto("User already exists"));
    }
}


    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody JwtRequest jwtRequest) {
    //     try {
    //         this.doAuthenticate(jwtRequest.getEmail(), jwtRequest.getPassword());

    //         UserDetails userDetails = userDetailsService.loadUserByUsername(jwtRequest.getEmail());
    //         String token = this.helper.generateToken(userDetails);


    //         String username = userDetails.getUsername();
    //         String role = userDetails.getAuthorities().iterator().next().getAuthority();

    //         JwtResponse jwtResponse = JwtResponse.builder()
    //                 .token(token)
    //                 .username(username)
    //                 .email(jwtRequest.getEmail())
    //                 .role(role)
    //                 .build();

    //         return ResponseEntity.ok(jwtResponse);
    //     } catch (BadCredentialsException e) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    //                 .body(Map.of("error", "Invalid email or password")); // ✅ plain JSON error
    //     }
    // }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody JwtRequest request,
                               HttpServletResponse response) {

    manager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(), request.getPassword()
        )
    );

    UserDetails userDetails =
            userDetailsService.loadUserByUsername(request.getEmail());

    String accessToken = helper.generateAccessToken(userDetails);
    String refreshToken = helper.generateRefreshToken(userDetails);

    Cookie accessCookie = new Cookie("accessToken", accessToken);
    accessCookie.setHttpOnly(true);
    accessCookie.setSecure(false); // true in production
    accessCookie.setPath("/");
    accessCookie.setMaxAge(15 * 60);

    Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
    refreshCookie.setHttpOnly(true);
    refreshCookie.setSecure(false);
    refreshCookie.setPath("/auth/refresh");
    refreshCookie.setMaxAge(7 * 24 * 60 * 60);

    response.addCookie(accessCookie);
    response.addCookie(refreshCookie);

    return ResponseEntity.ok("Login successful");
}

@PostMapping("/refresh")
public ResponseEntity<?> refreshToken(HttpServletRequest request,
                                      HttpServletResponse response) {

    String refreshToken = null;
    for (Cookie cookie : request.getCookies()) {
        if ("refreshToken".equals(cookie.getName())) {
            refreshToken = cookie.getValue();
        }
    }

    if (refreshToken == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String username = helper.getUsernameFromToken(refreshToken);
    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

    String newAccessToken = helper.generateAccessToken(userDetails);

    Cookie newAccessCookie = new Cookie("accessToken", newAccessToken);
    newAccessCookie.setHttpOnly(true);
    newAccessCookie.setSecure(false);
    newAccessCookie.setPath("/");
    newAccessCookie.setMaxAge(15 * 60);

    response.addCookie(newAccessCookie);

    return ResponseEntity.ok("Token refreshed");
}


@PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletResponse response) {

    Cookie access = new Cookie("accessToken", null);
    access.setHttpOnly(true);
    access.setPath("/");
    access.setMaxAge(0);

    Cookie refresh = new Cookie("refreshToken", null);
    refresh.setHttpOnly(true);
    refresh.setPath("/auth/refresh");
    refresh.setMaxAge(0);

    response.addCookie(access);
    response.addCookie(refresh);

    return ResponseEntity.ok("Logged out");
}





    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler(BadCredentialsException ex) {
        return "Credentials Invalid !!";
    }
}
