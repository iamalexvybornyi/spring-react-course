import React from "react";
import Input from '../components/Input';

export class UserSignUpPage extends React.Component {
  state = {
    displayName: "",
    username: "",
    password: "",
    repeatPassword: "",
    pendingApiCall: false,
    errors: {},
    repeatPasswordConfirmed: true
  };

  onChangeDisplayName = (event) => {
    const value = event.target.value;
    const errors = { ...this.state.errors };
    delete errors.displayName;
    this.setState({ displayName: value, errors });
  };

  onChangeUsername = (event) => {
    const value = event.target.value;
    const errors = { ...this.state.errors };
    delete errors.username;
    this.setState({ username: value, errors });
  };

  onChangePassword = (event) => {
    const value = event.target.value;
    const repeatPasswordConfirmed = this.state.repeatPassword === value;
    const errors = { ...this.state.errors };
    delete errors.password;
    errors.repeatPassword = repeatPasswordConfirmed ? '' : 'Does not match password';
    this.setState({ password: value, repeatPasswordConfirmed, errors });
  };

  onChangeRepeatPassword = (event) => {
    const value = event.target.value;
    const repeatPasswordConfirmed = this.state.password === value;
    const errors = { ...this.state.errors };
    errors.repeatPassword = repeatPasswordConfirmed ? '' : 'Does not match password';
    this.setState({ repeatPassword: value, repeatPasswordConfirmed, errors });
  };

  onClickSignUp = () => {
    const user = {
      username: this.state.username,
      displayName: this.state.displayName,
      password: this.state.password,
    };
    this.setState({ pendingApiCall: true });
    this.props.actions.postSignUp(user).then(response => {
      this.setState({ pendingApiCall: false });
    }).catch((apiError) => {
      let errors = {...this.state.errors};
      if (apiError.response.data && apiError.response.data.validationErrors) {
        errors = {...apiError.response.data.validationErrors}
      }
      this.setState({ pendingApiCall: false, errors });
    });
  };

  render() {
    return (
      <div className="container">
        <h1 className="text-center">Sign Up</h1>
        <div className="col-12 mb-3">
          <Input
            label="Display Name"
            placeholder="Your display name"
            value={this.state.displayName}
            onChange={this.onChangeDisplayName}
            hasError={this.state.errors.displayName && true}
            error={this.state.errors.displayName}
          ></Input>
        </div>
        <div className="col-12 mb-3">
        <Input
            label="Username"
            placeholder="Your username"
            value={this.state.username}
            onChange={this.onChangeUsername}
            hasError={this.state.errors.username && true}
            error={this.state.errors.username}
          ></Input>
        </div>
        <div className="col-12 mb-3">
        <Input
            label="Password"
            type="password"
            placeholder="Your password"
            onChange={this.onChangePassword}
            hasError={this.state.errors.password && true}
            error={this.state.errors.password}
          ></Input>
        </div>
        <div className="col-12 mb-3">
        <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            onChange={this.onChangeRepeatPassword}
            hasError={this.state.errors.repeatPassword && true}
            error={this.state.errors.repeatPassword}
          ></Input>
        </div>
        <div className="text-center">
          <button
            className="btn btn-primary"
            onClick={this.onClickSignUp}
            disabled={this.state.pendingApiCall || !this.state.repeatPasswordConfirmed}
          >
            {this.state.pendingApiCall && (
              <div className="spinner-border text-light spinner-border-sm mr-1">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

UserSignUpPage.defaultProps = {
  actions: {
    postSignUp: () =>
      new Promise((resolve, reject) => {
        resolve({});
      }),
  },
};

export default UserSignUpPage;
