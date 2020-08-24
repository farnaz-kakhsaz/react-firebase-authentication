import React from "react";
import { Switch, Route } from "react-router-dom";
import { compose } from "recompose";
// Components
import UserList from "./UserList";
import UserItem from "./UserItem";
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

// Role-based authorization
const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AdminPage);
