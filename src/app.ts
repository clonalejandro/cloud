/** IMPORTS **/

import express from 'express';
import flash from 'connect-flash';

import Color from './utils/color';
import TaskTimer from './utils/tasktimer';
import Math from './utils/math';
import Log from './utils/log';
import Router from './utils/router';
import Mongo from './utils/mongo';
import Auth from './utils/auth';

import User from './orms/user';

import Api from './api/api';

import config from '../assets/data/config.json';
import routes from '../assets/data/routes.json';


export default class App {


    /** SMALL CONSTRUCTORS **/

    public server: express.Application
    
    private log: Log;

    private static log: Log;

    public static Api: Api;
    public static mongo: Mongo;
    public static config = config;
    public static routes = routes;
    public static tasks = [{name: "", callback: ""}];
    
    public constructor(server: express.Application){
        this.server = server;
        this.log = new Log();

        App.log = this.log;
        App.mongo = new Mongo(App);
        App.Api = new Api(App, server);
    }


    /** REST **/

    /**
     * This function replace all
     * @param {String || Object} data
     * @param {String} charToReplace charToReplace
     * @param {String} newChar newChar
     * @return {String} data
     */
    public static replaceAll(data: any, charToReplace: string, newChar = ""): string {
        if (App.isNull(data)) return data;

        data = (typeof data != "string" ? data.toString() : data);

        while (data.includes(charToReplace))
            data = data.replace(charToReplace, newChar);

        return data
    }


    /**
     * This function check if data is null
     * @param {*} data
     * @return {boolean} isNull
     */
    public static isNull(data: any): boolean {
        return data == null || data  == undefined || data == "undefined"
    }


    /**
     * This function debug data passed by parameter
     * @param {String || Object} data message to debug
     * @param {String} type
     */
    public static debug(data: any, type = "INFO"): void {
        const prefix = `[${type}]`;
        const prompt = " ⇒ ";

        data = (data instanceof Object ? JSON.stringify(data) : data);

        this.log.write(`${prefix}${prompt}${data}\n`);

        if (!config.debug) return;

        if (prefix.includes("ERROR")) console.log(Color.FgRed + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("ALERT")) console.log(Color.FgYellow + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("TEST")) console.log(Color.FgCyan + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else console.log(Color.FgBlue + prefix + Color.FgMagenta + prompt + Color.Reset + data)
    }


    /**
     * This function throw custom test debug messages
     * @param {*} data test
     */
    public static throwTest(data: any){
        App.debug(data, "TEST")
    }
    
    
    /**
     * This function throw custom alerts
     * @param {*} data alert 
     */
    public static throwAlert(data: any, type: string = "ALERT"){
        App.debug(data, (type == "ALERT" ? type : `${type}!ERROR`))
    }


    /**
     * This function throw custom errors
     * @param {*} err error
     */
    public static throwErr(err: any, type: string = "ERROR", res: any = undefined){
        if (!App.isNull(err)) App.debug(
            err.message, (type == "ERROR" ? type : `${type}!ERROR`)
        )
        
        if (!App.isNull(res)) res.status(500).send(err.message)
    }


    /**
     * This function starts the server
     */
    public start(): void {
        this.server.use('/assets', express.static(`${ __dirname}/../../public/assets/`, config.session.cookie));
        this.server.set('views', 'views');
        this.server.set('view engine', 'pug');

        this.server.listen(config.port, () => {
            App.debug(`Starting cloud server listen port: ${config.port}  🎨`)
        })
    }

    
    /**
     * This function prepare all routes for the cloud server
     * @param {*} passport
     */
    public prepareRoutes(passport: any): void {
        new Router(App, this.server, passport).register()
    }


    /**
     * This function configure the middlewares
     * @param {*} cookieParser cookieParser
     * @param {*} bodyParser bodyParser
     * @param {*} session session
     * @param {*} passport passport
     */
    public configureServer(cookieParser: any, bodyParser: any, session: any, passport: any): void {
        this.server.use(cookieParser());
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({extended: true}));
        this.server.use(flash());
        this.server.use(session(config.session));
        this.server.use(passport.initialize());
        this.server.use(passport.session());

        passport.serializeUser((user: any, done: any) => done(null, user._id));
        passport.deserializeUser((id: any, done: any) => User.findById(id, (err, user) => done(err, user)));
       
        new Auth(App, passport)
    }


    /**
     * This function starts the logRotate module
     */
    public startLogRotate(): void {
        new TaskTimer(App, 'Log rotate', () => this.log.logRotate(), Math.hoursToMilis(1))
    }
}