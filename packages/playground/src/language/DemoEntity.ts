// Generated by the ProjectIt Language Generator.
import { observable } from "mobx";
import * as uuid from "uuid";
import { WithType } from "./WithType";
import { PiElement, PiExpression, PiBinaryExpression } from "@projectit/core";
import { model, MobxModelElementImpl, observablelistpart } from "@projectit/model";
import { LanguageConceptType } from "./Language";
import { DemoAttribute } from "./DemoAttribute";
import { DemoFunction } from "./DemoFunction";
import { DemoAttributeType } from "./DemoAttributeType";
import { DemoType } from "./DemoType";
import { DemoPlaceholderExpression } from "./DemoPlaceholderExpression";
import { DemoExpression } from "./DemoExpression";

@model
export class DemoEntity extends MobxModelElementImpl implements PiElement, WithType {
    readonly $type: LanguageConceptType = "DemoEntity";
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

    @observablelistpart attributes: DemoAttribute[];

    @observablelistpart functions: DemoFunction[];

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

    static create(name: string): DemoEntity {
        const result = new DemoEntity();
        result.name = name;
        return result;
    }
}