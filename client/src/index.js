import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import 'babel-polyfill';
import consts from 'Shared/consts';
import events from 'Shared/events';
import styled from 'styled-components';

import Messages from 'components/Messages';
import Form from 'components/Form';
import UsersBar from 'components/UsersBar';
import ChatContainer from 'components/ChatContainer';
import OnlineUserBar from 'components/OnlineUserBar';

const socket = io.connect(consts.SOCKET_URL);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    socket.on(events.SEND_LAST_MESSAGES, (lastMessages) => {
      setMessages([...lastMessages]);
    });
    socket.on(events.ADD_MESSAGE_SERVER, ({ message }) =>
      setMessages(messages => [...messages, message])
    );
  }, []);

  const chooseUserHandler = ({ id, name, nickname, avatar }) => {
    socket.emit(events.CHOOSE_USER_CLIENT, { id });
    setUser({ id, name, nickname, avatar });
  };

  const addMessageHandler = message => {
    const newMessage = {
      ...user,
      text: message
    };
    socket.emit(events.ADD_MESSAGE_CLIENT, { message: newMessage });
    setMessages(messages => [...messages, newMessage]);
  };

  return (
    <ChatContainer>
      {user.name ? (
        <>
          <OnlineUserBar user={user} />
          <Messages messages={messages} currentId={user.id} />
          <Form onSubmit={addMessageHandler} />
        </>
      ) : (
          <>
            <MessageWrapper className={'mainTitle'}>
              <h3>Выберите вашего кота чтобы начать общение</h3>
            </MessageWrapper>
            <UsersBar socket={socket} onChoose={chooseUserHandler} />
          </>
        )}
    </ChatContainer>
  );
};

const MessageWrapper = styled.div`
  padding: 10px 0;
  text-align: center;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
  margin-bottom: 10px;
`

render(
  <App />,
  document.getElementById('root')
);