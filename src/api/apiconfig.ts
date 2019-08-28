/** IMPORTS **/

import fs from "fs";
import fsExtra from 'fs-extra';


export default class ApiConfig {


    /** SMALL CONSTRUCTORS **/

    public props: any = new Object();

    private App: any;
    private server: any;
    
    public constructor(App: any, server: any){
        this.App = App;
        this.server = server;

        this.props = {
            prefix: "API-CONFIG",
            filePath: `${__dirname}/../../../assets/data/config.json`
        };

        this.register()
    }


    /** OTHERS **/

    /**
     * This function register all api config routes
     */
    private register(): void {
        this.createConfigRest();

        this.App.debug("Registering all apiconfig routes", this.props.prefix)
    }


    /**
     * This function creates a config file via rest
     */
    private createConfigRest(): void {
        this.server.post('/api/create-config', (req: any, res: any) => {
            try {
                const response = req.body.res;
                
                this.createConfig(response, (err: any) => {
                    if (err) this.App.throwErr(err, this.props.debug);
                    else {
                        res.status(200).send("Ok!");
                        this.App.debug("Config created", this.props.prefix)
                    }
                })
            }
            catch (err){
                this.App.throwErr(err, this.props.prefix, res)
            }
        })
    }


    /**
     * This function creates a config file
     * @param {String} content
     * @param {*} callback
     */
    private createConfig(content: string, callback: any): void {
        if (fs.existsSync(this.props.filePath)) 
            fsExtra.removeSync(this.props.filePath);
        fs.writeFile(this.props.filePath, content, callback)
    }
}