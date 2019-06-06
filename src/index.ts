import App from './app';
import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

const forceInstall = false;

if (fs.existsSync(`${__dirname}/../assets/data/config.json`) && !forceInstall){
    const server = express();
    const app = new App(server);

    app.startLogRotate();
    app.configureServer(cookieParser, bodyParser, session, passport);
    app.prepareRoutes(passport);
    app.start();
    app.startApi()
}
else {
    const server = express();
    //TODO: Installation app
    server.listen(3001, () => console.log("Starting server in installation mode 💣"));
    server.use(express.static(`${__dirname}/../../public/install/`));
}