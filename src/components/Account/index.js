import React, { Component } from "react";
// Components
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null,
  },
  {
    id: "google.com",
    provider: "googleProvider",
  },
  {
    id: "facebook.com",
    provider: "facebookProvider",
  },
  {
    id: "twitter.com",
    provider: "twitterProvider",
  },
];

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <>
        <h1>Account: {authUser.email} </h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
        <LoginManagement authUser={authUser} />
      </>
    )}
  </AuthUserContext.Consumer>
);

class LoginManagementBase extends Component {
  constructor() {
    super();

    this.state = {
      activeSignInMethods: [],
      error: null,
      isDisable: false,
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then((activeSignInMethods) =>
        this.setState({ activeSignInMethods, error: null, isDisable: false })
      )
      .catch((error) => this.setState({ error, isDisable: false }));
  };

  onSocialLoginLink = (provider) => {
    this.setState({ isDisable: true });

    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error, isDisable: false }));
  };

  onDefaultLoginLink = (password) => {
    this.setState({ isDisable: true });

    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password
    );

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error, isDisable: false }));
  };

  onUnlink = (providerId) => {
    this.setState({ isDisable: true });

    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch((error) => this.setState({ error, isDisable: false }));
  };

  render() {
    const { activeSignInMethods, error, isDisable } = this.state;
    return (
      <>
        Sign In Methodes:
        <ul>
          {SIGN_IN_METHODS.map((item) => {
            // Also, we added an improvement to avoid getting locked out of the application.
            // If only one sign-in method is left as active, disable all deactivation buttons
            // because there needs to be at least one sign-in method.
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(item.id);
            return (
              <li key={item.id}>
                {item.id === "password" ? (
                  <DefaultLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    item={item}
                    onLink={this.onDefaultLoginLink}
                    onUnlink={this.onUnlink}
                    isDisable={isDisable}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    item={item}
                    onLink={this.onSocialLoginLink}
                    onUnlink={this.onUnlink}
                    isDisable={isDisable}
                  />
                )}
              </li>
            );
          })}
        </ul>
        {error && <p>{error.message}</p>}
      </>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  item,
  onLink,
  onUnlink,
  isDisable,
}) =>
  isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(item.id)}
      disabled={onlyOneLeft || isDisable}
    >
      Deactivate {item.id}
    </button>
  ) : (
    <button
      type="button"
      onClick={() => onLink(item.provider)}
      disabled={isDisable}
    >
      Link {item.id}
    </button>
  );

class DefaultLoginToggle extends Component {
  constructor() {
    super();

    this.state = { passwordOne: "", passwordTwo: "" };
  }

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();

    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: "", passwordTwo: "" });
  };

  render() {
    const { onlyOneLeft, isEnabled, item, onUnlink, isDisable } = this.props;
    const { passwordOne, passwordTwo } = this.state;
    const isInvalid =
      isDisable || passwordOne !== passwordTwo || passwordOne === "";

    return isEnabled ? (
      <button
        type="button"
        onClick={() => onUnlink(item.id)}
        disabled={onlyOneLeft || isDisable}
      >
        Deactivate {item.id}
      </button>
    ) : (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          type="password"
          value={passwordOne}
          onChange={this.onChange}
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          type="password"
          value={passwordTwo}
          onChange={this.onChange}
          placeholder="Confirm New Password"
        />
        <button type="submit" disabled={isInvalid}>
          Link {item.id}
        </button>
      </form>
    );
  }
}

const LoginManagement = withFirebase(LoginManagementBase);

// Broad-grained authorization
const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(AccountPage);
