import * as fs from "fs";

const path = require("path");
/**
 * startPath: the folder where the files should be located
 * extension: a regular expression to filter the filenames found
 */
export function findFiles(startPath: string, extension?: string): string[] {
    if (!fs.existsSync(startPath)) {
        console.error(this, "cannot find folder '" + startPath + "'");
        return [];
    }
    if (!fs.lstatSync(startPath).isDirectory()) {
        console.error(this, "'" + startPath + "' is not a folder");
        return [];
    }

    const result: string[] = [];
    const files = fs.readdirSync(startPath);
    for (const file of files) {
        const filename = path.join(startPath, file);
        const stat = fs.lstatSync(filename);
        if (!stat.isDirectory()) {
            if (extension === undefined) {
                result.push(filename);
            } else {
                const regex = new RegExp(`\\${extension}\$`);
                if (regex.test(filename)) {
                    result.push(filename);
                }
            }
        }
    }
    return result;
}
