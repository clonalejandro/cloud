/** IMPORTS **/

import { Request, Response } from "express";


/** FUNCTIONS **/

function getSecureConfig(config: any){
    const tempConfig = {
        apiKey: config.apiKey,
        logo: config.logo,
        webName: config.webName,
        description: config.description,
        tagsString: config.tagsString,
        email: config.email,
        webURI: config.webURI
    }
    
    return tempConfig
}


export default class Router {


    /** SMALL CONSTRUCTORS **/

    public prefix: string = "ROUTER";
    private App: any;
    private tempConfig: any;
    private server: any;
    private passport: any;

    public constructor(App: any, server: any, passport: any){
        this.App = App;
        this.tempConfig = getSecureConfig(App.config);
        this.server = server;
        this.passport = passport;
    }


    /** REST **/

    /**
     * This function register all routes for the cloud server
     */
    public register(): void {
        this.renderMainRoutes();
        this.renderPanel();
        this.renderRegister();
        this.renderLogin();
        this.renderLogout()
    }
    

    /**
     * This function render pages with routes file
     */
    private renderMainRoutes(): void {
        Object.keys(this.App.routes).forEach(url => {
            const view = this.App.routes[url];
            this.server.get(`/${url}`, (req: Request, res: Response) => {
                try {
                    res.render(view, this.tempConfig)
                }
                catch (err){
                    this.App.throwErr(err, this.prefix, res)
                }
            });
            this.App.debug(`The server is registering route: "/${url}" aiming to: ${view}`, this.prefix)
        })
    }


    /**
     * This function render the users panel
     */
    private renderPanel(): void {
        this.server.get('/', this.isAuthenticated, (req: any, res: any) => {
            try {
                const dir = decodeURI(req.query.dir);
                const ApiFile = this.App.Api.ApiFile;

                if (dir.includes("..")) res.redirect(encodeURI(
                    '/?dir=' + this.App.replaceAll(this.App.replaceAll(dir, "../", ""), "..", "")
                ))//Securityze the url
                else {
                    this.tempConfig.username = req.user.username;
                
                    this.tempConfig.files = this.App.isNull(dir) ? 
                        ApiFile.getContentFolder(this.tempConfig.username) :
                        ApiFile.getContentFolder(this.tempConfig.username + dir);
                    
                    res.render('panel', this.tempConfig)
                }
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });
        
        //Upload
        this.server.post('/', (req: any, res: any) => {
            try {
                const fixEndSlash = (str: any) => str.endsWith("/") ? str : str.concat("/");
                
                const uri: URL = new URL(req.headers.referer);
                
                const params: any = new URLSearchParams(uri.search).get("dir");
                const ApiFile: any = this.App.Api.ApiFile;
                
                const dir: string = ApiFile.props.folderPath + "/" + req.user.username + fixEndSlash(
                    this.App.isNull(params) ? "/" : params
                );

                Object.keys(req.files).forEach(key => {
                    const files = req.files[key];
                   
                    if (files instanceof Array) files.forEach((file: any) => file.mv(dir + file.name, (err: any) => {
                        if (err) this.App.throwErr(err, this.prefix, res)
                    }))
                    else files.mv(dir + files.name, (err: any) => {
                        if (err) this.App.throwErr(err, this.prefix, res)
                    })
                });

                res.status(200).send("Ok!")
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });

        this.App.debug(`The server is registering route: "/panel" aiming to: panel`, this.prefix)
    }


    /**
     * This function render the register pasarel
     */
    private renderRegister(): void {
        this.server.get('/signup', this.preventRelogin, (req: any, res: any) => {
            try {
                if (req.isAuthenticated()) res.redirect('/logout');
                else {
                    const msg = req.flash('msg');
                    this.tempConfig.msg = (!msg.length || this.App.isNull(msg)) ? undefined : msg;
                    res.render('signup', this.tempConfig)
                }
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });
        
        this.server.post('/signup', this.passport.authenticate('signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }));
        
        this.App.debug(`The server is registering route: "/signup" aiming to: signup`, this.prefix)
    }


    /**
     * This function render the login pasarel
     */
    private renderLogin(): void {
        this.server.get('/login', this.preventRelogin, (req: any, res: any) => {
            try {
                const msg = req.flash('msg');
                this.tempConfig.msg = (!msg.length || this.App.isNull(msg)) ? undefined : msg;
                res.render('login', this.tempConfig)
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });
        
        this.server.post('/login', this.passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));
        
        this.App.debug(`The server is registering route: "/login" aiming to: login`, this.prefix)
    }


    /**
     * This function render the logout for destroy sessions
     */
    private renderLogout(): void {
        this.server.get('/logout', (req: any, res: any) => {
            try {
                req.logout();
                res.redirect('/login');
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function protect panel checking if you are logged in
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    private isAuthenticated(req: any, res: any, next: any): void {
        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }


    /**
     * This function prevent relogin checking if you are logged in
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    private preventRelogin(req: any, res: any, next: any): void {
        if (req.isAuthenticated()) res.redirect('/logout');
        else next()
    }


}
