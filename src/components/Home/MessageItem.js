import React, { Component } from "react";

class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: this.props.message.text,
    };
  }

  onToggleEditMode = () => {
    this.setState((state) => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
    }));
  };

  onChangeEditText = (event) => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { authUser, message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
            <strong>{message.userId}</strong> {message.text}
            {message.editedAt && <span>(Edited)</span>}
          </span>
        )}
        {authUser.uid === message.userId && (
          <>
            {editMode ? (
              <span>
                <button type="button" onClick={this.onSaveEditText}>
                  Save
                </button>
                <button type="button" onClick={this.onToggleEditMode}>
                  Reset
                </button>
              </span>
            ) : (
              <button type="button" onClick={this.onToggleEditMode}>
                Edit
              </button>
            )}
            {!editMode && (
              <button
                type="button"
                onClick={() => onRemoveMessage(message.uid)}
              >
                Delete
              </button>
            )}
          </>
        )}
      </li>
    );
  }
}

export default MessageItem;
