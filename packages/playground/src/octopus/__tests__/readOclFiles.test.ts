import { OctopusEnvironment } from "../environment/gen/OctopusEnvironment";
import { findFiles } from "./test-utils";

const writer = OctopusEnvironment.getInstance().writer;
const reader = OctopusEnvironment.getInstance().reader;

function doAllFilesIn(folderPath: string) {
    const umlFiles = findFiles(folderPath, ".ocl");
    for (const file of umlFiles) {
        const unit1 = reader.readFromFile(file, "OclPart");
        console.log("RESULT FOR: " + file + ":\n" + writer.writeToString(unit1, 0, false));
    }
}

describe("Testing Parser on OCL files", () => {
    // TODO use snapshots
    test("book project unparsed and parsed again", () => {
        doAllFilesIn("src/octopus/__tests__/Book-project/");
    });

    test("dvdshop project unparsed and parsed again", () => {
        doAllFilesIn("src/octopus/__tests__/DvdShop-project/");
    });

    test("trainWagon model unparsed and parsed again", () => {
        doAllFilesIn("src/octopus/__tests__/Train-project/");
    });

});
