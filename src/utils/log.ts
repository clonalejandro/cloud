/** IMPORTS **/

import fs from 'fs';
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
    private create(): void {
        fs.writeFile(this.logDir + this.name, `//This log was created at ${new Date()}`, err => {
            if (err) throw err;
            else console.log(`New log started wich name is ${this.name}`)
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

            this.write(`\nRotating this log to: "${newName}"`);

            this.create();
            this.write(`Log rotated from: ${lastName}`)
        }
    }
}