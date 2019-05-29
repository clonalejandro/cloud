/** IMPORTS ***/

import mongoose from "mongoose";


export default class Mongo {


    /** SMALL CONSTRUCTORS **/

    private uri: string;
    private App: any;
    private prefix: string;

    public instance: mongoose.Mongoose = mongoose;

    public constructor(App: any){
        const config = App.config;

        this.App = App;
        this.uri = config.database.uri;
        this.prefix = "MONGO";

        this.start()
    }


    /** REST **/
    
    /**
     * This function start the mongo connection
     * @return {Mongo}
     */
    public start(): Mongo {
        this.instance.connect(this.uri, {
            useNewUrlParser: true,
            reconnectTries: Number.MAX_VALUE
        }, 
        err => {
            if (err) this.App.throwErr(err, this.prefix)
            else this.App.debug("Database connected!", this.prefix)
        });

        return this
    }


    /**
     * This function stops the mongo connection
     * @return {Mongo}
     */
    public stop(): Mongo {
        this.instance.disconnect(err => {
            if (err) this.App.throwErr(err, this.prefix)
            else this.App.debug("Database disconnected!", this.prefix)
        });

        return this
    }
}