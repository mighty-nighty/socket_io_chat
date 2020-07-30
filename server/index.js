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

let lastMessages = [
  {
    text: 'Здарова, котоны, как дела?',
    name: 'Васька',
    id: 1
  },
  {
    text: 'Приветы, все ровно, а ты как?',
    name: 'Пушок',
    id: 3
  }
];

io.on('connection', socket => {
  console.log('user connected', socket.id);
  
  socket.emit(events.SEND_LAST_MESSAGES, lastMessages);

  socket.on(events.CHOOSE_USER_CLIENT, async ({ id }) => {
    socket.broadcast.emit(events.CHOOSE_USER_SERVER, { id })
    const users = await getUsersData()
    const userAliases = await readFile('active-users-aliases.json')
    const changedUsers = disableUser(id, users)
    const aliasObject = {
      socketId: socket.id,
      userId: id
    }
    const changedAliases = [...userAliases, aliasObject]
    await updateUsersData(changedUsers)
    await updateAliases(changedAliases)
  });

  socket.on(events.ADD_MESSAGE_CLIENT, ({ message }) => {
    lastMessages.length < 5 ? lastMessages.push(message) : lastMessages.shift() && lastMessages.push(message);
    socket.broadcast.emit(events.ADD_MESSAGE_SERVER, { message });
  });

  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.id);
    let UID = null;

    const userAliases = await readFile('active-users-aliases.json');
    userAliases.forEach(({ socketId, userId }) => {
      if (socketId === socket.id) {
        UID = userId
      }
    })

    if (UID) {
      socket.broadcast.emit(events.ENABLE_USER_SERVER, { id: UID });
      console.log('ENABLE_USER_SERVER');
      const users = await getUsersData();
      const changedUsers = enableUser(UID, users);
      await updateUsersData(changedUsers);
      const changedAliases = [...userAliases.filter(item => item.userId !== UID)];
      await updateAliases(changedAliases);
    }
  });
});

function enableUser(id, users) {
  return users.map(user => {
    return user.id === id
      ? {
          ...user,
          available: true
        }
      : user;
  });
};

function disableUser(id, users) {
  return users.map(user => {
    return user.id === id
      ? {
        ...user,
        available: false
      }
      : user;
  })
};

async function updateUsersData(usersData) {
  try {
    await updateFile('users.json', usersData);
    return true;
  } catch (err) {
    console.log('update users error', err);
    return false;
  }
};

async function updateAliases(aliasesData) {
  try {
    await updateFile('active-users-aliases.json', aliasesData);
    return true;
  } catch (err) {
    console.log('update aliases error', err);
  }
};

async function getUsersData() {
  const data = await readFile('users.json');
  return data;
};