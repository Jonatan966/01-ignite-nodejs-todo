const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const findedUser = users.find((user) => user.username === username);

  if (!findedUser) {
    return response.status(401).json({
      error: "User not exists",
    });
  }

  request.user = findedUser;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({
      error: "User already exists",
    });
  }

  const createdUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(createdUser);

  return response.status(201).json(createdUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const {
    body: { title, deadline },
    user,
  } = request;

  const createdTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(createdTodo);

  return response.status(201).json(createdTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const {
    params: { id: todoID },
    user,
    body: { title, deadline },
  } = request;

  const targetTodo = user.todos.find((todo) => todo.id === todoID);

  if (!targetTodo) {
    return response.status(400).json({
      error: "Todo not exists",
    });
  }

  targetTodo.title = title;
  targetTodo.deadline = deadline;

  return response.json(targetTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
