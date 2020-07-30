import React from 'react';
import styled from 'styled-components';

const Avatar = ({ src, online = false, className }) => {
  return (
    <div className={className}>
      <div className={`${online ? 'online' : ''} `}>
        <img src={src} alt="" />
      </div>
    </div>
  );
};

const StyledAvatar = styled(Avatar)`
  > div {
    margin: 0 auto;
    width: ${props =>
      props.size === 'medium' ? '55px' : props.size === 'small' ? '40px' : '65px'};
    height: ${props =>
      props.size === 'medium' ? '55px' : props.size === 'small' ? '40px' : '65px'};
  }

  > div > img {
    text-align: center;
    box-sizing: border-box;
    object-fit: cover;
    padding: 2px;
    width: ${props =>
      props.size === 'medium' ? '55px' : props.size === 'small' ? '40px' : '65px'};
    height: ${props =>
      props.size === 'medium' ? '55px' : props.size === 'small' ? '40px' : '65px'};
    border-radius: 50%;
    border: 2px solid #5FBDCE;
  }

  > div.online {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: calc(75% - 1px);
      top: calc(75%);
      z-index: 10;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      background-color: #17ce17;
      border: 2px solid #fff;
    }
  }
`;

export default StyledAvatar;