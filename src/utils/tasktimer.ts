import App from "../app";

export default class TaskTimer {


    /** SMALL CONSTRUCTORS **/

    private prefix: String = "TASK";
    
    public id: number;
    public props = {
        name: "",
        callback: ""
    };

    public constructor(App: any, name: string, callback: Function, time: number){
        this.id = setInterval(callback, time)
        
        this.props = {
            name: name,
            callback: callback.toString()
        };

        App.tasks.push(this.props);
        App.debug(`New task created with data: ${JSON.stringify(this.props)}`, this.prefix)
    }


    /** REST **/

    /**
     * This function deletes the array for tasks list
     */
    public delete(): void {
        clearInterval(this.id);

        App.tasks.map((e, index) => {
            if (e.name == this.props.name)
                delete App.tasks[index]
        })
    }
}