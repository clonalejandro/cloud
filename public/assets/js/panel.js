String.prototype.replaceAll = function(charToReplace, newChar){
    let str = this;
    while (str.includes(charToReplace)) str = str.replace(charToReplace, newChar);
    return str
};


/** FUNCTIONS **/

/**
 * This function resolve full path from dir
 * @param {String} dirString 
 * @param {String} dir 
 */
function resolveFullPath(dirString, dir){
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

    dirString = dirString.replaceAll("%20", " ");

    dirString.split("/").forEach(dir => {
        if (!isNull(dir)) dirs.push({
            name: dir,
            fullPath: resolveFullPath(dirString, dir)
        })
    });//Fix the array removing empty elements

    return dirs
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
                <a class="nav-link route" href="/?dir=${row.fullPath}/">
                    <strong>${row.name}</strong>
                </a>
                <a class="prompt">
                    <i class="fa fa-angle-right nav-icon"></i>
                </a>
            `)
        });

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
    else $("#nav-router").append(html)
}


/** METHODS **/

$(document).ready(() => {
    new LazyLoad(250);
    makeNavRouter();
})