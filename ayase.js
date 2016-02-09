var LDPI = 3;
var MDPI = 4;
var HDPI = 6;
var XHDPI = 8;
var XXHDPI = 12;
var doResize = false;
var dirMaster = "";
var dirSlave = "";
var ratio = 1;

function fetchAllFiles(dir) {
    var fs = require('fs');
    var files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' +files[i];
        var fileName = files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(fileName);
        }
    }
    return files_;
}

function getState(dir) {
    if (dir.indexOf('drawable-ldpi') > -1 ) {
        return LDPI;
    } else if (dir.indexOf('drawable-mdpi') > -1) {
        return MDPI;
    } else if (dir.indexOf('drawable-hdpi') > -1) {
        return HDPI;
    } else if (dir.indexOf('drawable-xhdpi') > -1) {
        return XHDPI;
    } else if (dir.indexOf('drawable-xxhdpi') > -1) {
        return XXHDPI;
    } else {
        return -1;
    }
}

function isFileExist(fileMaster, arrFilesSlave, index) {
    var isExist = false;
    for (var i = 0; i < arrFilesSlave.length; i++) {
        if (fileMaster == arrFilesSlave[i]) {
            isExist = true;
        }
    }
    return isExist;
}

function isImage(file) {
    return (file.indexOf('jpg') > -1 || file.indexOf('png') > -1 || file.indexOf('gif') > -1);
}

function doCompare(arrFilesMaster, arrFilesSlave, index) {
    var isExist = isFileExist(arrFilesMaster[index], arrFilesSlave);
    if (!isExist) {
        copyFiles(arrFilesMaster[index]);
    }
    index++;
    if (index < arrFilesMaster.length) {
        doCompare(arrFilesMaster, arrFilesSlave, index);
    } else {
        console.log("Finish checking with total files master "+arrFilesMaster.length+" and total file slave "+arrFilesSlave.length);
        return;
    }
}

function getInputDir(fileMaster) {
    if (dirMaster.substr(-1) == "/") {
        return dirMaster+fileMaster;
    } else {
        return dirMaster+"/"+fileMaster;
    }
}

function getOutputDir(fileMaster) {
    if (dirSlave.substr(-1) == "/") {
        return dirSlave+fileMaster;
    } else {
        return dirSlave+"/"+fileMaster;
    }
}

function copyFiles(fileMaster) {
    var input = getInputDir(fileMaster);
    var output = getOutputDir(fileMaster);
    if (doResize && isImage(input)) {
        require('lwip').open(input, function(err, image){
          image.batch()
            .scale(ratio)
            .writeFile(output, function(err){

            });

        });
        console.log("copying and resizing file: "+fileMaster);
    } else {
        var copyFile = require('quickly-copy-file');

        copyFile(input, output, function(error) {
            if (error) return console.error(error);

            console.log("copying file: "+fileMaster);
        });
    }
}

function main() {
    if (process.argv.length > 3) {
        dirMaster = process.argv[2];
        dirSlave = process.argv[3];

        if (process.argv.length > 4 && process.argv[4] == "--no-resize") {
            doResize = false;
        } else {
            doResize = true;
        }

        var stateMaster = getState(dirMaster);
        var stateSlave = getState(dirSlave);

        if (stateMaster == -1 || stateSlave == -1) {
            console.error("not a valid drawable directory!!!");

            return;
        }

        ratio = stateSlave/stateMaster;

        var arrFilesMaster = fetchAllFiles(dirMaster);
        var arrFilesSlave = fetchAllFiles(dirSlave);

        doCompare(arrFilesMaster, arrFilesSlave, 0);
    } else {
        console.error("invalid argumment");
        console.log("Usage: node ayase.js <base directory> <slave directory> --no-resize (optional)")
    }
}

main();
