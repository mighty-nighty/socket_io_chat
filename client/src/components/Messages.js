import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import Loading from 'components/Loading';

const Message = ({ text, name, className }) => {
  return (
    <div>
      <div className={className}>
        <b>{name}</b>
        <br />
        <span style={{marginTop: '3px'}}>{text}</span>
      </div>
    </div>
  );
};

const Messages = ({ messages = [], currentId, className }) => {
  const messagesEnd = useRef(null);

  if (messages.length < 1) {
    return <Loading />;
  }
  const scrollToBottom = () => {
    if (!messagesEnd) {
      return;
    }
    messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(function () {
    scrollToBottom();
  });

  return (
    <div className={`${className} messages`}>
      <Scrollbars
        style={{ minHeight: '480px', width: '100%' }}
        autoHide
        autoHideTimeout={400}
        autoHideDuration={200}
      >
        {messages.map((message, i) => (
          <StyledMessage key={i} {...message} isMine={message.id === currentId} />
        ))}
        <div ref={messagesEnd} />
      </Scrollbars>
    </div>
  );
};

const StyledMessage = styled(Message)`
  background-color: ${props => (props.isMine ? '#ffe4b2' : '#cafced')};
  padding: 0.4rem;
  border-radius: 0.4rem;
  margin: 10px 0;
  width: 80%;
  margin-left: ${props => (props.isMine ? '20%' : '0')};
  margin-right: ${props => (!props.isMine ? '20%' : '0')};
  line-height: 24px;

  & span {
    font-weight: 400;
  }
`;

const StyledMessages = styled(Messages)`
  box-sizing: border-box;
  
  > div {
    overflow: hidden;
    box-sizing: border-box;
  }
`;

export default StyledMessages;