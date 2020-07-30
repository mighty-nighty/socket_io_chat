import React, { useState } from 'react';
import styled from 'styled-components';

const Form = ({ onSubmit = f => f, className }) => {
  const [message, setMessage] = useState('');

  const messageHandle = e => {
    const value = e.target.value;
    setMessage(value);
  };

  const submitHandle = e => {
    e.preventDefault();
    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={submitHandle} className={className}>
      <input type="text" value={message} onChange={messageHandle} />
      <button type="submit">Отправить</button>
    </form>
  );
};

const styledForm = styled(Form)`
  width: 100%;
  max-width: 500px;
  min-height: 60px;
  padding: 0.4em;
  background: #daf7f7;
  display: grid;
  grid-template-columns: auto 120px;
  grid-gap: 10px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  
  span {
    display: inline-block;
    line-height: 32px;
    width: 100%;
    font-weight: 500;
  }

  button[type='submit'] {
    background: #20B2AA;
    color: #fff;
    border-radius: 6px;
    font-weight: 500;
    border: none;
    height: 100%;
    line-height: 32px;
    font-size: 16px;
    padding: 0;
    outline: none;
    cursor: pointer;
    transition: all .3s ease;

    &:hover {
      background: #008080;
    }
  }

  input[type='text'] {
    padding-left: 10px;
    border-radius: 6px;
    border: 1px solid #20B2AA;
    font-size: 1rem;
    transition: all .2s ease;

    &:focus {
      outline: none;
      border: 1px solid #008080;
      background-color: #FFEBCD;
    }
  } 
`;

export default styledForm;