import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Components
import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged((authUser) => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <Router>
        <Navigation authUser={this.state.authUser} />
        <hr />
        <Switch>
          <Route path={ROUTES.SIGN_UP}>
            <SignUpPage />
          </Route>
          <Route path={ROUTES.SIGN_IN}>
            <SignInPage />
          </Route>
          <Route path={ROUTES.PASSWORD_FORGET}>
            <PasswordForgetPage />
          </Route>
          <Route path={ROUTES.HOME}>
            <HomePage />
          </Route>
          <Route path={ROUTES.ACCOUNT}>
            <AccountPage />
          </Route>
          <Route path={ROUTES.ADMIN}>
            <AdminPage />
          </Route>
          <Route exact path={ROUTES.LANDING}>
            <LandingPage />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default withFirebase(App);
