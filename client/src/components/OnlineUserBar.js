import React from 'react';
import styled from 'styled-components';

import Avatar from 'components/Avatar';
import consts from 'Shared/consts';

const OnlineUserBar = ({ user, className }) => {
  return (
    <div className={className}>
      <Avatar src={`${consts.IMAGES_FOLDER_URL}/${user.avatar}`} online />
      <span>
        <b>{`${user.name}`}</b>
      </span>
    </div>
  );
};

const StyledOnlineUserBar = styled(OnlineUserBar)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;

  span {
    margin-left: 12px;
  }
`;

export default StyledOnlineUserBar;