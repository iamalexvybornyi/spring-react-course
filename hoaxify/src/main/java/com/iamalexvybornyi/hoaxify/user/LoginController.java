package com.iamalexvybornyi.hoaxify.user;

import com.iamalexvybornyi.hoaxify.error.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;

@RestController
public class LoginController {

    @PostMapping("/api/1.0/login")
    void handleLogin() {

    }

    @ExceptionHandler({AccessDeniedException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    ApiError handleAccessDeniedException() {
        return new ApiError(401, "Access Error", "/api/1.0/login");
    }
}
