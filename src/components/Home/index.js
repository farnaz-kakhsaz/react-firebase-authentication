import React from "react";
import { compose } from "recompose";
// Components
import Message from "./Message";
import { withAuthorization, withEmailVerification } from "../Session";

const HomePage = () => (
  <>
    <div>Home</div>
    <p>The Home Page is accessible by every signed in user.</p>

    <Message />
  </>
);

// Broad-grained authorization
const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
