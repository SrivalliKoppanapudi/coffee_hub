package com.javabite.code.coffeehub.repo;

import com.javabite.code.coffeehub.entity.UserEnitiy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserEnitiy,Long> {

    public Optional<UserEnitiy> findByEmail(String email);

    public Optional<UserEnitiy> findByVerificationToken(String token);

}
