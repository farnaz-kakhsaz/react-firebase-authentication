import React from "react";
// Components
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
import { AuthUserContext } from "../Session";
import LandingPage from "../Landing";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) =>
      authUser ? (
        <>
          <h1>Account Page</h1>
          <PasswordForgetForm />
          <PasswordChangeForm />
        </>
      ) : (
        <LandingPage />
      )
    }
  </AuthUserContext.Consumer>
);

export default AccountPage;
