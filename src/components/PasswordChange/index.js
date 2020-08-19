import React, { Component } from "react";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null,
  isDisable: false,
};
class PasswordChangeForm extends Component {
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
    this.setState({ isDisable: true });

    this.props.firebase
      .doPasswordUpdate(this.state.passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => this.setState({ error, isDisable: false }));
  };

  render() {
    const { passwordOne, passwordTwo, error, isDisable } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === "" || isDisable;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />
        <button type="submit" disabled={isInvalid}>
          Change My Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
