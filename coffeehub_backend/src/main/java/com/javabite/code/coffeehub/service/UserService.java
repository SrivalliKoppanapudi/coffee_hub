package com.javabite.code.coffeehub.service;

import com.javabite.code.coffeehub.dto.req.UserRequestDto;
import com.javabite.code.coffeehub.dto.resp.UserResponseDto;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    List<UserResponseDto> getAllUser();
    public UserResponseDto createUser(UserRequestDto userRequestDto);
    boolean deleteUser(Long id);
}
