// Generated by the ProjectIt Language Generator.
import { PiProjection, PiElement, Box, VerticalListBox, HorizontalListBox, LabelBox, TextBox, IndentBox, AliasBox } from "@projectit/core";
import { SelectBox, SelectOption } from "@projectit/core";
import { createDefaultExpressionBox, KeyPressAction } from "@projectit/core";
import { PiScoper } from "@projectit/core";
import { PiEditor } from "@projectit/core";
import {
    AllDemoConcepts,
    DemoAttribute,
    DemoAttributeType, DemoEntity,
    DemoFunction,
    DemoFunctionCallExpression,
    DemoNumberLiteralExpression,
    DemoStringLiteralExpression,
    DemoVariable
} from "../language/gen";
import { PiElementReference } from "../language/gen/PiElementReference";
import { projectitStyles } from "../../webapp/styles/styles";
import { DemoEnvironment } from "../environment/gen/DemoEnvironment";
import { DemoSelectionHelpers } from "./gen/DemoSelectionHelpers";

export class DemoProjection implements PiProjection {
    rootProjection: PiProjection;
    helpers = new DemoSelectionHelpers();

    getBox(element: PiElement): Box {
        // if (element instanceof DemoFunctionCallExpression) {
        //     return this.getDemoFunctionCallExpressionBox(element);
        // }
        // if (element instanceof DemoStringLiteralExpression) {
        //     return this.getDemoStringLiteralExpressionBox(element);
        // }
        // if( element instanceof DemoEntity){
        //     return this.getDemoEntityBox(element);
        // }
        if (element instanceof DemoNumberLiteralExpression) {
            return this.getDemoNumberLiteralExpressionBox(element);
        }

        return null;
    }
    // public getDemoEntityBox(element: DemoEntity): Box {
    //     return new VerticalListBox(element, "element", [
    //
    //         new HorizontalListBox(element, "element-name-list", [
    //             new LabelBox(element, "element-name-label", "name", {
    //                 style: projectitStyles.propertykeyword,
    //                 selectable: false
    //             }),
    //             new TextBox(element, "element-name-text", () => element.name, (c: string) => (element.name = c as string),
    //                 {
    //                     placeHolder: "text",
    //                     style: projectitStyles.placeholdertext
    //                 })
    //         ], { selectable: false }),
    //
    //         new LabelBox(element, "element-attributes-label", "attributes", {
    //             style: projectitStyles.keyword,
    //             selectable: false
    //         }),
    //         (element.attributes.length === 0 ? null :
    //                 new IndentBox(element, "indent-part-attributes", 4,
    //
    //                     new VerticalListBox(element, "element-attributes-list",
    //                         element.attributes.map(feature => {
    //                             return this.rootProjection.getBox(feature);
    //                         })
    //                     )
    //                 )
    //         ),
    //         new AliasBox(element, "new-attributes", "add attributes", {
    //             style: projectitStyles.indentedplaceholdertext
    //         })
    //         ,
    //
    //         new LabelBox(element, "element-functions-label", "functions", {
    //             style: projectitStyles.keyword,
    //             selectable: false
    //         }),
    //         (element.functions.length === 0 ? null :
    //                 new IndentBox(element, "indent-part-functions", 4,
    //
    //                     new VerticalListBox(element, "element-functions-list",
    //                         element.functions.map(feature => {
    //                             return this.rootProjection.getBox(feature);
    //                         })
    //                     )
    //                 )
    //         ),
    //         new AliasBox(element, "new-functions", "add functions", {
    //             style: projectitStyles.indentedplaceholdertext
    //         })
    //         ,
    //
    //         new LabelBox(element, "element-baseEntity-label", "baseEntity", {
    //             style: projectitStyles.keyword,
    //             selectable: false
    //         }),
    //         (element.baseEntity.length === 0 ? null :
    //                 new VerticalListBox(
    //                     element,
    //                     "baseEntity-list",
    //                     element.baseEntity.map((ent, index) => {
    //                         return this.helpers.getReferenceBox(element, "baseEntity-"+ index, "< select baseEntity>", "DemoEntity",
    //                             () => {
    //                                 if (!!ent) {
    //                                     return { id: ent.name, label: ent.name };
    //                                 } else {
    //                                     return {  id: "NONE", label: "NONE" };
    //                                 }
    //                             },
    //                             (option: SelectOption) => {
    //                                 ent.name = option.label;
    //                             }
    //                         );
    //
    //                     }),
    //                     {
    //                         style: projectitStyles.indent
    //                     }
    //                 )
    //
    //         ),
    //         new AliasBox(element, "new-baseEntity", "add baseEntity", {
    //             style: projectitStyles.indentedplaceholdertext
    //         })
    //
    //     ]);
    //
    // }

    public getDemoFunctionCallExpressionBox(element: DemoFunctionCallExpression): Box {
        return createDefaultExpressionBox(element, "getDemoFunctionCallExpressionBox", [
                this.helpers.getReferenceBox(element, "func-call-exp", "<select function>", "DemoFunction",
                    () => {
                        if (!!element.functionDefinition) {
                            return { id: element.functionDefinition.name, label: element.functionDefinition.name };
                        } else {
                            return null;
                        }
                    },
                    (option: SelectOption) => {
                        // TODO PiElementReference
                        element.functionDefinition = new PiElementReference<DemoFunction>(DemoEnvironment.getInstance().scoper.getFromVisibleElements(
                            element,
                            option.label,
                            "DemoFunction"
                        ) as DemoFunction, "DemoFunction");
                    }
                ),
            // new TextBox(element, "blabla", () => element?.functionDefinition.name, (v: string) => (0), {
            //     style: projectitStyles.stringLiteral,
            //     deleteWhenEmptyAndErase: true
            // }),

        ]);
    }

    public getDemoStringLiteralExpressionBox(literal: DemoStringLiteralExpression): Box {
        return createDefaultExpressionBox(literal, "string-literal-exp", [
            new HorizontalListBox(literal, "string-literal", [
                new LabelBox(literal, "start-quote", "\"", { selectable: false }),
                new TextBox(literal, "element-value-text", () => literal.value, (v: string) => (literal.value = v), {
                    style: projectitStyles.stringLiteral,
                    deleteWhenEmptyAndErase: true
                }),
                new LabelBox(literal, "end-quote", "\"", { selectable: false })
            ])
        ]);
    }

    public getDemoNumberLiteralExpressionBox(exp: DemoNumberLiteralExpression) {
        return createDefaultExpressionBox(exp, "number-literal", [
            new TextBox(exp, "num-literal-value", () => exp.value, (v: string) => (exp.value = v), {
                deleteWhenEmpty: true,
                style: projectitStyles.stringLiteral,
                keyPressAction: (currentText: string, key: string, index: number) => {
                    return isNumber(currentText, key, index);
                }
            })
        ]);
    }
}

function isNumber(currentText: string, key: string, index: number): KeyPressAction {
    if (isNaN(Number(key))) {
        if (index === currentText.length) {
            return KeyPressAction.GOTO_NEXT;
        } else {
            return KeyPressAction.NOT_OK;
        }
    } else {
        return KeyPressAction.OK;
    }
}
