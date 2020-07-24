import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import 'babel-polyfill';
import consts from 'Shared/consts';
import events from 'Shared/events';

import Messages from 'components/Messages';
import Form from 'components/Form';
import UsersBar from 'components/UsersBar';
import ChatContainer from 'components/ChatContainer';
import OnlineUserBar from 'components/OnlineUserBar';

const socket = io.connect(consts.SOCKET_URL);

const App = () => {
  const [messages, setMessages] = useState([
    {
      text: 'Здарова, пацаны, как дела?',
      name: 'Вася Петров'
    },
    {
      text: 'Приветы, все ровно, а ты как?',
      name: 'Лол Петрович'
    }
  ]);

  const [user, setUser] = useState({
    // id: 1,
    // name: 'Эрик Картман',
    // nickname: '',
    // available: false,
    // avatar: '1.jpg'
  });

  useEffect(function () {
    socket.on(events.ADD_MESSAGE_FROM_SERVER, ({ message }) =>
      setMessages(messages => [...messages, message])
    );
  }, []);

  const chooseUserHandler = ({ id, name, nickname, avatar }) => {
    socket.emit(events.CHOOSE_USER_FROM_CLIENT, { id });
    setUser({ name, nickname, avatar });
  };

  const addMessageHandler = message => {
    const newMessage = {
      ...user,
      text: message
    };
    socket.emit(events.ADD_MESSAGE_FROM_CLIENT, { message: newMessage });
    setMessages(messages => [...messages, newMessage]);
  };

  return (
    <ChatContainer>
      {user.name ? (
        <>
          <OnlineUserBar user={user} />
          <Messages messages={messages} />
          <Form onSubmit={addMessageHandler} />
        </>
      ) : (
          <>
            <h3>Выберите персонажа чтобы начать общение</h3>
            <UsersBar socket={socket} onChoose={chooseUserHandler} />
          </>
        )}
    </ChatContainer>
  );
};

render(
  <App />,
  document.getElementById('root')
);