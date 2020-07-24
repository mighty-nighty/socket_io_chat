import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import socket from 'socket.io';
import events from '../shared/events';
import { readFile, updateFile } from './helpers';

dotenv.config();
const port = process.env.SOCKET_PORT || 5000;
const app = express();

app
  .use('/static', express.static(path.resolve(__dirname, 'public')))
  .use(cors());

app.get('/users', async (request, response) => {
  const users = await getUsersData();
  response.send(JSON.stringify(users));
});
app.get('/', (request, response) => {
  response.send("Hello i'm working");
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = socket(server);

io.on('connection', socket => {
  console.log('user connected', socket.id);

  socket.on(events.CHOOSE_USER_FROM_CLIENT, async ({ id }) => {
    socket.broadcast.emit(events.CHOOSE_USER_FROM_SERVER, { id })
    const users = await getUsersData()
    const userAliases = await readFile('user-aliases.json')
    const changedUsers = disableUser(id, users)
    const aliasObject = {
      socketId: socket.id,
      userId: id
    }
    const changedAliases = [...userAliases, aliasObject]
    await updateUsersData(changedUsers)
    await updateAliases(changedAliases)
  });

  socket.on(events.ADD_MESSAGE_FROM_CLIENT, ({ message }) => {
    socket.broadcast.emit(events.ADD_MESSAGE_FROM_SERVER, { message });
  });

  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.id);
    let UID = null;
    const userAliases = await readFile('user-aliases.json');

    userAliases.forEach(({ socketId, userId }) => {
      if (socketId === socket.id) {
        UID = userId
      }
    })

    if (UID) {
      socket.broadcast.emit(events.ENABLE_USER_FROM_SERVER, { id: UID });
      const users = await getUsersData();
      const changedUsers = enableUser(UID, users);
      await updateUsersData(changedUsers);
      const changedAliases = [...userAliases.filter(item => item.userId !== UID)];
      await updateAliases(changedAliases);
    }
  });
});

function disableUser(id, users) {
  return users.map(user => {
    return user.id === id
      ? {
        ...user,
        available: false
      }
      : user;
  })
}

async function updateUsersData(usersData) {
  try {
    await updateFile('users.json', usersData);
    return true;
  } catch (err) {
    console.log('update users error', err);
    return false;
  }
}

async function updateAliases(aliasesData) {
  try {
    await updateFile('user-aliases.json')
    return true;
  } catch (err) {
    console.log('update aliases error', err);
  }
}

async function getUsersData() {
  const data = await readFile('users.json');
  return data;
}