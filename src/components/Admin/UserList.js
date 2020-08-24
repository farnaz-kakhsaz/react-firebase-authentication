import React, { Component } from "react";
import { Link } from "react-router-dom";
// Components
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

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

export default withFirebase(UserListBase);
