// Generated by the ProjectIt Language Generator.
import { observable } from "mobx";

import { demoStyles } from "../../styles/styles";
import {
    AliasBox,
    Box,
    GridBox,
    GridCell,
    GridUtil,
    HorizontalListBox,
    SelectOption,
    SvgBox,
    SelectBox,
    KeyPressAction,
    LabelBox,
    PiEditor,
    PiElement,
    PiProjection,
    TextBox,
    VerticalListBox,
    VerticalPiElementListBox,
    PiUtils,
    EXPRESSION_PLACEHOLDER,
    createDefaultBinaryBox,
    createDefaultExpressionBox,
    PiLogger,
    STYLES,
    isPiBinaryExpression,
    PiBinaryExpression
} from "@projectit/core";

import { DemoModel } from "../../language/DemoModel";
import { DemoEntity } from "../../language/DemoEntity";
import { DemoAttribute } from "../../language/DemoAttribute";
import { DemoFunction } from "../../language/DemoFunction";
import { DemoVariable } from "../../language/DemoVariable";
import { DemoExpression } from "../../language/DemoExpression";
import { DemoPlaceholderExpression } from "../../language/DemoPlaceholderExpression";
import { DemoLiteralExpression } from "../../language/DemoLiteralExpression";
import { DemoStringLiteralExpression } from "../../language/DemoStringLiteralExpression";
import { DemoNumberLiteralExpression } from "../../language/DemoNumberLiteralExpression";
import { DemoBooleanLiteralExpression } from "../../language/DemoBooleanLiteralExpression";
import { DemoAbsExpression } from "../../language/DemoAbsExpression";
import { DemoBinaryExpression } from "../../language/DemoBinaryExpression";
import { DemoMultiplyExpression } from "../../language/DemoMultiplyExpression";
import { DemoPlusExpression } from "../../language/DemoPlusExpression";
import { DemoDivideExpression } from "../../language/DemoDivideExpression";
import { DemoAndExpression } from "../../language/DemoAndExpression";
import { DemoOrExpression } from "../../language/DemoOrExpression";
import { DemoComparisonExpression } from "../../language/DemoComparisonExpression";
import { DemoLessThenExpression } from "../../language/DemoLessThenExpression";
import { DemoGreaterThenExpression } from "../../language/DemoGreaterThenExpression";
import { DemoEqualsExpression } from "../../language/DemoEqualsExpression";
import { DemoFunctionCallExpression } from "../../language/DemoFunctionCallExpression";
import { DemoIfExpression } from "../../language/DemoIfExpression";
import { DemoVariableRef } from "../../language/DemoVariableRef";
import { DemoAttributeType } from "../../language/DemoAttributeType";
import { DemoEnumerationProjections } from "./DemoEnumerationProjections";

export class DemoProjectionDefault implements PiProjection {
    private enumSelectBox: DemoEnumerationProjections = new DemoEnumerationProjections();
    private editor: PiEditor;
    rootProjection: PiProjection;
    @observable showBrackets: boolean = false;

    constructor() {}

    setEditor(e: PiEditor) {
        this.editor = e;
    }

    getBox(exp: PiElement): Box {
        switch (exp.piLanguageConcept()) {
            case "DemoModel":
                return this.getDemoModelBox(exp as DemoModel);
            case "DemoEntity":
                return this.getDemoEntityBox(exp as DemoEntity);
            case "DemoAttribute":
                return this.getDemoAttributeBox(exp as DemoAttribute);
            case "DemoFunction":
                return this.getDemoFunctionBox(exp as DemoFunction);
            case "DemoVariable":
                return this.getDemoVariableBox(exp as DemoVariable);
            case "DemoExpression":
                return this.getDemoExpressionBox(exp as DemoExpression);
            case "DemoPlaceholderExpression":
                return this.getDemoPlaceholderExpressionBox(exp as DemoPlaceholderExpression);
            case "DemoLiteralExpression":
                return this.getDemoLiteralExpressionBox(exp as DemoLiteralExpression);
            case "DemoStringLiteralExpression":
                return this.getDemoStringLiteralExpressionBox(exp as DemoStringLiteralExpression);
            case "DemoNumberLiteralExpression":
                return this.getDemoNumberLiteralExpressionBox(exp as DemoNumberLiteralExpression);
            case "DemoBooleanLiteralExpression":
                return this.getDemoBooleanLiteralExpressionBox(exp as DemoBooleanLiteralExpression);
            case "DemoAbsExpression":
                return this.getDemoAbsExpressionBox(exp as DemoAbsExpression);
            case "DemoBinaryExpression":
                return this.getDemoBinaryExpressionBox(exp as DemoBinaryExpression);
            case "DemoMultiplyExpression":
                return this.getDemoMultiplyExpressionBox(exp as DemoMultiplyExpression);
            case "DemoPlusExpression":
                return this.getDemoPlusExpressionBox(exp as DemoPlusExpression);
            case "DemoDivideExpression":
                return this.getDemoDivideExpressionBox(exp as DemoDivideExpression);
            case "DemoAndExpression":
                return this.getDemoAndExpressionBox(exp as DemoAndExpression);
            case "DemoOrExpression":
                return this.getDemoOrExpressionBox(exp as DemoOrExpression);
            case "DemoComparisonExpression":
                return this.getDemoComparisonExpressionBox(exp as DemoComparisonExpression);
            case "DemoLessThenExpression":
                return this.getDemoLessThenExpressionBox(exp as DemoLessThenExpression);
            case "DemoGreaterThenExpression":
                return this.getDemoGreaterThenExpressionBox(exp as DemoGreaterThenExpression);
            case "DemoEqualsExpression":
                return this.getDemoEqualsExpressionBox(exp as DemoEqualsExpression);
            case "DemoFunctionCallExpression":
                return this.getDemoFunctionCallExpressionBox(exp as DemoFunctionCallExpression);
            case "DemoIfExpression":
                return this.getDemoIfExpressionBox(exp as DemoIfExpression);
            case "DemoVariableRef":
                return this.getDemoVariableRefBox(exp as DemoVariableRef);
        }
        // nothing fits
        throw new Error("No box defined for this expression:" + exp.piId());
    }

    private getDemoBinaryExpressionBox(element: DemoBinaryExpression) {
        return this.createBinaryBox(this, element);
    }

    private getDemoPlaceholderExpressionBox(element: DemoPlaceholderExpression) {
        return new AliasBox(element, EXPRESSION_PLACEHOLDER, "[exp]");
    }

    public getDemoModelBox(element: DemoModel): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-name-list", [
                new LabelBox(element, "element-name-label", "name", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-name-text", () => element.name, (c: string) => (element.name = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ]),

            new LabelBox(element, "element-entities-label", "entities", {
                style: demoStyles.keyword
            }),
            element.entities.length === 0
                ? null
                : new VerticalListBox(
                      element,
                      "entities-list",
                      element.entities.map(ent => {
                          return this.rootProjection.getBox(ent);
                      }),
                      {
                          style: demoStyles.indent
                      }
                  ),
            new AliasBox(element, "new-entities", "add entities", {
                style: demoStyles.indentedplaceholdertext
            }),
            new LabelBox(element, "element-functions-label", "functions", {
                style: demoStyles.keyword
            }),
            element.functions.length === 0
                ? null
                : new VerticalListBox(
                      element,
                      "functions-list",
                      element.functions.map(ent => {
                          return this.rootProjection.getBox(ent);
                      }),
                      {
                          style: demoStyles.indent
                      }
                  ),
            new AliasBox(element, "new-functions", "add functions", {
                style: demoStyles.indentedplaceholdertext
            })
        ]);
    }

    public getDemoEntityBox(element: DemoEntity): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-name-list", [
                new LabelBox(element, "element-name-label", "name", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-name-text", () => element.name, (c: string) => (element.name = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ]),

            new LabelBox(element, "element-attributes-label", "attributes", {
                style: demoStyles.keyword
            }),
            element.attributes.length === 0
                ? null
                : new VerticalListBox(
                      element,
                      "attributes-list",
                      element.attributes.map(ent => {
                          return this.rootProjection.getBox(ent);
                      }),
                      {
                          style: demoStyles.indent
                      }
                  ),
            new AliasBox(element, "new-attributes", "add attributes", {
                style: demoStyles.indentedplaceholdertext
            }),
            new LabelBox(element, "element-functions-label", "functions", {
                style: demoStyles.keyword
            }),
            element.functions.length === 0
                ? null
                : new VerticalListBox(
                      element,
                      "functions-list",
                      element.functions.map(ent => {
                          return this.rootProjection.getBox(ent);
                      }),
                      {
                          style: demoStyles.indent
                      }
                  ),
            new AliasBox(element, "new-functions", "add functions", {
                style: demoStyles.indentedplaceholdertext
            })
        ]);
    }

    public getDemoAttributeBox(element: DemoAttribute): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-name-list", [
                new LabelBox(element, "element-name-label", "name", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-name-text", () => element.name, (c: string) => (element.name = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ]),
            new HorizontalListBox(element, "element-declaredType-list", [
                new LabelBox(element, "element-declaredType-label", "declaredType", {
                    style: demoStyles.propertykeyword
                }),
                this.enumSelectBox.enumSelectForDemoAttributeType(
                    element,
                    "declaredType-type",
                    () => {
                        return { id: element.declaredType.name, label: element.declaredType.name };
                    },
                    (o: SelectOption) => (element.declaredType = DemoAttributeType.fromString(o.id))
                )
            ])
        ]);
    }

    public getDemoFunctionBox(element: DemoFunction): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-name-list", [
                new LabelBox(element, "element-name-label", "name", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-name-text", () => element.name, (c: string) => (element.name = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ]),
            new HorizontalListBox(element, "element-declaredType-list", [
                new LabelBox(element, "element-declaredType-label", "declaredType", {
                    style: demoStyles.propertykeyword
                }),
                this.enumSelectBox.enumSelectForDemoAttributeType(
                    element,
                    "declaredType-type",
                    () => {
                        return { id: element.declaredType.name, label: element.declaredType.name };
                    },
                    (o: SelectOption) => (element.declaredType = DemoAttributeType.fromString(o.id))
                )
            ]),
            new LabelBox(element, "element-expression-label", "expression", {}),
            this.rootProjection.getBox(element.expression),
            new LabelBox(element, "element-parameters-label", "parameters", {
                style: demoStyles.keyword
            }),
            element.parameters.length === 0
                ? null
                : new VerticalListBox(
                      element,
                      "parameters-list",
                      element.parameters.map(ent => {
                          return this.rootProjection.getBox(ent);
                      }),
                      {
                          style: demoStyles.indent
                      }
                  ),
            new AliasBox(element, "new-parameters", "add parameters", {
                style: demoStyles.indentedplaceholdertext
            })
        ]);
    }

    public getDemoVariableBox(element: DemoVariable): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-name-list", [
                new LabelBox(element, "element-name-label", "name", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-name-text", () => element.name, (c: string) => (element.name = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ]),
            new HorizontalListBox(element, "element-declaredType-list", [
                new LabelBox(element, "element-declaredType-label", "declaredType", {
                    style: demoStyles.propertykeyword
                }),
                this.enumSelectBox.enumSelectForDemoAttributeType(
                    element,
                    "declaredType-type",
                    () => {
                        return { id: element.declaredType.name, label: element.declaredType.name };
                    },
                    (o: SelectOption) => (element.declaredType = DemoAttributeType.fromString(o.id))
                )
            ])
        ]);
    }

    public getDemoExpressionBox(element: DemoExpression): Box {
        return new VerticalListBox(element, "element", []);
    }

    public getDemoLiteralExpressionBox(element: DemoLiteralExpression): Box {
        return new VerticalListBox(element, "element", []);
    }

    public getDemoStringLiteralExpressionBox(element: DemoStringLiteralExpression): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-value-list", [
                new LabelBox(element, "element-value-label", "value", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-value-text", () => element.value, (c: string) => (element.value = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ])
        ]);
    }

    public getDemoNumberLiteralExpressionBox(element: DemoNumberLiteralExpression): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-value-list", [
                new LabelBox(element, "element-value-label", "value", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-value-text", () => element.value, (c: string) => (element.value = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ])
        ]);
    }

    public getDemoBooleanLiteralExpressionBox(element: DemoBooleanLiteralExpression): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-value-list", [
                new LabelBox(element, "element-value-label", "value", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-value-text", () => element.value, (c: string) => (element.value = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ])
        ]);
    }

    public getDemoAbsExpressionBox(element: DemoAbsExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-expr-label", "expr", {}),
            this.rootProjection.getBox(element.expr)
        ]);
    }

    public getDemoMultiplyExpressionBox(element: DemoMultiplyExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoPlusExpressionBox(element: DemoPlusExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoDivideExpressionBox(element: DemoDivideExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoAndExpressionBox(element: DemoAndExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoOrExpressionBox(element: DemoOrExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoComparisonExpressionBox(element: DemoComparisonExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoLessThenExpressionBox(element: DemoLessThenExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoGreaterThenExpressionBox(element: DemoGreaterThenExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoEqualsExpressionBox(element: DemoEqualsExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-left-label", "left", {}),
            this.rootProjection.getBox(element.left),
            new LabelBox(element, "element-right-label", "right", {}),
            this.rootProjection.getBox(element.right)
        ]);
    }

    public getDemoFunctionCallExpressionBox(element: DemoFunctionCallExpression): Box {
        return new VerticalListBox(element, "element", []);
    }

    public getDemoIfExpressionBox(element: DemoIfExpression): Box {
        return new VerticalListBox(element, "element", [
            new LabelBox(element, "element-condition-label", "condition", {}),
            this.rootProjection.getBox(element.condition),
            new LabelBox(element, "element-whenTrue-label", "whenTrue", {}),
            this.rootProjection.getBox(element.whenTrue),
            new LabelBox(element, "element-whenFalse-label", "whenFalse", {}),
            this.rootProjection.getBox(element.whenFalse)
        ]);
    }

    public getDemoVariableRefBox(element: DemoVariableRef): Box {
        return new VerticalListBox(element, "element", [
            new HorizontalListBox(element, "element-referredName-list", [
                new LabelBox(element, "element-referredName-label", "referredName", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(
                    element,
                    "element-referredName-text",
                    () => element.referredName,
                    (c: string) => (element.referredName = c as string),
                    {
                        placeHolder: "text",
                        style: demoStyles.placeholdertext
                    }
                )
            ]),
            new HorizontalListBox(element, "element-attribute-list", [
                new LabelBox(element, "element-attribute-label", "attribute", {
                    style: demoStyles.propertykeyword
                }),
                new TextBox(element, "element-attribute-text", () => element.attribute, (c: string) => (element.attribute = c as string), {
                    placeHolder: "text",
                    style: demoStyles.placeholdertext
                })
            ])
        ]);
    }

    private createBinaryBox(projection: DemoProjectionDefault, exp: PiBinaryExpression): Box {
        let binBox = createDefaultBinaryBox(this, exp);
        if (this.showBrackets && !!exp.piContainer().container && isPiBinaryExpression(exp.piContainer().container)) {
            return new HorizontalListBox(exp, "brackets", [
                new LabelBox(exp, "open-bracket", "("),
                binBox,
                new LabelBox(exp, "close-bracket", ")")
            ]);
        } else {
            return binBox;
        }
    }
}
