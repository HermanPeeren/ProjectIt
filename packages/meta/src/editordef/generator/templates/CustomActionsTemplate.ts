import { Names, PROJECTITCORE } from "../../../utils";
import { PiLanguage } from "../../../languagedef/metalanguage";

export class CustomActionsTemplate {

    generate(language: PiLanguage): string {
        return `
            import {
                KeyboardShortcutBehavior,
                PiBinaryExpressionCreator,
                PiCustomBehavior,
                PiExpressionCreator,
                PiActions
            } from "${PROJECTITCORE}";
 
             /**
             * Class ${Names.customActions(language)} provides an entry point for the language engineer to
             * define custom build additions to the editor.
             * These custom build additions are merged with the default and definition-based editor parts 
             * in a three-way manner. For each modelelement, 
             * (1) if a custom build creator/behavior is present, this is used,
             * (2) if a creator/behavior based on the editor definition is present, this is used,
             * (3) if neither (1) nor (2) yields a result, the default is used.  
             */           
            export class ${Names.customActions(language)} implements PiActions {
                binaryExpressionCreators: PiBinaryExpressionCreator[] = MANUAL_BINARY_EXPRESSION_CREATORS;
                customBehaviors: PiCustomBehavior[] = MANUAL_CUSTOM_BEHAVIORS;
                expressionCreators: PiExpressionCreator[] = MANUAL_EXPRESSION_CREATORS;
                keyboardActions: KeyboardShortcutBehavior[] = MANUAL_KEYBOARD;
            }

            export const MANUAL_EXPRESSION_CREATORS: PiExpressionCreator[] = [
                // Add your own custom expression creators here
            ];

            export const MANUAL_BINARY_EXPRESSION_CREATORS: PiBinaryExpressionCreator[] = [
                // Add your own custom binary expression creators here
            ];
            
            export const MANUAL_CUSTOM_BEHAVIORS: PiCustomBehavior[] = [
                // Add your own custom behavior here
            ];
            
            export const MANUAL_KEYBOARD: KeyboardShortcutBehavior[] = [
                // Add your own custom keyboard shortcuts here
            ];
        `;
    }
}
