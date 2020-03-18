import { PiError, PiElement } from "@projectit/core";
import { DemoModel, DemoAttributeType, DemoMultiplyExpression, DemoNumberLiteralExpression, DemoStringLiteralExpression, DemoDivideExpression, DemoVariableRef, DemoEntity, DemoAttribute, AllDemoConcepts, DemoFunction, DemoVariable } from "../language";
import { DemoTyper } from "../typer/DemoTyper";
import { DemoValidator } from "../validator/gen/DemoValidator";
import { DemoModelCreator } from "./DemoModelCreator";

describe('Testing Validator', () => {
    describe('Validate DemoModel Instance', () => {
        const model : DemoModel = new DemoModelCreator().model;
        const validator = new DemoValidator();
        validator.myTyper = new DemoTyper();
     
        beforeEach(done => {
          done();
        });

        test("multiplication 3 * 10", () => {
            let errors : PiError[] = [];
            let mult : DemoMultiplyExpression = new DemoMultiplyExpression();
            mult.left = new DemoNumberLiteralExpression("3");
            mult.right = new DemoNumberLiteralExpression("10"); 
            validator.validateDemoMultiplyExpression(mult, errors);
            expect(errors.length).toBe(0);
        });

        test("multiplication 3 * 'temp'", () => {
            let errors : PiError[] = [];
            let mult : DemoMultiplyExpression = new DemoMultiplyExpression();
            mult.left = new DemoNumberLiteralExpression("3");
            mult.right = new DemoStringLiteralExpression("temp");
            validator.validateDemoMultiplyExpression(mult, errors);
            expect(errors.length).toBe(1);
            errors.forEach(e =>
                expect(e.reportedOn).toBe(mult.right)
            );
        });

        test("multiplication (3/4) * 'temp'", () => {
            let errors : PiError[] = [];
            let div : DemoDivideExpression = new DemoDivideExpression();
            div.left = new DemoNumberLiteralExpression("3");
            div.right = new DemoNumberLiteralExpression("4");
            let mult : DemoMultiplyExpression = new DemoMultiplyExpression();
            mult.left = div;
            mult.right = new DemoStringLiteralExpression("temp");
            validator.validateDemoMultiplyExpression(mult,errors);
            expect(errors.length).toBe(1);
            errors.forEach(e =>
                expect(e.reportedOn).toBe(mult.right)
            );
        });

        test("list is not empty", () => {
            let errors : PiError[] = [];
            validator.validateDemoModel(new DemoModel(),errors);
            expect(errors.length).toBe(3);
        });

        test("incorrect name of DemoModel: YY\\XX", () => {
            let errors : PiError[] = [];
            let model = new DemoModel();
            model.name = "YY\\XX"
            validator.validateDemoModel(model,errors);
            expect(errors.length).toBe(3);            
        });

        test("(1 + 2) * 'Person' should give type error", () => {
            let errors : PiError[] = [];
            const variableExpression = new DemoVariableRef();
            variableExpression.referredName = "Person";
            variableExpression.attribute = new DemoAttribute();
            variableExpression.attribute.name = "Person";
            variableExpression.attribute.declaredType = DemoAttributeType.String;

            const divideExpression = DemoModelCreator.MakePlusExp("1","2");
            const multiplyExpression = DemoModelCreator.MakeMultiplyExp(divideExpression, variableExpression);
            validator.validateDemoMultiplyExpression(multiplyExpression, errors);
            expect(errors.length).toBe(1);
            errors.forEach(e =>
                expect(e.reportedOn === multiplyExpression)
            );
        })

        test("'determine(AAP) = \"Hello Demo\" + \"Goodbye\"'' should give two type errors", () => {
            let errors : PiError[] = [];
            const determine = DemoFunction.create("determine");
            const AAP = DemoVariable.create("AAP")
            determine.parameters.push(AAP);
            determine.expression = DemoModelCreator.MakePlusExp("Hello Demo","Goodbye")
            // determine(AAP) = "Hello Demo" + "Goodbye"
            validator.validateDemoFunction(determine, errors, true);
            expect(errors.length).toBe(2);
            errors.forEach(e => {
                expect(e.reportedOn === determine);
                console.log(e.message);
            });
        })

        test("complete example model", () => {
            let errors : PiError[] = [];
            validator.validateDemoModel(model, errors, true);
            // expect(errors.length).toBe(3);            
            errors.forEach(e =>
                console.log(e.message)
            );
        });
    });
});

