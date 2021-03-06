import { PiLangElement, PiLanguage } from "../languagedef/metalanguage";
import { PiEditElement } from "../editordef/metalanguage";

export type CheckB = { check: boolean; error: string; whenOk?: () => void };

export abstract class Checker<DEFINITION> {
    errors: string[] = [];
    language: PiLanguage; // should be set in every checker, except the checker for the language definition langauge (LDL)

    constructor(language: PiLanguage) {
        this.language = language;
    }

    public abstract check(lang: DEFINITION): void;

    public hasErrors(): boolean {
        return this.errors.length > 0;
    }

    public simpleCheck(check: boolean, error: string): boolean {
        if (!check) {
            this.errors.push(error);
            return false;
        }
        return true;
    }

    public nestedCheck(check: CheckB | CheckB[]): void {
        if (Array.isArray(check)) {
            check.forEach(chk => this.simpleCheck(chk.check, chk.error));
        } else {
            if (this.simpleCheck(check.check, check.error)) {
                if (!!check.whenOk) {
                    check.whenOk();
                }
            }
        }
    }

    // TODO find better way to type this parameter
    protected location(elem: PiLangElement | PiEditElement): string {
        if (!!elem.location) {
            return `[file: ${elem.location.filename}, line: ${elem.location.start.line}, column: ${elem.location.start.column}]`;
        }
        return `[no location]`;
    }
}
