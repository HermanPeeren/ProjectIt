// Generated by the ProjectIt Language Generator.
import { observable } from "mobx";
import * as uuid from "uuid";
import { WithType } from "./WithType";
import { PiElement, PiExpression, PiBinaryExpression } from "@projectit/core";
import { model, MobxModelElementImpl, observablelistpart, observablepart } from "@projectit/model";
import { LanguageConceptType } from "./Language";
import { DemoExpression } from "./DemoExpression";
import { DemoVariable } from "./DemoVariable";
import { DemoAttributeType } from "./DemoAttributeType";
import { DemoType } from "./DemoType";
import { DemoPlaceholderExpression } from "./DemoPlaceholderExpression";

@model
export class DemoFunction extends MobxModelElementImpl implements PiElement, WithType {
    readonly $type: LanguageConceptType = "DemoFunction";
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

    @observablepart expression: DemoExpression = new DemoPlaceholderExpression();

    @observablelistpart parameters: DemoVariable[];

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

    static create(name: string): DemoFunction {
        const result = new DemoFunction();
        result.name = name;
        return result;
    }
}