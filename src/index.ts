/** IMPORTS **/

import App from './app';

import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

import config from '../assets/data/config.json';

const Context = {
    INSTALLATION: "INSTALLATION", 
    DEFAULT: "DEFAULT"
};


/** MAIN VARS **/

const context = fs.existsSync(`${__dirname}/../assets/data/config.json`) && config.installed ? Context.DEFAULT : Context.INSTALLATION;
const server = express();
const app = new App(server, context);


/** FUNCTIONAL **/

app.startLogRotate();
app.configureServer(cookieParser, bodyParser, session, passport);

app.prepareRoutes(passport);
app.start();
app.startApi()