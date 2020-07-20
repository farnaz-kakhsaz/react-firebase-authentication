import React, { Component } from "react";
import { Link } from "react-router-dom";
// Components
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => (
  <>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </>
);

const INITIAL_STATE = {
  email: "",
  error: null,
  isDisable: false,
};

class PasswordForgetFormBase extends Component {
  constructor() {
    super();
    this.state = {
      ...INITIAL_STATE,
    };
  }

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { email } = this.state;

    this.setState({ isDisable: true });

    this.props.firebase
      .doPasswordReset(email)
      .then(() => this.setState({ ...INITIAL_STATE }))
      .catch((error) => this.setState({ error, isDisable: false }));
  };

  render() {
    const { email, error, isDisable } = this.state;
    const isInvalid = email === "" || isDisable;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <button type="submit" disabled={isInvalid}>
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forget Password?</Link>
  </p>
);

export default PasswordForgetPage;
export { PasswordForgetForm, PasswordForgetLink };
