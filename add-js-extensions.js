const fs = require("fs");
const path = require("path");

addJsExtensions();

function addJsExtensions() {
    const dir = path.join(__dirname, "dist");
    const files = getFiles(dir);
    for (const file of files) {
        processSingleFile(file);
    }
}

function processSingleFile(file) {
    const newLines = [];
    const lines = fs.readFileSync(file).toString().split("\n");
    const importRegex = new RegExp('from "[^ "]*"');

    for (const line of lines) {
        const importCheck = new RegExp("^import").test(line);
        const importLineInfo = importRegex.exec(line);
        if (importCheck && importLineInfo) {
            const newImportPath =
                importLineInfo.input.slice(0, importLineInfo.input.length - 2) +
                ".js" +
                importLineInfo.input.slice(importLineInfo.input.length - 2);
            const newImportLine = line.replace(
                importLineInfo.input,
                newImportPath,
            );
            newLines.push(newImportLine);
        } else {
            newLines.push(line);
        }
    }

    const newCode = newLines.join("\n");
    fs.writeFileSync(file, newCode);
}

// Recursive function to get files
function getFiles(dir, files = []) {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        // Check if the current file/directory is a directory using fs.statSync
        if (fs.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            getFiles(name, files);
        } else {
            // If it is a file, push the full path to the files array
            files.push(name);
        }
    }
    return files;
}
