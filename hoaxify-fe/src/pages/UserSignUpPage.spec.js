import React from "react";
import {
  render,
  fireEvent,
  waitForDomChange,
  waitForElement
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserSignUpPage } from "./UserSignUpPage";

describe("User Sign Up Page", () => {
  describe("Layout", () => {
    it("has header of Sign Up", () => {
      const { container } = render(<UserSignUpPage />);
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Sign Up");
    });

    it("has input for display name", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");
      expect(displayNameInput).toBeInTheDocument();
    });

    it("has input for username", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      expect(usernameInput).toBeInTheDocument();
    });

    it("has input for password", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput.type).toBe("password");
    });

    it("has input for password repeat", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordRepeatInput = queryByPlaceholderText(
        "Repeat your password"
      );
      expect(passwordRepeatInput).toBeInTheDocument();
    });

    it("has password type for password repeat", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordRepeatInput = queryByPlaceholderText(
        "Repeat your password"
      );
      expect(passwordRepeatInput.type).toBe("password");
    });

    it("has submit button", () => {
      const { container } = render(<UserSignUpPage />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    const changeEvent = (content) => {
      return {
        target: {
          value: content,
        },
      };
    };

    let button,
      displayNameInput,
      usernameInput,
      passwordInput,
      passwordRepeatInput;

    const setupForSubmit = (props) => {
      const rendered = render(<UserSignUpPage {...props} />);

      const { container, queryByPlaceholderText } = rendered;

      displayNameInput = queryByPlaceholderText("Your display name");
      usernameInput = queryByPlaceholderText("Your username");
      passwordInput = queryByPlaceholderText("Your password");
      passwordRepeatInput = queryByPlaceholderText("Repeat your password");

      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      fireEvent.change(usernameInput, changeEvent("my-username"));
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      fireEvent.change(passwordRepeatInput, changeEvent("P4ssword"));

      button = container.querySelector("button");

      return rendered;
    };

    const mockAsyncDelayed = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    };

    it("set the display name value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");
      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      expect(displayNameInput).toHaveValue("my-display-name");
    });

    it("set the username value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("my-username"));
      expect(usernameInput).toHaveValue("my-username");
    });

    it("set the password value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      expect(passwordInput).toHaveValue("P4ssword");
    });

    it("set the repeat password value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordRepeatInput = queryByPlaceholderText(
        "Repeat your password"
      );
      fireEvent.change(passwordRepeatInput, changeEvent("P4ssword"));
      expect(passwordRepeatInput).toHaveValue("P4ssword");
    });

    it("calls postSignUp when the fields are valid and the actions are provided in props", () => {
      const actions = {
        postSignUp: jest.fn().mockResolvedValueOnce({}),
      };

      setupForSubmit({ actions });
      fireEvent.click(button);
      expect(actions.postSignUp).toHaveBeenCalledTimes(1);
    });

    it("does not throw exceptions when clicking the button when the actions are not provided in props", () => {
      setupForSubmit();
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("calls post with user body when the fields are valid", () => {
      const actions = {
        postSignUp: jest.fn().mockResolvedValueOnce({}),
      };

      setupForSubmit({ actions });
      fireEvent.click(button);
      const expectedUserObject = {
        username: "my-username",
        displayName: "my-display-name",
        password: "P4ssword",
      };
      expect(actions.postSignUp).toHaveBeenCalledWith(expectedUserObject);
    });

    it("does not allow the user to click the Sign Up button when there is an ongoing api call", () => {
      const actions = {
        postSignUp: mockAsyncDelayed(),
      };

      setupForSubmit({ actions });
      fireEvent.click(button);
      fireEvent.click(button);
      expect(actions.postSignUp).toHaveBeenCalledTimes(1);
    });

    it("displays the spinner when there is an ongoing api call", () => {
      const actions = {
        postSignUp: mockAsyncDelayed(),
      };

      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });

    it("hides the spinner api call finishes successfully", async () => {
      const actions = {
        postSignUp: mockAsyncDelayed(),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      await waitForDomChange();

      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });

    it("hides the spinner api call finishes with error", async () => {
      const actions = {
        postSignUp: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject({
                response: {data: {}}
              });
            }, 300);
          });
        }),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      await waitForDomChange();

      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });

    it('displays validation error for displayName when error is received for the field', async() => {
      const actions = {
        postSignUp: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: 'Cannot be null'
              }
            }
          }
        })
      }

      const { queryByText } = setupForSubmit({actions});
      fireEvent.click(button);

      const errorMessage = await waitForElement(() => queryByText('Cannot be null'));
      expect(errorMessage).toBeInTheDocument();
    });

    it('enables the signup button when password and repeat password have same value', () => {
      setupForSubmit();
      expect(button).not.toBeDisabled();
    });

    it('disables the signup button when repeat password does not match password value', () => {
      setupForSubmit();
      fireEvent.change(passwordRepeatInput, changeEvent('new-pass'));
      expect(button).toBeDisabled();
    });

    it('disables the signup button when password does not match repeat password value', () => {
      setupForSubmit();
      fireEvent.change(passwordInput, changeEvent('new-pass'));
      expect(button).toBeDisabled();
    });

    it('displays error style for password repeat input when repeat password mismatch', () => {
      const { queryByText } = setupForSubmit();
      fireEvent.change(passwordRepeatInput, changeEvent('new-pass'));
      const mismatchWarning = queryByText("Does not match password");
      expect(mismatchWarning).toBeInTheDocument();
    });

    it('displays error style for password repeat input when password input mismatch', () => {
      const { queryByText } = setupForSubmit();
      fireEvent.change(passwordInput, changeEvent('new-pass'));
      const mismatchWarning = queryByText("Does not match password");
      expect(mismatchWarning).toBeInTheDocument();
    });

    it('hides the validation error when user changes the content of displayName', async() => {
      const actions = {
        postSignUp: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: 'Cannot be null'
              }
            }
          }
        })
      }

      const { queryByText } = setupForSubmit({actions});
      fireEvent.click(button);

      await waitForElement(() => queryByText('Cannot be null'));
      fireEvent.change(displayNameInput, changeEvent('name updated'));

      const errorMessage = queryByText('Cannot be null');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('hides the validation error when user changes the content of username', async() => {
      const actions = {
        postSignUp: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                username: 'Username cannot be null'
              }
            }
          }
        })
      }

      const { queryByText } = setupForSubmit({actions});
      fireEvent.click(button);

      await waitForElement(() => queryByText('Username cannot be null'));
      fireEvent.change(usernameInput, changeEvent('name updated'));

      const errorMessage = queryByText('Username cannot be null');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('hides the validation error when user changes the content of password', async() => {
      const actions = {
        postSignUp: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                password: 'Cannot be null'
              }
            }
          }
        })
      }

      const { queryByText } = setupForSubmit({actions});
      fireEvent.click(button);

      await waitForElement(() => queryByText('Cannot be null'));
      fireEvent.change(passwordInput, changeEvent('password-updated'));

      const errorMessage = queryByText('Cannot be null');
      expect(errorMessage).not.toBeInTheDocument();
    });

  });
});

console.error = () => {};
