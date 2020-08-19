import React, { Component } from "react";
import { withRouter, Switch, Route, Link } from "react-router-dom";
import { compose } from "recompose";
// Components
import { withFirebase } from "../Firebase";
import { withAuthorization, withEmailVerification } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const AdminPage = () => (
  <>
    <h1>Admin</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>
    <Switch>
      <Route path={ROUTES.ADMIN_DETAILS}>
        <UserItem />
      </Route>
      <Route path={ROUTES.ADMIN}>
        <UserList />
      </Route>
    </Switch>
  </>
);

class UserListBase extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    // The listener is called `on()`, which receives a type and a callback function.
    // The `on()` method registers a continuous listener that triggers every time something has changed,
    // the `once()` method registers a listener that would be called only once.
    this.props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map((item) => ({
        ...usersObject[item],
        uid: item,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;
    return (
      <>
        <h2>Users</h2>
        {loading && <div>Loading...</div>}
        <ul>
          {users.map((item) => (
            <li key={item.uid}>
              <span>
                <strong>ID:</strong> {item.uid}
              </span>
              <span>
                <strong>E-Mail:</strong> {item.email}
              </span>
              <span>
                <strong>Username:</strong> {item.username}
              </span>
              <span>
                <Link
                  to={{
                    pathname: `${ROUTES.ADMIN}/users/${item.uid}`,
                    state: { user: item },
                  }}
                >
                  Details
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

class UserItemBase extends Component {
  constructor(props) {
    super(props);

    // Use passed information from UserList component as default local state
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
    console.log(user);
    console.log(this.props.match.params);
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

// Role-based authorization
const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

const UserList = withFirebase(UserListBase);
const UserItem = compose(withRouter, withFirebase)(UserItemBase);

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AdminPage);
