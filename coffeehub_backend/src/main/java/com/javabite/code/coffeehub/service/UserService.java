package com.javabite.code.coffeehub.service;

import com.javabite.code.coffeehub.dto.req.UserRequestDto;
import com.javabite.code.coffeehub.dto.resp.UserResponseDto;
import com.javabite.code.coffeehub.entity.UserEnitiy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;   
import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;


public interface UserService extends UserDetailsService {

    List<UserResponseDto> getAllUser();
    public UserResponseDto createUser(UserRequestDto userRequestDto);
    boolean deleteUser(Long id);
    UserEnitiy userReqDtoToUserEntity(UserRequestDto userReqDto);
    boolean verifyMail(String token);
   
  
    }
