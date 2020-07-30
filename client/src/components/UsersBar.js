import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import consts from 'Shared/consts';
import events from 'Shared/events';
import Avatar from 'components/Avatar';

const UsersBar = ({ onChoose = f => f, socket, className }) => {
  const [users, setUsers] = useState([]);

  useEffect(function () {
    const fetchUsers = async () => {
      const response = await axios(`${consts.SOCKET_URL}/users`);
      setUsers(response.data);
    };
    fetchUsers();

    const chooseHandle = ({ id }) => {
      setUsers(users =>
        users.map(user =>
          user.id === id
            ? {
              ...user,
              available: false
            }
            : user
        )
      );
    };

    const enableHandle = ({ id }) => {
      setUsers(users =>
        users.map(user =>
          user.id === id
            ? {
              ...user,
              available: true
            }
            : user
        )
      );
    };

    socket.on(events.ENABLE_USER_SERVER, enableHandle);
    socket.on(events.CHOOSE_USER_SERVER, chooseHandle);

    return () => {
      socket.off(events.CHOOSE_USER_SERVER, chooseHandle);
      socket.off(events.ENABLE_USER_SERVER, enableHandle);
    };
  }, []);

  if (users.length < 1) {
    return <span style={{ padding: '3px 0 0 6px', color: 'blue' }}>No active users...</span>
  }

  const viewWidth = window.innerWidth;

  return (
    <div className={className}>
      <ul>
        {users.map((user, i) => (
          <li key={i}>
            <Avatar
              src={`${consts.IMAGES_FOLDER_URL}/${user.avatar}`}
              online={!user.available}
              size={viewWidth <= 480 ? 'medium' : ''}
            />
            <p>{`${user.name}`}</p>
            {user.available ? (
              <button onClick={() => onChoose(user)}>Выбрать</button>
            ) : (
                <button disabled>Занят</button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const StyledUsersBar = styled(UsersBar)`
  width: 100%;
  max-width: 500px;
  padding: 10px 10px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  box-sizing: border-box;  

  ul {
    list-style-type: none;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-inline-start: 0;  
  }  

  li {
    margin: 5px 10px;
    max-width: 80px;
  }

  li > h4 {
    font-size: 0.725em;
    margin-top: 10px;
    height: 26px;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  li > button {
    border: none;
    border-radius: 8px;
    padding: 0.4em 1.4em;
    font-size: 0.675em;
    background: #008080;
    color: #fff;
    font-weight: 500;
    min-width: 80px;
    min-height: 28px;
    border-width: unset;
    cursor: pointer;
    transition: all .3s ease;   

    &:disabled {
      background: #ddd;
      color: #666;
      cursor: not-allowed;
    }

    &:hover:not([disabled]) {
      background: #20B2AA;
    }    
  }

  @media (max-width: 480px) {
    ul {
      justify-content: center;
      flex-wrap: wrap;
      padding-inline-start: 0;  
    }

    li {
      margin: 12px 16px;
      max-width: 80px;
    }
  }
`;

export default StyledUsersBar;