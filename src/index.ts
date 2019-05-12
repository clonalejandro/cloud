import App from './App';
import express from 'express';

const server = express();
const app = new App(server);

app.start(3000)