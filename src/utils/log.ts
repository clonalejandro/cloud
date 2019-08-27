/** IMPORTS **/

import fs from 'fs';
import App from '../app';
import Math from './math';


/** FUNCTIONS **/

function formatDate(n: any){
    n = n.toString();
    return n.length > 1 ? n : `0${n}`
}


function createLogName(){
    const date = new Date();
    const d = {
        year: date.getFullYear(),
        month: formatDate(date.getMonth()),
        day: formatDate(date.getDate()),
        hour: formatDate(date.getHours()),
        min: formatDate(date.getMinutes()),
        sec: formatDate(date.getSeconds())
    };

    return `log${d.year}${d.month}${d.day}${d.hour}${d.min}${d.sec}.log`
}


export default class Log {


    /** SMALL CONSTRUCTORS **/

    public name: string;
    public logDir: string;

    public constructor(){
        this.name = createLogName();
        this.logDir = __dirname + "/../../../logs/";

        this.createLogDir();
        this.create();
    }


    /** REST **/

    /**
     * This function creates a log
     */
    private create(callback: any = undefined): void {
        fs.writeFile(this.logDir + this.name, `//This log was created at ${new Date()}`, err => {
            if (err) throw err;
            else {
                if (callback != undefined) callback();
                App.debug(`New log started wich name is ${this.name}`, "LOGS")
            }
        })
    }


    /**
     * This function creates a logDir
     * @param {String} dir
     */
    private createLogDir(dir: string = this.logDir): void {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    }


    /**
     * This function writes in the log
     * @param {String} text
     */
    public write(text: string): void {
        fs.appendFile(this.logDir + this.name, text, err => {
            if (err) throw err
        })
    }

    /**
     * This function rotate the log
     */
    public logRotate(): void {
        const log = this.logDir + this.name;
        const size = Math.bytesToMegas(
            fs.statSync(log).size
        );

        if (size >= 1024){
            const newName = createLogName();
            const lastName = this.name;

            this.write(`\n//Rotating this log to: "${newName}"`);

            this.name = newName;//Reasign the newname in the log properties

            this.create(() => this.write(`\n//Log rotated from: ${lastName}`))
        }
    }
}