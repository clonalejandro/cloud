/** IMPORTS **/

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
    private tempConfig: Object;
    private server: any;
    private passport: any;

    public constructor(App: any, server: any, passport: any){
        this.App = App;
        this.tempConfig = App.config;
        this.server = server;
        this.passport = passport;
    }


    /** REST **/

    /**
     * This function register all routes for the cloud server
     */
    public register(): void {
        this.renderTest();
    }


    /**
     * This function render pages with routes file
     */
    renderMainRoutes(){
        Object.keys(this.App.routes).forEach(url => {
            const view = this.App.routes[url];
            
            this.server.get(url, (req: any, res: any) => {
                try {
                    res.render(view, this.tempConfig)
                }
                catch (err){
                    this.App.throwErr(err, this.prefix, res)
                }
            });
            this.App.debug(`The server is registering route: "${url}" aiming to: ${view}`, this.prefix)
        })
    }


    private renderTest(): void {
        this.server.get('/', (req: any, res: any) => {
            res.send("hola")
        });

    }


}