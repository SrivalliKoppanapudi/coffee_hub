package com.javabite.code.coffeehub.service.imp;

import com.javabite.code.coffeehub.config.AuthConfig;
import com.javabite.code.coffeehub.dto.req.UserRequestDto;
import com.javabite.code.coffeehub.dto.resp.UserResponseDto;
import com.javabite.code.coffeehub.entity.Customer;
import com.javabite.code.coffeehub.entity.Role;
import com.javabite.code.coffeehub.entity.UserEnitiy;
import com.javabite.code.coffeehub.exp.UserAlreadyExistsException;
import com.javabite.code.coffeehub.repo.CustomerRepository;
import com.javabite.code.coffeehub.repo.UserRepo;
import com.javabite.code.coffeehub.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.javabite.code.coffeehub.service.EmailService;
import org.springframework.security.authentication.DisabledException;
import java.util.UUID;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserImp implements UserService {

    @Autowired
    private CustomerRepository customerRepository;

   

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AuthConfig authConfig;


    @Autowired
    private EmailService emailService;

   


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEnitiy user = userRepo.findByEmail(username).orElseThrow(()->new RuntimeException("User not found"));
         if (!user.isVerified()) {
    throw new DisabledException("Email not verified");
}
        System.out.println("Retrived Data");
        System.out.println(user.getPassword()+"Retrived Password");
        System.out.println(user.getUsername());
        System.out.println(user.getId());
        System.out.println(user.getEmail());
        System.out.println("-----");
        // Attach role as GrantedAuthority
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    @Override
    public List<UserResponseDto> getAllUser() {
        List<UserEnitiy> userEnitiys = userRepo.findAll();
        List<UserResponseDto> userResponseDtoList = userEnitiys.stream().map(user->this.userEntityToUserRespDto(user)).collect(Collectors.toList());
        return userResponseDtoList;


    }
    @Override
    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        Optional<UserEnitiy> foundUser = this.userRepo.findByEmail(userRequestDto.getEmail());
        if (foundUser.isEmpty()) {
            
            UserEnitiy user = this.userReqDtoToUserEntity(userRequestDto);
            user.setPassword(authConfig.passwordEncoder().encode(user.getPassword()));
            user.setVerified(false);

     String token = UUID.randomUUID().toString();
     user.setVerificationToken(token);

            UserEnitiy createdUser = userRepo.save(user);
            // If CUSTOMER, also save into customers table
            if ("CUSTOMER".equalsIgnoreCase(createdUser.getRole().name())) {
                Customer customer = new Customer();
                customer.setUsername(createdUser.getUsername());
                customer.setEmail(createdUser.getEmail());
                customer.setUser(createdUser);         // link UserEnitiy

                customerRepository.save(customer);
            }
            emailService.sendVerificationEmail(user.getEmail(), token);

            return this.userEntityToUserRespDto(createdUser);
        } else {
            // User already exists, throw an exception
            throw new UserAlreadyExistsException("User with email " + userRequestDto.getEmail() + " already exists");
        }
    }


@Override
public boolean verifyMail(String token){
     UserEnitiy user = userRepo.findByVerificationToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid verification token"));

    user.setVerified(true);
    user.setVerificationToken(null);
    userRepo.save(user);

    return true;//response entity belongs to controller layer
    //service layer msut return data,entity,boolean
}

    public UserEnitiy userReqDtoToUserEntity(UserRequestDto userReqDto) {
        UserEnitiy user = new UserEnitiy();
        user.setUsername(userReqDto.getUsername());
        user.setEmail(userReqDto.getEmail());
        user.setPassword(userReqDto.getPassword());

        // ✅ Convert String → Enum safely
        try {
            user.setRole(Role.valueOf(userReqDto.getRole().toUpperCase()));
        } catch (IllegalArgumentException | NullPointerException e) {
            user.setRole(Role.CUSTOMER); // default fallback
        }

        return user;
    }

    public UserResponseDto userEntityToUserRespDto(UserEnitiy user){
        UserResponseDto userRespDto = this.modelMapper.map(user,UserResponseDto.class);
        return userRespDto;
    }

    @Override
    public boolean deleteUser(Long id) {
        return userRepo.findById(id)
                .map(user -> {
                    userRepo.delete(user);
                    return true;
                })
                .orElse(false);
    }
}
