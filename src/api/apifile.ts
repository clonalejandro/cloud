/** IMPORTS **/

import fs from 'fs';
import fsExtra from 'fs-extra';


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
        this.register();
    }


    /** REST **/

    /**
     * This function creates a user folder
     * @param {String} username
     */
    public createUserFolder(username: string): void {
        const target: string = `${this.props.folderPath}/${username}`;

        try {
            if (!fs.existsSync(target)){
                fs.mkdirSync(target);
                fs.mkdirSync(target + "/temp_bin");
                
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
            const dir = `${this.props.folderPath}/${name}`;

            if (fs.existsSync(dir)){
                const files = this.filterFiles(fs.readdirSync(dir))
                const res = new Array();

                files.forEach(file => res.push({
                    name: file,
                    type: fs.statSync(`${dir}/${file}`).isDirectory() ? "folder" : "file"
                }));

                return res
            }
            else return this.App.throwErr({message: `The folder ${name} not exists`}, this.props.prefix);
        } 
        catch (err){
            return this.App.throwErr(err, this.props.prefix)
        }
    }


    /**
     * This function creates a folder in the user directory
     * @param {String} username 
     * @param {String} folder 
     * @param {*} callback 
     */
    public createFolder(username: string, folder: string, callback: any): void {
        const dir = `${this.props.folderPath}/${username}/${folder}`;

        try {
            if (!fs.existsSync(dir))
                fs.mkdir(dir, err => callback(err))
            else callback({message: "This file/folder already exists with this name"})
        }
        catch (err){
            callback(err)
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
        const neu: string = `${this.props.folderPath}/${username}/${newDir}`;

        try {
            if (fs.existsSync(`${this.props.folderPath}/${username}`))
                if (fs.existsSync(`${this.props.folderPath}/${username}/temp_bin`))
                    if (!fs.existsSync(neu) || neu == currentDir)
                        fs.rename(current, neu, callback)
                    else callback({message: "This file/folder already exists with this name"})
                else callback({message: "The user bin not exists, please contact with an a administrator"})
            else callback({message: "The user folder not exists, please contact with an a administrator"})
        }
        catch (err){
            callback(err)
        }
    }


    /**
     * This function deletes a file
     * @param {String} username 
     * @param {String} folder 
     * @param {*} callback
     */
    public deleteFile(username: string, file: string, callback: any): void {
        const dir = `${this.props.folderPath}/${username}/temp_bin/${file}`;

        try {
            if (fs.existsSync(dir))
                fsExtra.remove(dir, callback)
            else callback({message: "This file/folder not exists!"})
        }
        catch (err){
            callback(err)
        }
    }


    /** OTHERS **/

    /**
     * This function register all api user routes
     */
    private register(): void {
        this.moveFileToFolderRest();
        this.createFolderRest();
        this.downloadFileRest();
        this.deleteFileRest();

        this.App.debug("Registering all apiuser routes", this.props.prefix)
    }


    /**
     * This function starts the apiFile creating a data folder
     */
    private init(): void {
        if (!fs.existsSync(this.props.folderPath)){
            fs.mkdirSync(this.props.folderPath);
            this.App.debug("Creating data folder", this.props.prefix);
        }
    }


    /**
     * This function move file via api
     * Requeriments: (username, currentDir, newDir)
     */
    private moveFileToFolderRest(): void {
        this.server.get('/api/move-file-to-folder', (req: any, res: any) => {
            try {
                const bind = {
                    username: req.user.username,
                    currentDir: this.App.replaceAll(req.query.currentDir, "..", ""),
                    newDir: this.App.replaceAll(req.query.newDir, "..", "")
                };

                this.moveFileToFolder(bind.username, bind.currentDir, bind.newDir, (err: any) => {
                    if (err) this.App.throwErr(err, this.props.prefix, res)
                    else res.status(200).send("Ok!")
                })
            }
            catch (err){
                this.App.throwErr(err, this.props.prefix, res)
            }
        })
    }


    /**
     * This function creates a folder via api
     * Requeriments: (username, folder)
     */
    private createFolderRest(): void {
        this.server.get('/api/create-folder', (req: any, res: any) => {
            try {
                const bind = {
                    username: req.user.username,
                    folder: this.App.replaceAll(req.query.folder, "..", "")
                };

                this.createFolder(bind.username, bind.folder, (err: any) => {
                    if (err) this.App.throwErr(err, this.props.prefix, res)
                    else res.status(200).send("Ok!")
                })
            }
            catch (err){
                this.App.throwErr(err, this.props.prefix, res)
            }
        })
    }


    /**
     * This function send file via api
     * Requeriments: (username, file)
     */
    private downloadFileRest(){
        this.server.get('/api/download-file', (req: any, res: any) => {
            try {
                const bind = {
                    username: req.user.username,
                    file: req.query.file
                };

                res.download(`${this.props.folderPath}/${bind.username}/${bind.file}`)
            }
            catch (err){
                this.App.throwErr(err, this.props.prefix, res)
            }
        })
    }


    /**
     * This function deletes a file via api
     * Requeriments: (username, file)
     */
    private deleteFileRest(){
        this.server.get('/api/delete-file', (req: any, res: any) => {
            try {
                const bind = {
                    username: req.user.username,
                    file: req.query.file
                };

                this.deleteFile(bind.username, bind.file, (err: any) => {
                    if (err) return this.App.throwErr(err, this.props.prefix, res)
                    res.status(200).send("Ok!")
                })
            }
            catch (err){
                this.App.throwErr(err, this.props.prefix, res)
            }
        })
    }


    /**
     * This function removes from file list a banned files names
     * @param {Array} files
     * @return {Array} filesFiltered
     */
    private filterFiles(files: string[]): string[] {
        return files.filter(file => 
            !this.App.config.bannedFiles.includes(file)
        )
    }
}