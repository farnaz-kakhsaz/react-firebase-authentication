import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

// If the user has only social logins, it doesn’t matter if the email is not verified.
const needsEmailVerification = (authUser) =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData.map((item) => item.providerId).includes("password");

const withEmailVerification = (Component) => {
  class WithEmailVerification extends React.Component {
    constructor() {
      super();

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser) =>
            needsEmailVerification(authUser) ? (
              <>
                {this.state.isSent ? (
                  <p>
                    E-Mail confirmation sent: Check your E-Mails (Spam folder
                    included) for a confirmation E-Mail. Refresh this page once
                    you confirmed your E-Mail.
                  </p>
                ) : (
                  <p>
                    Verify your E-Mail: Check your E-Mails (Spam folder
                    included) for a confirmation E-Mail or send another
                    confirmation E-Mail.
                  </p>
                )}
                {/* “Send confirmation E-Mail” button is not shown the first time a user signs up; otherwise the user 
                may be tempted to click the button right away and receives a second confirmation E-Mail. */}
                {this.props.location.state &&
                this.props.location.state.justSignUp ? null : (
                  <button
                    type="button"
                    onClick={this.onSendEmailVerification}
                    disabled={this.state.isSent}
                  >
                    Send confirmation E-Mail
                  </button>
                )}
              </>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return compose(withRouter, withFirebase)(WithEmailVerification);
};

export default withEmailVerification;
