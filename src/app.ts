/** IMPORTS **/

import express from 'express';
import Color from './utils/color';


export default class App {


    /** SMALL CONSTRUCTORS **/

    public server: express.Application

    constructor(server: express.Application){
        this.server = server
    }


    /** REST **/

    /**
     * This function replace all
     * @param {String || Object} data
     * @param {String} charToReplace charToReplace
     * @param {String} newChar newChar
     * @return {String} data
     */
    static replaceAll(data: any, charToReplace: string, newChar = ""): string {
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
    static isNull(data: any): boolean {
        return data == null || data  == undefined
    }


    /**
     * This function debug data passed by parameter
     * @param {String || Object} data message to debug
     * @param {String} type
     */
    static debug(data: any, type = "INFO"): void {
        const prefix = `[${type}]`;
        const prompt = " ⇒ ";

        data = (data instanceof Object ? JSON.stringify(data) : data);

        if (prefix.includes("ERROR")) console.log(Color.FgRed + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("ALERT")) console.log(Color.FgYellow + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("TEST")) console.log(Color.FgCyan + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else console.log(Color.FgBlue + prefix + Color.FgMagenta + prompt + Color.Reset + data)
    }


    /**
     * This function starts the server
     * @param {Number} port 
     */
    public start(port: number): void {
        this.server.listen(port, () => {
            App.debug(`Starting cloud server listen port: ${port}`)
        })
    }


}