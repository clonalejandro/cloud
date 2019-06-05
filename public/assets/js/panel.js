String.prototype.replaceAll = function(charToReplace, newChar){
    let str = this;
    while (str.includes(charToReplace)) str = str.replace(charToReplace, newChar);
    return str
};

var openSettings = false;


/** FUNCTIONS **/

/**
 * This function resolves the file extension from filename
 * @param {String} filename 
 * @return {String} extension
 */
function resolveFileExtension(filename){
    if (!filename.includes(".")) return;
    return filename.slice(filename.lastIndexOf(".")+1, filename.length).toLowerCase()
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
    
        folder.on('click', () => {
            if (!openSettings)
                redirect(`${webURI}/?dir=${currentDir}${encodeURI(
                    folder.find("span").text()
                )}`)
        })
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
                <a id="newFolder" class="dropdown-item">
                    <i class="fa fa-folder"></i>
                     New folder
                </a>
                <a id="uploadFile" class="dropdown-item">
                    <i class="fa fa-upload"></i>
                     Upload file
                </a>
            </div>
    `)
}


/**
 * This function makes the drop in the body
 */
function makeDroppableBody(){
    return $("#drop form").on("drop", e => uploadFilesRequest(e.originalEvent.dataTransfer.files))
}


/**
 * This function makes the drop in the folders
 */
function makeDroppableFolder(){
    return $('.file[data-type="folder"]').droppable({
        accept: '.file',
        drop: (e, ui) => {
            $(e.target).find("img").removeClass("dragOn");
            $(e.target).find("span").removeClass("dragOn");//Remove the hover classes

            const dirTarget = encodeURI($(e.target).find("span").text());
            const fileTarget = $(ui.draggable).find("span").text();
            
            const fixInitSlash = str => str.startsWith("/") ? str.slice(1, str.length) : str;
            const fixEndSlash = str => str.endsWith("/") ? str : str.concat("/");

            const dir = new URLSearchParams(window.location.search).get("dir");

            const bind = {
                newDir: fixEndSlash(isNull(dir) ? "/" : dir) + dirTarget + "/" + fileTarget,
                currentDir: fixEndSlash(isNull(dir) ? "/" : dir) + fileTarget
            }//Remember that the api adds a slash to the route

            bind.newDir = fixInitSlash(bind.newDir);
            bind.currentDir = fixInitSlash(bind.currentDir);

            moveFileRequest(bind, () => {
                $(ui.draggable).remove();
                console.log("File transfered with data: ", bind)
            })
        },
        over: (e, ui) => {
            $(e.target).find("img").addClass("dragOn");
            $(e.target).find("span").addClass("dragOn")
        },
        out: (e, ui) => {
            $(e.target).find("img").removeClass("dragOn");
            $(e.target).find("span").removeClass("dragOn")
        }
    })
}


/**
 * This function makes the drop in the nav route
 */
function makeDroppableNavRoute(){
    return $('.route').droppable({
        accept: '.file',
        drop: (e, ui) => {
            $(e.target).children().removeClass("dragOn");//Remove the hover classes

            const dirTarget = $(e.target).data("dir");
            const fileTarget = $(ui.draggable).find("span").text();
            
            const fixInitSlash = str => str.startsWith("/") ? str.slice(1, str.length) : str;
            const fixEndSlash = str => str.endsWith("/") ? str : str.concat("/");

            const bind = {
                newDir: dirTarget + "/" + fileTarget,
                currentDir: fixEndSlash(new URLSearchParams(window.location.search).get("dir")) + fileTarget
            }

            bind.newDir = fixInitSlash(bind.newDir);
            bind.currentDir = fixInitSlash(bind.currentDir);

            moveFileRequest(bind, () => {
                $(ui.draggable).remove();
                console.log("File transfered with data: ", bind)
            })
        },
        over: (e, ui) => $(e.target).children().addClass("dragOn"),
        out: (e, ui) => $(e.target).children().removeClass("dragOn")
    })
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
            <div class="file" data-type="${isNull(resolveFileExtension(file)) ? "folder" : "file"}">
                <img class="file-${
                    isNull(resolveFileExtension(file)) ? "folder" : resolveFileExtension(file)
                }"><br>
                <span class="badge badge-secondary">${file}</span>
                <a class="settings dropdown-toggle" id="settingsSubmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-ellipsis-v"></i>
                </a>
                <div id="settingsSubmenu" class="dropdown-menu settingsSubmenu" aria-labelledby="settingsSubmenu">
                    <a class="dropdown-item share">
                        <i class="fa fa-share-alt"></i>
                        Share
                    </a>
                    <a class="dropdown-item unshare">
                        <i class="fa fa-undo"></i> 
                        Unshare
                    </a>
                    <a class="dropdown-item delete">
                        <i class="fa fa-trash"></i>  
                        Delete
                    </a>
                </div>
            </div>
        `);
    });

    makeDraggableFile($(".file"))
}


/**
 * This function creates a folder when submit the modal newFolder
 */
function processCreateFolder(){
    const input = $("#modalNewFolder form input[name='folder']")
    const dir = new URLSearchParams(window.location.search).get("dir");

    const fixInitSlash = str => str.startsWith("/") ? str.slice(1, str.length) : str;
    const fixEndSlash = str => str.endsWith("/") ? str : str.concat("/");

    const bind = {
        folder: fixEndSlash(fixInitSlash(isNull(dir) ? "/" : dir)) + input.val()
    };

    createFolderRequest(bind, () => $("#modalNewFolder").fadeOut(350, () => {
        $("#modalNewFolder").modal('show');
        redirect(window.location.href)
    }))
}


/** REQUESTS **/

function moveFileRequest(bind, callback){
    new Request(`${webURI}/api/move-file-to-folder?currentDir=${bind.currentDir}&newDir=${bind.newDir}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") callback()
        else throwErr(e.responseText)
    }, `currentDir=${bind.currentDir}&newDir=${bind.newDir}`)
}


function createFolderRequest(bind, callback){
    new Request(`${webURI}/api/create-folder?folder=${bind.folder}`, "GET", e => {
        console.log(e);
        if (e.status == 200 || e.responseText == "Ok!") callback();
        else throwErr(e.responseText)
    }, `folder=${bind.folder}`)
}


function uploadFilesRequest(files){
    const $form = $("#drop form");
    const $input = $("#drop form input[type='file']");
    const $bar = $("#drop .prog .progress-bar");
    const ajaxData = new FormData($form.get(0));
    
    if (files) $.each(files, (i, file) => ajaxData.append($input.attr('name'), file, file.name));

    if ($(".def").hasClass("hide")) $(".def").removeClass("hide")
    if (!$(".nodef").hasClass("hide")) $(".nodef").removeClass("hide")

    $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: ajaxData,
        xhr: () => {
            const req = $.ajaxSettings.xhr();

            req.upload.addEventListener("loadstart", e => {
                $form[0].reset();
            });

            req.upload.addEventListener("progress", e => {
                $("#drop .prog").removeClass("hide");

                if (e.lengthComputable){
                    const percent = Math.round(e.loaded / e.total * 100);
                    
                    $("#drop .prog .percent").html(percent + "%");

                    console.debug("Parsed upload: ", percent, "Noparsed upload: ", e.loaded / e.total * 100)
                    
                    $bar.css({width: percent});
                    $bar.attr("aria-valuenow", percent);
                }
            }, false)

            return req
        },
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        complete: e => {
            $("#wrapper").removeClass("dragOn");
            $("#drop").fadeOut(350, () => $(this).removeClass("hide"));
            
            $(".def").addClass("hide");
            $(".nodef").removeClass("hide");

            $("#drop .prog").addClass("hide");
            $("#drop .prog .percent").html("0%");
            
            $bar.css({width: 0});
            $bar.attr("aria-valuenow", 0);

            if (e.responseText == "Ok!") redirect(window.location.href);
            else throwErr(e.responseText || e.statusText);
        }
    })
}


/** METHODS **/

$(document).ready(() => {
    new LazyLoad(250);
    makeNavRouter();
    makeNavActionButton();
    drawFiles();
    fixFileEvents();
    makeFoldersAccesible();
    makeDroppableNavRoute();
    makeDroppableFolder();
    makeDroppableBody();
    navButtonEvents();
});


/** EVENTS **/

$('#drop').on('drag dragstart dragend dragover dragenter dragleave drop', e => {
    e.preventDefault();
    e.stopPropagation();
    return false
});

$('body').on('dragenter', e => {
    $("#wrapper").addClass("dragOn");
    $("#drop").fadeIn(350, () => $(this).removeClass("hide"))
});

$("#drop #close").on('click', () => {
    $("#wrapper").removeClass("dragOn");
    $("#drop").fadeOut(350, () => $(this).removeClass("hide"))
});

$("#drop form input[type='file']").on('change', e => uploadFilesRequest(e.target.files));

$(".btn#back").on('click', () => {
    const routes = $("#nav-router").find(".route");
    const last = routes.get(routes.length-2);//For get the last element because the last is a button
    var uri = last.href;

    uri = uri.slice(0, uri.lastIndexOf("/")+1);//Removes the last dir from url

    redirect(uri);
});

$("#modalNewFolder form").on('submit', e => e.preventDefault());


function navButtonEvents(){
    $("#uploadFile").on('click', () => {
        $("#wrapper").addClass("dragOn");
        $("#drop").fadeIn(350, () => $(this).removeClass("hide"));
    });

    $("#newFolder").on('click', () => $("#modalNewFolder").modal('show'))
}

function fixFileEvents(){
    $(".settings").on('click', e => {
        openSettings = true;//Set true for stop click event file
        setTimeout(() => openSettings = false, 200)//Set false for enable click event file
    });

    $("#settingsSubmenu .delete").on('click', e => {
        const file = $(e.target).parent().parent();
        const fileName = file.find("span").text();
        var currentDir = new URLSearchParams(window.location.search).get("dir");

        if (isNull(currentDir)) currentDir = "/"; //If is null default dir is /
    
        if (currentDir.charAt(currentDir.length -1) != "/") 
            currentDir = currentDir.concat("/")//Add the last slash if this not have
        
        const bind = {
            currentDir: currentDir + fileName,
            newDir: "/temp_bin/" + fileName
        };

        moveFileRequest(bind, () => file.fadeOut(350, () => $(this).remove()))
    })
}