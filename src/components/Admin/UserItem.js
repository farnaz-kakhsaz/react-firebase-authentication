import React, { Component } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
// Components
import { withFirebase } from "../Firebase";

class UserItemBase extends Component {
  constructor(props) {
    super(props);

    // Use passed information from UserList component as default local state:
    // If users navigate from the UserList to the UserItem component, they should arrive immediately.
    // If they enter the URL by hand in the browser or with a Link component that doesn’t pass them to
    // the UserItem component, the user needs to be fetched from the Firebase database.
    this.state = {
      loading: false,
      user: null,
      ...this.props.location.state,
    };
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  };

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on("value", (snapshot) => {
        this.setState({ user: snapshot.val(), loading: false });
      });
  }

  componentWillMount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  render() {
    const { user, loading } = this.state;

    return (
      <>
        <h2>User ({this.props.match.params.id})</h2>
        {loading && <div>Loading ...</div>}
        {user && (
          <>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Username:</strong> {user.username}
            </span>
            <span>
              <button type="button" onClick={this.onSendPasswordResetEmail}>
                Send Password Reset
              </button>
            </span>
          </>
        )}
      </>
    );
  }
}

export default compose(withRouter, withFirebase)(UserItemBase);
