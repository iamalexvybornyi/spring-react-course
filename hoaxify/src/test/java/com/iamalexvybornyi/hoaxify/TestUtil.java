package com.iamalexvybornyi.hoaxify;

import com.iamalexvybornyi.hoaxify.user.User;

public class TestUtil {

    public static User createValidUser() {
        User user = new User();
        user.setUsername("test-username");
        user.setDisplayName("test-user-display-name");
        user.setPassword("P4ssword");
        return user;
    }
}
