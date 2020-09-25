import { OctopusEnvironment } from "../environment/gen/OctopusEnvironment";
import { findFiles } from "./test-utils";
import * as fs from "fs";

const writer = OctopusEnvironment.getInstance().writer;
const reader = OctopusEnvironment.getInstance().reader;

function doAllFilesIn(folderPath: string) {
    const umlFiles = findFiles(folderPath, ".uml2");
    for (const file of umlFiles) {
        const unit1 = reader.readFromFile(file, "UmlPart");
        // console.log(writer.writeToString(unit1, 0, false));
    }
}

describe("Testing Parser on UML files", () => {
    // TODO use snapshots
    test("book project unparsed and parsed again", () => {
        doAllFilesIn("src/octopus-small/__tests__/Book-project/");
    });

    // test skipped until PiElementReference can handle pathNames
    test.skip("dvdshop project unparsed and parsed again", () => {
        doAllFilesIn("src/octopus-small/__tests__/DvdShop-project/");
    });

    test("trainWagon model unparsed and parsed again", () => {
        doAllFilesIn("src/octopus-small/__tests__/Train-project/");
    });

    test("book model STRING unparsed and parsed again", () => {
        const langSpec: string = fs.readFileSync("src/octopus-small/__tests__/Book-project/Book.uml2", { encoding: "UTF8" });
        // console.log(langSpec);
        const unit1 = reader.readFromString(langSpec, "UmlPart");
        // console.log(writer.writeToString(unit1, 0, false));
    });
});
