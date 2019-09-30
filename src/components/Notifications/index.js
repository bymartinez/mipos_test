import React from 'react';
import { Alert } from 'react-bootstrap';
import uuid from "uuid/v1";

class Notifications extends React.Component {
  state = {
    notifications: [],
  };

  addNotification = ({ type, message, timeout }) => {
    const id = uuid();
    this.setState((prevState) => ({
      notifications: [
        ...prevState.notifications,
        {
          id,
          type,
          message,
          timeout,
        },
      ]
    }));

    setTimeout(() => {
      this.setState(({ notifications }) => {
        const nextNotifications = notifications.filter(notification => notification.id !== id);

        return {
          notifications: nextNotifications,
        }
      });
    },timeout);
  };

  render() {
    return (
      <>
        {this.state.notifications.map(({ type, message, id }) => (<Alert key={id} variant={type}>{message}</Alert>))}
      </>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Notifications ref={ref} {...props}/>
));
