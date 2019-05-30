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
    return filename.slice(filename.lastIndexOf(".")+1, filename.length);
}


/**
 * This function resolve and image from extension
 * @param {String} extension 
 * @return {String} imageClass
 */
function resolveImageFromExtension(extension){
    switch (extension.toUpperCase()){
        default:
            return "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTYgNTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2IDU2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggc3R5bGU9ImZpbGw6I0U5RTlFMDsiIGQ9Ik0zNi45ODUsMEg3Ljk2M0M3LjE1NSwwLDYuNSwwLjY1NSw2LjUsMS45MjZWNTVjMCwwLjM0NSwwLjY1NSwxLDEuNDYzLDFoNDAuMDc0YzAuODA4LDAsMS40NjMtMC42NTUsMS40NjMtMVYxMi45NzhjMC0wLjY5Ni0wLjA5My0wLjkyLTAuMjU3LTEuMDg1TDM3LjYwNywwLjI1N0MzNy40NDIsMC4wOTMsMzcuMjE4LDAsMzYuOTg1LDB6Ii8+PHBvbHlnb24gc3R5bGU9ImZpbGw6I0Q5RDdDQTsiIHBvaW50cz0iMzcuNSwwLjE1MSAzNy41LDEyIDQ5LjM0OSwxMiAiLz48cGF0aCBzdHlsZT0iZmlsbDojQzhCREI4OyIgZD0iTTQ4LjAzNyw1Nkg3Ljk2M0M3LjE1NSw1Niw2LjUsNTUuMzQ1LDYuNSw1NC41MzdWMzloNDN2MTUuNTM3QzQ5LjUsNTUuMzQ1LDQ4Ljg0NSw1Niw0OC4wMzcsNTZ6Ii8+PGNpcmNsZSBzdHlsZT0iZmlsbDojRkZGRkZGOyIgY3g9IjE4LjUiIGN5PSI0NyIgcj0iMyIvPjxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGN4PSIyOC41IiBjeT0iNDciIHI9IjMiLz48Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBjeD0iMzguNSIgY3k9IjQ3IiByPSIzIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==";
        case "TXT":
            return "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTYgNTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2IDU2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggc3R5bGU9ImZpbGw6I0U5RTlFMDsiIGQ9Ik0zNi45ODUsMEg3Ljk2M0M3LjE1NSwwLDYuNSwwLjY1NSw2LjUsMS45MjZWNTVjMCwwLjM0NSwwLjY1NSwxLDEuNDYzLDFoNDAuMDc0YzAuODA4LDAsMS40NjMtMC42NTUsMS40NjMtMVYxMi45NzhjMC0wLjY5Ni0wLjA5My0wLjkyLTAuMjU3LTEuMDg1TDM3LjYwNywwLjI1N0MzNy40NDIsMC4wOTMsMzcuMjE4LDAsMzYuOTg1LDB6Ii8+PHBvbHlnb24gc3R5bGU9ImZpbGw6I0Q5RDdDQTsiIHBvaW50cz0iMzcuNSwwLjE1MSAzNy41LDEyIDQ5LjM0OSwxMiAiLz48cGF0aCBzdHlsZT0iZmlsbDojOTVBNUE1OyIgZD0iTTQ4LjAzNyw1Nkg3Ljk2M0M3LjE1NSw1Niw2LjUsNTUuMzQ1LDYuNSw1NC41MzdWMzloNDN2MTUuNTM3QzQ5LjUsNTUuMzQ1LDQ4Ljg0NSw1Niw0OC4wMzcsNTZ6Ii8+PGc+PHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0yMS44NjcsNDIuOTI0djEuMTIxaC0zLjAwOFY1M2gtMS42NTR2LTguOTU1aC0zLjAwOHYtMS4xMjFIMjEuODY3eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMjguNDQzLDQ4LjEwNUwzMSw1M2gtMS45bC0xLjYtMy44MDFoLTAuMTM3TDI1LjY0MSw1M2gtMS45bDIuNTU3LTQuODk1bC0yLjcyMS01LjE4MmgxLjg3M2wxLjc3Nyw0LjEwMmgwLjEzN2wxLjkyOC00LjEwMmgxLjg3M0wyOC40NDMsNDguMTA1eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNNDAuNTI5LDQyLjkyNHYxLjEyMWgtMy4wMDhWNTNoLTEuNjU0di04Ljk1NWgtMy4wMDh2LTEuMTIxSDQwLjUyOXoiLz48L2c+PHBhdGggc3R5bGU9ImZpbGw6I0M4QkRCODsiIGQ9Ik0xOC41LDEzaC02Yy0wLjU1MywwLTEtMC40NDgtMS0xczAuNDQ3LTEsMS0xaDZjMC41NTMsMCwxLDAuNDQ4LDEsMVMxOS4wNTMsMTMsMTguNSwxM3oiLz48cGF0aCBzdHlsZT0iZmlsbDojQzhCREI4OyIgZD0iTTIxLjUsMThoLTljLTAuNTUzLDAtMS0wLjQ0OC0xLTFzMC40NDctMSwxLTFoOWMwLjU1MywwLDEsMC40NDgsMSwxUzIyLjA1MywxOCwyMS41LDE4eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiNDOEJEQjg7IiBkPSJNMjUuNSwxOGMtMC4yNiwwLTAuNTIxLTAuMTEtMC43MS0wLjI5Yy0wLjE4MS0wLjE5LTAuMjktMC40NC0wLjI5LTAuNzFzMC4xMDktMC41MiwwLjMtMC43MWMwLjM2LTAuMzcsMS4wNC0wLjM3LDEuNDEsMGMwLjE4LDAuMTksMC4yOSwwLjQ1LDAuMjksMC43MWMwLDAuMjYtMC4xMSwwLjUyLTAuMjksMC43MUMyNi4wMiwxNy44OSwyNS43NiwxOCwyNS41LDE4eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiNDOEJEQjg7IiBkPSJNMzcuNSwxOGgtOGMtMC41NTMsMC0xLTAuNDQ4LTEtMXMwLjQ0Ny0xLDEtMWg4YzAuNTUzLDAsMSwwLjQ0OCwxLDFTMzguMDUzLDE4LDM3LjUsMTh6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0M4QkRCODsiIGQ9Ik0xMi41LDMzYy0wLjI2LDAtMC41MjEtMC4xMS0wLjcxLTAuMjljLTAuMTgxLTAuMTktMC4yOS0wLjQ1LTAuMjktMC43MWMwLTAuMjYsMC4xMDktMC41MiwwLjI5LTAuNzFjMC4zNy0wLjM3LDEuMDUtMC4zNywxLjQyLDAuMDFjMC4xOCwwLjE4LDAuMjksMC40NCwwLjI5LDAuN2MwLDAuMjYtMC4xMSwwLjUyLTAuMjksMC43MUMxMy4wMiwzMi44OSwxMi43NiwzMywxMi41LDMzeiIvPjxwYXRoIHN0eWxlPSJmaWxsOiNDOEJEQjg7IiBkPSJNMjQuNSwzM2gtOGMtMC41NTMsMC0xLTAuNDQ4LTEtMXMwLjQ0Ny0xLDEtMWg4YzAuNTUzLDAsMSwwLjQ0OCwxLDFTMjUuMDUzLDMzLDI0LjUsMzN6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0M4QkRCODsiIGQ9Ik00My41LDE4aC0yYy0wLjU1MywwLTEtMC40NDgtMS0xczAuNDQ3LTEsMS0xaDJjMC41NTMsMCwxLDAuNDQ4LDEsMVM0NC4wNTMsMTgsNDMuNSwxOHoiLz48cGF0aCBzdHlsZT0iZmlsbDojQzhCREI4OyIgZD0iTTM0LjUsMjNoLTIyYy0wLjU1MywwLTEtMC40NDgtMS0xczAuNDQ3LTEsMS0xaDIyYzAuNTUzLDAsMSwwLjQ0OCwxLDFTMzUuMDUzLDIzLDM0LjUsMjN6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0M4QkRCODsiIGQ9Ik00My41LDIzaC02Yy0wLjU1MywwLTEtMC40NDgtMS0xczAuNDQ3LTEsMS0xaDZjMC41NTMsMCwxLDAuNDQ4LDEsMVM0NC4wNTMsMjMsNDMuNSwyM3oiLz48cGF0aCBzdHlsZT0iZmlsbDojQzhCREI4OyIgZD0iTTE2LjUsMjhoLTRjLTAuNTUzLDAtMS0wLjQ0OC0xLTFzMC40NDctMSwxLTFoNGMwLjU1MywwLDEsMC40NDgsMSwxUzE3LjA1MywyOCwxNi41LDI4eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiNDOEJEQjg7IiBkPSJNMzAuNSwyOGgtMTBjLTAuNTUzLDAtMS0wLjQ0OC0xLTFzMC40NDctMSwxLTFoMTBjMC41NTMsMCwxLDAuNDQ4LDEsMVMzMS4wNTMsMjgsMzAuNSwyOHoiLz48cGF0aCBzdHlsZT0iZmlsbDojQzhCREI4OyIgZD0iTTQzLjUsMjhoLTljLTAuNTUzLDAtMS0wLjQ0OC0xLTFzMC40NDctMSwxLTFoOWMwLjU1MywwLDEsMC40NDgsMSwxUzQ0LjA1MywyOCw0My41LDI4eiIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4=";
    }
}


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


/**
 * This function render the files in the html
 */
function drawFiles(){
    $(".tempFile").each(index => {
        const file = $($("#tempFiles p")[index]).text();
        const filesContainer = $(".files");

        filesContainer.append(`
            <div class="file">
                <img src="${
                    resolveImageFromExtension(
                        resolveFileExtension(file)
                    )
                }"><br>
                <span class="badge badge-primary">${file}</span>
            </div>
        `);
    })
}


/** METHODS **/

$(document).ready(() => {
    new LazyLoad(250);
    makeNavRouter();
    drawFiles();
})