// Generated by the ProjectIt Language Generator.
import { observable } from "mobx";
import * as uuid from "uuid";
import { WithType } from "./WithType";
import { PiElement, PiExpression, PiBinaryExpression } from "@projectit/core";
import { model, MobxModelElementImpl } from "@projectit/model";
import { LanguageConceptType } from "./Language";
import { DemoAttributeType } from "./DemoAttributeType";
import { DemoType } from "./DemoType";
import { DemoPlaceholderExpression } from "./DemoPlaceholderExpression";
import { DemoExpression } from "./DemoExpression";

@model
export class DemoVariable extends MobxModelElementImpl implements PiElement, WithType {
    readonly $type: LanguageConceptType = "DemoVariable";
    $id: string;

    constructor(id?: string) {
        super();

        if (!!id) {
            this.$id = id;
        } else {
            this.$id = uuid.v4();
        }
    }

    @observable name: string;

    @observable declaredType: DemoType;

    get$Type(): LanguageConceptType {
        return this.$type;
    }

    piId(): string {
        return this.$id;
    }

    piIsExpression(): boolean {
        return false;
    }

    piIsBinaryExpression(): boolean {
        return false;
    }

    static create(name: string): DemoVariable {
        const result = new DemoVariable();
        result.name = name;
        return result;
    }
}