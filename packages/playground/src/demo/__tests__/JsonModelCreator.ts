import { DemoEntity, DemoAttribute, DemoModel, DemoAttributeType, PiElementReference } from "../language/gen";

export class JsonModelCreator {
    model: DemoModel;

    constructor() {
        this.model = this.createCorrectModel();
    }

    public createCorrectModel(): DemoModel {
        let correctModel: DemoModel = DemoModel.create("DemoModel_1");

        const personEnt = DemoEntity.create("Person");
        const age = DemoAttribute.create("age");
        age.declaredType = PiElementReference.create<DemoAttributeType>(DemoAttributeType.Integer, "DemoAttributeType");
        // age.declaredType = PiElementReference.create<DemoEntity>(personEnt, "DemoEntity");
        const personName = DemoAttribute.create("name");
        personName.declaredType = PiElementReference.create<DemoAttributeType>(DemoAttributeType.String, "DemoAttributeType");
        // personName.declaredType = PiElementReference.create<DemoEntity>(personEnt, "DemoEntity");
        personEnt.attributes.push(age);
        personEnt.attributes.push(personName);

        const companyEnt = DemoEntity.create("Company");
        const companyName = DemoAttribute.create("name");
        const VAT_Number = DemoAttribute.create("VAT_Number");
        companyEnt.attributes.push(companyName);
        companyEnt.attributes.push(VAT_Number);

        correctModel.entities.push(personEnt);
        correctModel.entities.push(companyEnt);
        return correctModel;
    }
}
