import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
// Components
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignInPage = () => (
  <div>
    <h1>Sign In</h1>
    <SignInForm />
    <SignInGoogle />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

class SignInFormBase extends Component {
  // For performance issues (Memory leaks)
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event) => {
    this._isMounted = true;

    event.preventDefault();
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        // Don't call setState if component is unmount!
        if (this._isMounted) {
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.HOME);
        }
      })
      .catch(
        (error) => this._isMounted && this.setState({ error, isDisable: false })
      );
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { email, password, error } = this.state;
    const isInvalid = email === "" || password === "";

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="email"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button type="submit" disabled={isInvalid}>
          Sign In
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor() {
    super();
    this.state = { isDisable: false, error: null };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({ isDisable: true });

    this.props.firebase
      .doSignInWithGoogle()
      .then((socialAuthUser) => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ isDisable: false, error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => this.setState({ isDisable: false, error }));
  };

  render() {
    const { isDisable, error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" disabled={isDisable}>
          Sign In with Google
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;
export { SignInForm, SignInGoogle };
