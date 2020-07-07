import React from "react";
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
const App = () => (
  <Router>
    <Navigation />
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

export default App;
