/** IMPORTS **/

import fs from 'fs';


export default class ApiFile {


    /** SMALL CONSTRUCTORS **/

    public props: any = new Object();
    
    private App: any;
    private server: any;

    public constructor(App: any, server: any){
        this.App = App;
        this.server = server;

        this.props = {
            prefix: "API-FILE",
            folderPath: `${__dirname}/../../../data`
        }

        this.init();
    }


    /** REST **/
    
    /**
     * This function register all api user routes
     */
    public register(): void {

        this.App.debug("Registering all apiuser routes", this.props.prefix)
    }


    /**
     * This function starts the apiFile creating a data folder
     */
    private init(): void {
        if (!fs.existsSync(this.props.folderPath)){
            fs.mkdirSync(this.props.folderPath);
            this.App.debug("Creating data folder", this.props.prefix)
        }
    }

    
    private moveFileToFolderRest(){
        this.server.get('/api/', (req: any, res: any) => {
            try {
                const bind = {
                    username: req.user.username,
                    currentDir: this.App.replaceAll(req.body.currentDir, "..", ""),
                    newDir: this.App.replaceAll(req.body.newDir, "..", "")
                };


            }
            catch (err){
                this.App.throwErr(err, this.props.prefix, res)
            }
        })
    }


    /**
     * This function creates a user folder
     * @param {String} username
     */
    public createUserFolder(username: string): void {
        const target: string = `${this.props.folderPath}/${username}`;

        try {
            if (!fs.existsSync(target)){
                fs.mkdirSync(target);
                this.App.debug(`Creating a user folder called ${username}`)
            }
            else this.App.throwErr({message: "The user folder was not created"}, this.props.prefix)
        }
        catch (err){
            this.App.throwErr(err, this.props.prefix)
        }
    }


    /**
     * This function returns the name files of the folder
     * @param {String} name 
     * @return {Array} files
     */
    public getContentFolder(name: string): string[] {
        try {
            return fs.readdirSync(`${this.props.folderPath}/${name}`)
        } 
        catch (err){
            this.App.throwErr(err, this.props.prefix)
            return []
        }
    }


    /**
     * This function move file to other folder
     * @param {String} username 
     * @param {String} currentDir 
     * @param {String} newDir 
     * @param {*} callback 
     */
    public moveFileToFolder(username: string, currentDir: string, newDir: string, callback: any): void {
        const current: string = `${this.props.folderPath}/${username}/${currentDir}`;
        const neu = `${this.props.folderPath}/${username}/${newDir}`;

        fs.rename(current, neu, err => callback(err))
    }
}