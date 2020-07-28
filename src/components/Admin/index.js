import React from "react";
import { compose } from "recompose";
// Components
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";

class AdminPage extends React.Component {
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
        <h1>Admin</h1>
        <p>The Admin Page is accessible by every signed in admin user.</p>
        {loading && <div>Loading...</div>}
        <UserList users={users} />
      </>
    );
  }
}

const UserList = ({ users }) => (
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
      </li>
    ))}
  </ul>
);

// Role-based authorization
const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition), withFirebase)(AdminPage);
