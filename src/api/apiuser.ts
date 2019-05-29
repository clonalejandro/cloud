/** IMPORTS **/

import User from '../orms/user';


export default class ApiUser {


    /** SMALL CONSTRUCTORS **/

    private App: any;
    private server: any;
    private prefix: string;

    constructor(App: any, server: any){
        this.App = App;
        this.server = server;
        this.prefix = "API-USER"
    }


    /** REST **/

    /**
     * This function register all api user routes
     */
    public register(): void {
        this.getAll();
        
        this.App.debug("Registering all apiuser routes", this.prefix)
    }


    /**
     * This function creates a user in database via api
     */
    private getAll(){
        this.server.post('/api/get-user', (req: any, res: any) => {
            try {
                new User(req.body).save(err => {
                    if (err) this.App.throwErr(err, this.prefix, res)
                    else res.status(200).send("Ok!")
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


}