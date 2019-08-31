/** MAIN VARS **/
const binds = [];
var formDivs = [];
var app = {
    context: 0//The steps of the installation
};

/** FUNCTIONAL **/

(function setForms(){
    formDivs = $("form div");

    for (let i = 0; i < 4; i++){
        const input = $(formDivs[i]).find("input");
        
        $(formDivs[i]).removeClass("hidden");
        
        if (input.attr("type") != "checkbox" && input.attr("data-role") != "tagsinput") 
            input.attr("required", "")
    }
    //Unhides the first 4 divs
})();


/**
 * This function hide all inputs
 */
function hideInputs(){
    for (let i = 0; i < formDivs.length; i++)
        if ($(formDivs[i]).attr("id") != "submiter")
            $(formDivs[i]).addClass("hidden")
}


/**
 * This function alternates the inputs
 * @param {Number} from 
 * @param {Number} to 
 */
function segmentForm(from, to){
    hideInputs();//hide all inputs

    for (let i = from; i < to; i++){
        const input = $(formDivs[i]).find("input");
        
        $(formDivs[i]).removeClass("hidden");
        
        if (input.attr("type") != "checkbox" && input.attr("data-role") != "tagsinput" && !input.parent().hasClass("bootstrap-tagsinput")) 
            input.attr("required", "")
    }
    //unhide the inputs passed by parameters
}


/**
 * This function returns a jQuery input
 * @param {String} name 
 */
function $getInput(name){
    return $(`input[name='${name}']`)
}


/**
 * This function set the step of the form
 * @param {Number} n 
 */
function setStep(n){
    $("#progress h4").html(`Proccess ${n}/5`);
    app.context = n -1;
}


/** EVENTS **/

$("form").on('submit', e => {
    var context = app.context;

    switch (context){
        default:
            binds.push({
                debug: $getInput("debug").prop("checked"),
                port: parseInt($getInput("port").val()),
                apiKey: $getInput("apiKey").val(),
                logo: $getInput("logo").val()
            });

            setStep(2);
            segmentForm(4, 6);
            break
        case 1:
            binds.push({
                webName: $getInput("webName").val(),
                description: $getInput("description").val()
            });

            setStep(3);
            segmentForm(6, 8);
            break
        case 2:
            binds.push({
                tagsString: $getInput("tagsString").val(),
                email: $getInput("email").val()
            });

            setStep(4);
            segmentForm(8, 12);
            break
        case 3:
            binds.push({
                webURI: $getInput("webURI").val(),
                blob: {
                    abortOnLimit: $getInput("abortOnLimit").prop("checked"),
                    responseOnLimit: $getInput("responseOnLimit").val()
                },
                database: {
                    uri: $getInput("mongo").val()
                }
            });

            setStep(5);
            hideInputs();
            $("form button").text("Install");
            break
        case 4:
            const res = {
                installed: true,
                session: {
                    secret: generatePassword(),
                    resave: false,
                    saveUninitialized: false,
                    cookie: {
                        maxAge: 2592000000
                    }
                },
                bannedFiles: [
                    ".DS_Store",
                    "temp_bin" 
                ]
            };

            const webURI = window.location.href;

            $("form button").text("Installing...");

            binds.forEach(obj => Object.assign(res, obj));//Merge all data to json object

            new Request(`${webURI}api/create-config?res=${JSON.stringify(res)}`, "POST", e => {
                if (e.status == 200 || e.responseText == "Ok!"){
                    $("form button").text("Installed!");
                    //TODO: prints green tick
                }
                else alert(e.responseText || e.statusText)
            }, `res=${JSON.stringify(res)}`);
            break
    }

    return false
});