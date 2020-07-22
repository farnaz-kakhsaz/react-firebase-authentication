import React from "react";
import { withAuthorization } from "../Session";

const HomePage = () => (
  <>
    <div>Home</div>
    <p>The Home Page is accessible by every signed in user.</p>
  </>
);

// Broad-grained authorization
const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(HomePage);
