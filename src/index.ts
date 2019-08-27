/** IMPORTS **/

import App from './app';

import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

const Context = {
    INSTALLATION: "INSTALLATION", 
    DEFAULT: "DEFAULT"
};


/** MAIN VARS **/

const forceInstall = true;
const context = fs.existsSync(`${__dirname}/../assets/data/config.json`) && !forceInstall ? Context.DEFAULT : Context.INSTALLATION;
const server = express();
const app = new App(server, context);


/** FUNCTIONAL **/

app.startLogRotate();
app.configureServer(cookieParser, bodyParser, session, passport);

app.prepareRoutes(passport);
app.start();
app.startApi()