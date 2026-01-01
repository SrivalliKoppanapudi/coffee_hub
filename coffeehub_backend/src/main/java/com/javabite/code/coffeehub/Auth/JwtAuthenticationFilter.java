package com.javabite.code.coffeehub.Auth;


import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import jakarta.servlet.http.Cookie;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private Logger logger = LoggerFactory.getLogger(OncePerRequestFilter.class);
    @Autowired
    private JwtHelper jwtHelper;


    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

//        try {
//            Thread.sleep(500);
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }
        //Authorization

        String requestHeader = request.getHeader("Authorization");
        logger.info(requestHeader);
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
    filterChain.doFilter(request, response);
    return;
}

//         String token = null;



// //        logger.info(" Header :  {}", request);
//         String username = null;
// //        String token = null;
//         if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
//             token = requestHeader.substring(7);
//             logger.info("Extracted JWT Token: {}", token);
//             try {
//                 username = this.jwtHelper.getUsernameFromToken(token);
//                 logger.info("Extracted Username (email) from Token: {}", username);
//             } catch (ExpiredJwtException e) {
//                 logger.warn("JWT expired", e);
//             } catch (MalformedJwtException e) {
//                 logger.warn("Invalid JWT", e);
//             } catch (Exception e) {
//                 logger.error("JWT parsing error", e);
//             }
//         } else {
//             logger.warn("Authorization header missing or invalid. Found: {}", requestHeader);
//         }


//         //
//         if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {


//             //fetch user detail from username
//             UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
//             // 👇 Add this line to see what roles/authorities Spring thinks the user has
//             logger.info("User Authorities: {}", userDetails.getAuthorities());
//             Boolean validateToken = this.jwtHelper.validateToken(token, userDetails);
//             logger.info("Token validation result: {}", validateToken);
//             if (validateToken) {

//                 //set the authentication
//                 UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                 authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                 SecurityContextHolder.getContext().setAuthentication(authentication);


//             } else {
//                 logger.info("Validation fails !!");
//             }


//         }
//         logger.info("Authentication set in context: {}", SecurityContextHolder.getContext().getAuthentication());

//         filterChain.doFilter(request, response); //doubt hai
String token = null;

if (request.getCookies() != null) {
    for (Cookie cookie : request.getCookies()) {
        if ("accessToken".equals(cookie.getName())) {
            token = cookie.getValue();
        }
    }
}

if (token != null) {
    String username = jwtHelper.getUsernameFromToken(token);
    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

    if (jwtHelper.isTokenValid(token, userDetails)) {
        UsernamePasswordAuthenticationToken auth =
            new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            );
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}

filterChain.doFilter(request, response);



    }
}
