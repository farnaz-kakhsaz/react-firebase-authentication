import React, { Component } from "react";
import { compose } from "recompose";
// Components
import { withFirebase } from "../Firebase";
import { withAuthorization, withEmailVerification } from "../Session";

const HomePage = () => (
  <>
    <div>Home</div>
    <p>The Home Page is accessible by every signed in user.</p>

    <Message />
  </>
);

class MessageBase extends Component {
  constructor() {
    super();

    this.state = { messages: [], loading: false };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.messages().on("value", (snapshot) => {
      const messageObject = snapshot.val();

      // We need to know if the list of messages is empty (see constructor), if the message API
      // didn’t return any messages and the local state is changed from an empty array to null
      if (messageObject) {
        const messageList = Object.keys(messageObject).map((item) => ({
          ...messageObject[item],
          uid: item,
        }));

        this.setState({ messages: messageList, loading: false });
      } else {
        this.setState({ message: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  render() {
    const { messages, loading } = this.state;
    return (
      <>
        {loading && <div>Loading ...</div>}

        {messages ? (
          <MessageList messages={messages} />
        ) : (
          <p>There are no messages ...</p>
        )}
      </>
    );
  }
}

const MessageList = ({ messages }) => (
  <ul>
    {messages.map((item) => (
      <MessageItem key={item.uid} message={item} />
    ))}
  </ul>
);

const MessageItem = ({ messages }) => (
  <li>
    <strong>{messages.userId}</strong> {messages.text}
  </li>
);

const Message = withFirebase(MessageBase);

// Broad-grained authorization
const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
