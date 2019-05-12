/** IMPORTS **/

import express from 'express';


export default class App {


    /** SMALL CONSTRUCTORS **/

    public server: express.Application

    constructor(server: express.Application){
        this.server = server
    }


    /** REST **/

    public start(port: number): void {
        this.server.listen(port, () => {
            console.log(`Starting cloud server listen port: ${port}`)
        })
    }


}