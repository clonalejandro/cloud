String.prototype.replaceAll = function(charToReplace, newChar){
    let str = this;
    while (str.includes(charToReplace)) str = str.replace(charToReplace, newChar);
    return str
};


/** FUNCTIONS **/

/**
 * This function resolves the file extension from filename
 * @param {String} filename 
 * @return {String} extension
 */
function resolveFileExtension(filename){
    if (!filename.includes(".")) return;
    return filename.slice(filename.lastIndexOf(".")+1, filename.length)
}


/**
 * This function resolve full path from dir
 * @param {String} dirString 
 * @param {String} dir 
 */
function resolveFullPath(dirString, dir){
    dirString = encodeURI(dirString);
    dir = encodeURI(dir);

    let temp = dirString.replaceAll("/", " ");
    return temp.slice(0, temp.indexOf(dir) + dir.length).replaceAll(" ", "/")
}


/**
 * This function get dirs from the url
 * @return {Array} Dirs
 */
function deserailizeDirFromUrl(){
    const url = new URLSearchParams(window.location.search);
    const dirs = new Array();
    let dirString = url.get("dir");
    
    if (isNull(dirString)) return;

    dirString = decodeURI(dirString);

    dirString.split("/").forEach(dir => {
        if (!isNull(dir)) dirs.push({
            name: dir,
            fullPath: resolveFullPath(dirString, dir)
        })
    });//Fix the array removing empty elements

    return dirs
}


/**
 * This function register onclick folder event
 */
function makeFoldersAccesible(){
    $(".file-folder").each(index => {
        const folder = $($(".file-folder")[index]).parent();
        var currentDir = new URLSearchParams(window.location.search).get("dir");

        if (isNull(currentDir)) currentDir = "/"; //If is null default dir is /
    
        if (currentDir.charAt(currentDir.length -1) != "/") 
            currentDir = currentDir.concat("/")//Add the last slash if this not have
    
        folder.on('click', () => redirect(`${webURI}/?dir=${currentDir}${encodeURI(folder.find("span").text())}`))
    })
}


/**
 * This function mount the html in the nav routes
 * @param {String} html 
 */
function makeNavRouter(html = undefined){
    if (!html){
        const dirs = deserailizeDirFromUrl();
        
        if (isNull(dirs)) return;

        dirs.forEach(row => {
            makeNavRouter(`
                <a class="nav-link route" href="/?dir=${encodeURI(row.fullPath)}" data-dir="${row.fullPath}">
                    <strong>${row.name}</strong>
                </a>
                <a class="prompt">
                    <i class="fa fa-angle-right nav-icon"></i>
                </a>
            `)
        });
    }
    else $("#nav-router").append(html)
}


/**
 * This function draws a button in the navroute
 */
function makeNavActionButton(){
    $("#nav-router").append(`
            <a class="nav-link route btn btn-secondary dropdown-toggle" href="#" id="fileSubmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-plus"></i>
            </a>
            <div class="dropdown-menu" aria-labelledby="fileSubmenu">
                <a class="dropdown-item">
                    <i class="fa fa-file"></i>
                     New file
                </a>
                <a class="dropdown-item">
                    <i class="fa fa-folder"></i>
                     New folder
                </a>
                <a class="dropdown-item">
                    <i class="fa fa-upload"></i>
                     Upload file
                </a>
            </div>
    `);
}


/**
 * This function makes the drop in the nav route
 */
function makeDroppableNavRoute(){
    return $('.route').droppable({
        accept: '.file',
        drop: (e, ui) => {
            $(e.target).children().removeClass("dragOn");
            $(ui.draggable).remove();

            const dirTarget = $(e.target).data("dir");
            const fileTarget = $(ui.draggable).find("span").text();

            const bind = {
                newDir: dirTarget + fileTarget,
                currentDir: new URLSearchParams(window.location.search).get("dir") + "/" + fileTarget
            }

            const fixSlash = str => str.startsWith("/") ? str.slice(1, str.length) : str;

            bind.newDir = fixSlash(bind.newDir);
            bind.currentDir = fixSlash(bind.currentDir);

            

            moveFileRequest(bind, () => console.log("File transfered with data: ", bind))
        },
        over: (e, ui) => $(e.target).children().addClass("dragOn"),
        out: (e, ui) => $(e.target).children().removeClass("dragOn")
    });

    //TODO make folders droppable
}


/**
 * This function makes a fileHtml as draggable
 * @param {*} fileHtml 
 */
function makeDraggableFile(fileHtml){
    return $(fileHtml).draggable({revert: true});
}


/**
 * This function render the files in the html
 */
function drawFiles(){
    $(".tempFile").each(index => {
        const file = $($("#tempFiles p")[index]).text();
        const filesContainer = $(".files");

        filesContainer.append(`
            <div class="file">
                <img class="file-${
                    isNull(resolveFileExtension(file)) ? "folder" : resolveFileExtension(file)
                }"><br>
                <span class="badge badge-secondary">${file}</span>
            </div>
        `);
    });

    makeDraggableFile($(".file"))
}


/** REQUESTS **/

function moveFileRequest(bind, callback){
    new Request(`${webURI}/api/move-file-to-folder?currentDir=${bind.currentDir}&newDir=${bind.newDir}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") callback();
        else throwErr(e.responseText);
    }, `currentDir=${bind.currentDir}&newDir=${bind.newDir}`)
}


/** METHODS **/

$(document).ready(() => {
    new LazyLoad(250);
    makeNavRouter();
    makeNavActionButton();
    drawFiles();
    makeDroppableNavRoute();
    makeFoldersAccesible();
})
