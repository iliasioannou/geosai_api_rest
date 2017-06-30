"use strict";
const validator = require("validator");
const logger = require("./log");
const fs = require("fs");

let logMetadata = {
    module: "utils.filesystem",
    method: ""
};


const moveFile = function(fromAbsolutePathToFile, toAbsolutePathToFile) {
    logMetadata.method = "moveFile";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("fromAbsolutePathToFile: %s", fromAbsolutePathToFile, logMetadata);
    logger.log.debug("toAbsolutePathToFile: %s", toAbsolutePathToFile, logMetadata);

    return new Promise(function(resolve, reject) {
        if (fromAbsolutePathToFile == undefined || fromAbsolutePathToFile == null) {
            logger.log.error("Empty fromAbsolutePathToFile", logMetadata);
            reject("Empty fromAbsolutePathToFile");
            return;
        };
        if (toAbsolutePathToFile == undefined || toAbsolutePathToFile == null) {
            logger.log.error("Empty toAbsolutePathToFile", logMetadata);
            reject("Empty toAbsolutePathToFile");
            return;
        };

        fs.rename(fromAbsolutePathToFile, toAbsolutePathToFile, (err) => {
            if (err) {
                if (err.code === 'EXDEV') {
                    copyFile(fromAbsolutePathToFile, toAbsolutePathToFile)
                        .then(function(msg) {
                            logger.log.debug("Attach deleted", logMetadata);
                            resolve(true);
                        })
                        .catch(function(err) {
                            logger.log.error(err, logMetadata);
                            logger.log.error(err.stack, logMetadata);
                            reject(err);
                        });
                }
                else {
                    logger.log.error(err, logMetadata);
                    logger.log.error(err.stack, logMetadata);
                    reject(err);
                }
            }
            else{
                resolve(true);
            }
        });
    })
}

const copyFile = function(fromAbsolutePathToFile, toAbsolutePathToFile) {
    logMetadata.method = "copyFile";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("fromAbsolutePathToFile: %s", fromAbsolutePathToFile, logMetadata);
    logger.log.debug("toAbsolutePathToFile: %s", toAbsolutePathToFile, logMetadata);

    return new Promise(function(resolve, reject) {
        if (fromAbsolutePathToFile == undefined || fromAbsolutePathToFile == null) {
            logger.log.error("Empty fromAbsolutePathToFile", logMetadata);
            reject("Empty fromAbsolutePathToFile");
            return;
        };
        if (toAbsolutePathToFile == undefined || toAbsolutePathToFile == null) {
            logger.log.error("Empty toAbsolutePathToFile", logMetadata);
            reject("Empty toAbsolutePathToFile");
            return;
        };

        let readStream = fs.createReadStream(fromAbsolutePathToFile);
        let writeStream = fs.createWriteStream(toAbsolutePathToFile);

        readStream.on("error", (err) => {
            logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
            logger.log.error(err.stack, logMetadata);
            reject(err);
        });
        writeStream.on("error", (err) => {
            logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
            logger.log.error(err.stack, logMetadata);
            reject(err);
        });
        writeStream.on("close", () => {
            logger.log.debug("Close and unlink file %s", fromAbsolutePathToFile, logMetadata);
            fs.unlink(fromAbsolutePathToFile, (err) => {
                if (err) {
                    logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
                    logger.log.error(err.stack, logMetadata);
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });

        readStream.pipe(writeStream);
    })
}


const removeFile = function(absolutePathToFile) {
    logMetadata.method = "removeFile";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("absolutePathToFile: %s", absolutePathToFile, logMetadata);

    return new Promise(function(resolve, reject) {
        if (absolutePathToFile == undefined || absolutePathToFile == null) {
            logger.log.error("Empty absolutePathToFile", logMetadata);
            reject("Empty absolutePathToFile");
            return;
        };
        fs.unlink(absolutePathToFile, (err) => {
            if (err) {
                logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
                logger.log.error(err.stack, logMetadata);
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    })
}

const removeFileSync = function(absolutePathToFile) {
    logMetadata.method = "removeFileSync";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("absolutePathToFile: %s", absolutePathToFile, logMetadata);

    if (absolutePathToFile == undefined || absolutePathToFile == null) {
        logger.log.error("Empty absolutePathToFile", logMetadata);
        return false;
    };

    if (fs.existsSync(absolutePathToFile)){
        logger.log.debug("File <%s> exist, delete it", absolutePathToFile, logMetadata);
        fs.unlinkSync(absolutePathToFile);
    }
    return !fs.existsSync(absolutePathToFile);
}

const removeFolderRecursive = function(absolutePathToFolder) {
    logMetadata.method = "removeFolderRecursive";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("absolutePathToFolder: %s", absolutePathToFolder, logMetadata);

    return new Promise(function(resolve, reject) {
        if (absolutePathToFolder == undefined || absolutePathToFolder == null) {
            logger.log.error("Empty absolutePathToFolder", logMetadata);
            reject("Empty absolutePathToFolder");
            return;
        };
        if( fs.existsSync(absolutePathToFolder) ) {
            fs.readdirSync(absolutePathToFolder).forEach(function(file,index){
              var curPath = absolutePathToFolder + "/" + file;
              if(fs.lstatSync(curPath).isDirectory()) { // recurse
                removeFolderRecursive(curPath)
                .then(function(msg) {
                            resolve(true);
                        })
                .catch(function(err) {
                    logger.log.error(err, logMetadata);
                    logger.log.error(err.stack, logMetadata);
                    reject(err);
                });
              } else { // delete file
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(absolutePathToFolder);
          }
          resolve(true);
    })
}


const removeFolderRecursiveSync = function(absolutePathToFolder) {
    logMetadata.method = "removeFolderRecursiveSync";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("absolutePathToFolder: %s", absolutePathToFolder, logMetadata);

    if (absolutePathToFolder == undefined || absolutePathToFolder == null) {
        logger.log.error("Empty absolutePathToFolder", logMetadata);
        return false;
    };
    if( fs.existsSync(absolutePathToFolder) ) {
        fs.readdirSync(absolutePathToFolder).forEach(function(file,index){
          var curPath = absolutePathToFolder + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            removeFolderRecursiveSync(curPath)
           }
           else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(absolutePathToFolder);
      }
      return true;
}

const existFile = function(absolutePathToFile) {
    logMetadata.method = "existFile";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("absolutePathToFile: %s", absolutePathToFile, logMetadata);

    return new Promise(function(resolve, reject) {
        if (absolutePathToFile == undefined || absolutePathToFile == null) {
            logger.log.error("Empty absolutePathToFile", logMetadata);
            reject("Empty absolutePathToFile");
            return;
        };

        fs.access(absolutePathToFile, fs.F_OK, (err) => {
            if (err) {
                logger.log.debug("File %s NOT exist. Error: %s", absolutePathToFile, JSON.stringify(err), logMetadata);
                resolve(false);
            }
            else {
                logger.log.debug("File %s exist", absolutePathToFile, logMetadata);
                resolve(true);
            }
        });
    })
}


const mkdir = function(absolutePath) {
    logMetadata.method = "mkdir";
    logger.log.debug(logger.utils.dividerDots, logMetadata);
    logger.log.debug("absolutePath: %s", absolutePath, logMetadata);

    return new Promise(function(resolve, reject) {
        if (absolutePath == undefined || absolutePath == null) {
            logger.log.error("Empty absolutePath", logMetadata);
            reject("Empty absolutePath");
            return;
        };

        fs.mkdir(absolutePath, (err) => {
            if (err) {
                if (err.code === "EEXIST") {
                    logger.log.warn("Folder <%s> already exixt", absolutePath, logMetadata);
                    resolve(true);
                }
                else {
                    logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
                    logger.log.error(err.stack, logMetadata);
                    reject(err);
                }
            }
            else {
                logger.log.debug("Folder %s created", absolutePath, logMetadata);
                resolve(true);
            }
        })            

/*
        existFile(absolutePath)
        .then(function(exist){
            if (exist){
                logger.log.debug("Folder <%s> already exist.", absolutePath, logMetadata);
                resolve(true);
            }
            else{
                logger.log.debug("Folder <%s> not exist. Create it", absolutePath, logMetadata);
                fs.mkdir(absolutePath, (err) => {
                    if (err) {
                        logger.log.error("Error: %s", JSON.stringify(err), logMetadata);
                        reject(err);
                    }
                    else {
                        logger.log.debug("Folder %s created", absolutePath, logMetadata);
                        resolve(true);
                    }
                });
            }
        })
        .catch(function(err){
            logger.log.error(err, logMetadata);
            logger.log.error(err.stack, logMetadata);
            reject(err);
        })
*/
   
    })      
}

// Public
var pub = {
    moveFile: moveFile,
    existFile: existFile,
    copyFile: copyFile,
    mkdir: mkdir,
    removeFile: removeFile,
    removeFileSync: removeFileSync,
    removeFolderRecursive: removeFolderRecursive,
    removeFolderRecursiveSync: removeFolderRecursiveSync
}


module.exports = pub;
