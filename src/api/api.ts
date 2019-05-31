/** IMPORTS **/

import ApiFile from './apifile';
import ApiUser from './apiuser';


/** REST **/

export default class Api {


    /** SMALL CONSTRUCTOS **/

    private server: any;
    private App: any;

    public ApiFile: ApiFile;
    public ApiUser: ApiUser;

    public constructor(App: any, server: any){
        this.ApiFile = new ApiFile(App, server);
        this.ApiUser = new ApiUser(App, server);
    }
}