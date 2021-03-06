import { PiLanguage } from "../../../languagedef/metalanguage";
import { PiEditUnit } from "../../metalanguage";
import { LANGUAGE_GEN_FOLDER, Names, PROJECTITCORE, READER_GEN_FOLDER } from "../../../utils";

export class ReaderTemplate {

    /**
     * Returns a string representation of a generic parser for 'language'. This parser is able
     * to handle every modelunit in the language.
     */
    public generateParser(language: PiLanguage, editDef: PiEditUnit, relativePath: string): string {
        const unitNames = language.units.map(unit => Names.concept(unit));

        // Template starts here
        return `
        import { Parser } from "pegjs";
        import * as fs from "fs";
        import { ${Names.PiReader} } from "${PROJECTITCORE}";
        import { MODELUNIT, ModelUnitMetaType, ${unitNames.map(name => `${name}`).join(", ")} } from "${relativePath}${LANGUAGE_GEN_FOLDER }";   
              
        /**
         * All unit parsers generated by pegjs
         */
        ${language.units.map(unit => 
        `const ${Names.concept(unit)}Parser = require("./${Names.pegjs(unit)}");`).join("\n")}
        
        /**
        *   Class ${Names.reader(language)} is a wrapper for the various parsers of
        *   modelunits. It reads a file from disk, calls the javascript parser, and
        *   shows any syntax errors on the console.
        *   Note that property 'parser' should be set, before calling the method 'parse'.
        */
        export class ${Names.reader(language)} implements ${Names.PiReader} {
        
            readFromFile(filepath: string, metatype: ModelUnitMetaType): MODELUNIT {
                // read language file
                if (!fs.existsSync(filepath)) {
                    console.error(this, "File '" + filepath + "' does not exist, exiting.");
                    throw new Error(\`File '\${filepath}' not found.\`);
                }
                const langSpec: string = fs.readFileSync(filepath, { encoding: "UTF8" });
                return ${Names.reader(language)}.parse(langSpec, metatype, filepath);
            }

            readFromString(input: string, metatype: ModelUnitMetaType): MODELUNIT {
                return ${Names.reader(language)}.parse(input, metatype, "");
            }       
                 
            private static parse(langSpec: string, metatype: ModelUnitMetaType, filepath: string): MODELUNIT {
                // set the correct parser
                let parser: Parser; // one of the Javascript parser objects generated by pegjs.
                ${language.units.map(unit =>
                `if (metatype === "${Names.concept(unit)}") {
                    parser = ${Names.concept(unit)}Parser;
                }`).join("\n")}
                
                // parse the input
                let model: MODELUNIT = null;
                try {
                    model = parser.parse(langSpec);
                } catch (e) {
                    // show syntax error
                    // TODO find better way to handle error
                    const errorstr = \`\${!!filepath ? \`\${filepath}:\` : \`\`} \${e} \${e.location && e.location.start ? \`[line \${e.location.start.line}, column \${e.location.start.column}]\` : \`\`}\`;
                    console.error(errorstr);
                }
                return model;
            }
        }
        `;
        // end Template
    }
}
