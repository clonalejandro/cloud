/** FUNCTIONS **/

/**
 * This function redirects with timeout
 * @param {String} url 
 * @return {Number} timeoutId
 */
function redirect(url, timeout = 250){
    return setTimeout(() => window.location.href = url, timeout)
}


/**
 * This function create a alert with timeout
 */
function alertTimeout(){
    const notification = $("#notifications > .alert");
    const timeout = notification.data("timeout");
    
    if (timeout == undefined || timeout == null) return;
    return setTimeout(() => notification.fadeOut(300, () => $(this).remove()), timeout * 1000)
}


/**
 * This function checks if data isNull
 * @param {*} data 
 * @return {Boolean} isNull
 */
function isNull(data){
    return data == undefined || data == "" || data == null
}


/**
 * This function create a alert danger with message
 * @param {String} message 
 */
function throwErr(message){
    const html = `
        <div class="alert alert-dimissible alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <big><strong>Oops!</strong> An error has ocurred! <i class='fa fa-exclamation-triangle'></i></big><br>
            ${message}
        </div>
    `;
    
    $("#notifications").append(html);
}


/** METHODS **/

$(document).ready(() => {
    new LazyLoad(250);

});


$("#logout").on('click', () => redirect(`${webURI}/logout`));
$("img").on('dragstart', e => e.preventDefault());