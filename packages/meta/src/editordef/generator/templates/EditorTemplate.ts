import { Names } from "../../../utils/Names";
import { PiLanguageUnit } from "../../../languagedef/metalanguage/PiLanguage";

export class EditorTemplate {
    constructor() {
    }

    generateEditor(language: PiLanguageUnit, withToolbar: boolean): string {
        return `
            import { PiActions, PiContext, PiEditor, PiProjection } from "@projectit/core";
            ${withToolbar ? `
            import { PiEditorWithToolbar } from "../../toolbars/ToolBarDefinition";
            import { MyToolbarItem } from "../../toolbars/MyToolbarItem";
            `: ""}
            
            export class ${Names.editor(language)} extends ${ withToolbar? `PiEditorWithToolbar` : `PiEditor`} {
            
                constructor(context: PiContext, projection: PiProjection, actions?: PiActions) {
                    super(context, projection, actions)
                }
                
                ${ withToolbar ? `
                mytoolbarItems: MyToolbarItem[] = [];
                ` : ""}

            }
        `;
    }
}
