import { PiTyperParser } from "../parser/PiTyperParser";
import { PiLanguageUnit } from "../../languagedef/metalanguage";
import { LanguageParser } from "../../languagedef/parser/LanguageParser";

describe("Checking typer on checking errors", () => {
    let testdir = "src/typerdef/__tests__/faultyDefFiles/syntax-errors/";
    let parser: PiTyperParser;
    let language: PiLanguageUnit;

    beforeEach(() => {
        try {
            language = new LanguageParser().parse("src/typerdef/__tests__/test-language.lang");
            parser = new PiTyperParser(language);
        } catch (e) {
            console.log("Language could not be read");
        }
    });

    test("language should have a name", () => {
        let parseFile = testdir + "test1.type";
        try {
            parser.parse(parseFile);
        } catch(e) {
            expect(e.message).toBe(`syntax error.`);
        }
    });


});