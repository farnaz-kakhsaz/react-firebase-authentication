import React from "react";
// Components
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor() {
      super();
      this.state = {
        authUser: JSON.parse(localStorage.getItem("authUser")),
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        (authUser) => {
          localStorage.setItem("authUser", JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => localStorage.removeItem("authUser")
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
