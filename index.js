const { v4: uuidv4 } = require('uuid');
const express = require('express');
const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ message: 'hello' });
});

let users = [{ id: uuidv4(), name: 'test', bio: `Hello` }];

//POST create new User
server.post('/users', (req, res) => {
  try {
    const data = req.body;
    if (data.bio && data.name) {
      users.push({ id: uuidv4(), ...data });
      res.status(201).json({ data: { users } });
    } else {
      res
        .status(400)
        .json({ errorMessage: 'Please provide name and bio for the user.' });
    }
  } catch (e) {
    res.status(500).json({
      errorMessage: 'There was an error while saving the user to the database',
    });
  }
});

//GET lists array of users
server.get('/users', (req, res) => {
  try {
    res.status(200).json({ data: { users } });
  } catch (e) {
    res
      .status(500)
      .json({ errorMessage: 'The users information could not be retrieved.' });
  }
});

server.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === id);

  try {
    if (user) {
      res.status(200).json({ data: { user } });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (e) {
    res
      .status(500)
      .json({ errorMessage: 'The user information could not be retrieved.' });
  }
});

//PUT make changes to users based on ID
server.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  const found = users.find((user) => user.id === id);

  try {
    if (found) {
      Object.assign(found, changes);
      res.status(201).json({ data: { users } });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (e) {
    res
      .status(500)
      .json({ errorMessage: 'The user information could not be modified.' });
  }
});

//DELETE user based on ID
server.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  const matchingID = users.find((user) => user.id === id);

  try {
    if (id) {
      users = users.filter((user) => user.id !== id);
      res.status(200).json({ data: { users } });
    } else {
      res
        .status(404)
        .json({ message: 'The user with the specified ID does not exist.' });
    }
  } catch (e) {
    res.status(500).json({ errorMessage: 'The user could not be removed' });
  }
});

const port = 5000;
server.listen(port, () => console.log('API running'));
