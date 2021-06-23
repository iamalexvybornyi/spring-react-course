package com.iamalexvybornyi.hoaxify.user;

import com.fasterxml.jackson.annotation.JsonView;
import com.iamalexvybornyi.hoaxify.error.ApiError;
import com.iamalexvybornyi.hoaxify.shared.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @PostMapping("/api/1.0/login")
    @JsonView(Views.Base.class)
    User handleLogin(@CurrentUser User loggedInUser) {
        return loggedInUser;
    }

    @ExceptionHandler({AccessDeniedException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    ApiError handleAccessDeniedException() {
        return new ApiError(401, "Access Error", "/api/1.0/login");
    }
}
