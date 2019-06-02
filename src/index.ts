import App from './app';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

const server = express();
const app = new App(server);

app.startLogRotate();
app.configureServer(cookieParser, bodyParser, session, passport);
app.prepareRoutes(passport);
app.start()
app.startApi();