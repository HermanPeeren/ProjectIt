// Generated by the ProjectIt Language Generator.
import * as uuid from "uuid";
import { WithType } from "./WithType";
import { PiElement, PiExpression, PiBinaryExpression } from "@projectit/core";
import { model, MobxModelElementImpl } from "@projectit/model";
import { LanguageConceptType } from "./Language";
import { DemoAttributeType } from "./DemoAttributeType";
import { DemoType } from "./DemoType";
import { DemoPlaceholderExpression } from "./DemoPlaceholderExpression";

@model
export abstract class DemoExpression extends MobxModelElementImpl implements PiExpression, WithType {
    readonly $type: LanguageConceptType = "DemoExpression";
    $id: string;

    constructor(id?: string) {
        super();

        if (!!id) {
            this.$id = id;
        } else {
            this.$id = uuid.v4();
        }
    }

    get$Type(): LanguageConceptType {
        return this.$type;
    }

    piId(): string {
        return this.$id;
    }

    piIsExpression(): boolean {
        return true;
    }

    piIsBinaryExpression(): boolean {
        return false;
    }

    piIsExpressionPlaceHolder(): boolean {
        return false;
    }
}