package com.javabite.code.coffeehub.dto.resp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDto {
    private String username;
    private String email;
//    private String password;
    private String role;
    private long  id;
}
