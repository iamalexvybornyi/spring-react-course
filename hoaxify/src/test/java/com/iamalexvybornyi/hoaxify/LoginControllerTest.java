package com.iamalexvybornyi.hoaxify;

import com.iamalexvybornyi.hoaxify.error.ApiError;
import com.iamalexvybornyi.hoaxify.user.User;
import com.iamalexvybornyi.hoaxify.user.UserRepository;
import com.iamalexvybornyi.hoaxify.user.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class LoginControllerTest {

    private static final String API_1_0_LOGIN = "/api/1.0/login";

    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Before
    public void cleanUp() {
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    @Test
    public void postLogin_withoutUserCredentials_receiveUnauthorized() {
        ResponseEntity<Object> responseEntity = login(Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void postLogin_withIncorrectCredentials_receiveUnauthorized() {
        authenticate();
        ResponseEntity<Object> responseEntity = login(Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void postLogin_withoutUserCredentials_receiveApiError() {
        ResponseEntity<ApiError> responseEntity = login(ApiError.class);
        assertThat(responseEntity.getBody().getUrl()).isEqualTo(API_1_0_LOGIN);
    }

    @Test
    public void postLogin_withoutUserCredentials_receiveApiErrorWithoutValidationErrors() {
        ResponseEntity<String> responseEntity = login(String.class);
        assertThat(responseEntity.getBody().contains("validationErrors")).isFalse();
    }

    @Test
    public void postLogin_withIncorrectCredentials_receiveUnauthorizedWithoutWWWAuthenticationHeader() {
        authenticate();
        ResponseEntity<Object> responseEntity = login(Object.class);
        assertThat(responseEntity.getHeaders().containsKey("WWW-Authenticate")).isFalse();
    }

    @Test
    public void postLogin_withValidCredentials_receiveOk() {
        userService.save(TestUtil.createValidUser());
        authenticate();
        ResponseEntity<Object> responseEntity = login(Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postLogin_withValidCredentials_receiveLoggedInUserId() {
        User inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        ResponseEntity<Map<String, Object>> responseEntity = login(new ParameterizedTypeReference<Map<String, Object>>() {});
        Map<String, Object> body = responseEntity.getBody();
        Integer id = (Integer) body.get("id");
        assertThat(id).isEqualTo(inDB.getId());
    }

    @Test
    public void postLogin_withValidCredentials_receiveLoggedInUsersImage() {
        User inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        ResponseEntity<Map<String, Object>> responseEntity = login(new ParameterizedTypeReference<Map<String, Object>>() {});
        Map<String, Object> body = responseEntity.getBody();
        String image = (String) body.get("image");
        assertThat(image).isEqualTo(inDB.getImage());
    }

    @Test
    public void postLogin_withValidCredentials_receiveLoggedInUsersDisplayName() {
        User inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        ResponseEntity<Map<String, Object>> responseEntity = login(new ParameterizedTypeReference<Map<String, Object>>() {});
        Map<String, Object> body = responseEntity.getBody();
        String displayName = (String) body.get("displayName");
        assertThat(displayName).isEqualTo(inDB.getDisplayName());
    }

    @Test
    public void postLogin_withValidCredentials_receiveLoggedInUsersUsername() {
        User inDB = userService.save(TestUtil.createValidUser());
        authenticate();
        ResponseEntity<Map<String, Object>> responseEntity = login(new ParameterizedTypeReference<Map<String, Object>>() {});
        Map<String, Object> body = responseEntity.getBody();
        String username = (String) body.get("username");
        assertThat(username).isEqualTo(inDB.getUsername());
    }

    @Test
    public void postLogin_withValidCredentials_notReceiveLoggedInUsersPassword() {
        userService.save(TestUtil.createValidUser());
        authenticate();
        ResponseEntity<Map<String, Object>> responseEntity = login(new ParameterizedTypeReference<Map<String, Object>>() {});
        Map<String, Object> body = responseEntity.getBody();
        assertThat(body.containsKey("password")).isFalse();
    }

    private void authenticate() {
        testRestTemplate.getRestTemplate().getInterceptors()
                .add(new BasicAuthenticationInterceptor("test-username", "P4ssword"));
    }

    public <T> ResponseEntity<T> login(Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_LOGIN, null, responseType);
    }

    public <T> ResponseEntity<T> login(ParameterizedTypeReference<T> responseType) {
        return testRestTemplate.exchange(API_1_0_LOGIN, HttpMethod.POST, null, responseType);
    }
}
