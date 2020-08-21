const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { techs } = request.query;

  const results = techs 
  ? repositories.filter(repo => repo.techs.includes(techs))
  : repositories;


  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url ,techs} = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repositorie);

  return response.json(repositorie);
  
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    return response.status(400).json("Repository Not found.");
  }

  const { title, url, techs } = request.body;

  const { likes } = repositories[repoIndex];

  const repo = { 
    id, 
    title, 
    url,
    techs,
    likes
  };

  repositories[repoIndex] = repo;

  return response.status(200).json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    return response.status(400).json("Repository Not found.");
  }
  repositories.splice(repoIndex, 1);

  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    return response.status(400).json("Repository Not found.");
  }

  const { title, url, techs, likes } = repositories[repoIndex];
  const like = likes +1;

  const repo = { 
    id, 
    title, 
    url,
    techs,
    likes: like
  };

  repositories[repoIndex] = repo;

  return response.status(200).json(repo);
});

module.exports = app;
