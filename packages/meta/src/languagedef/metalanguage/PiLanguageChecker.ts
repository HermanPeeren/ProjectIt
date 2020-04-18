import { Checker } from "../../utils";
import { PiLangConceptProperty, PiLanguageUnit, PiLangBinaryExpressionConcept, PiLangExpressionConcept, PiLangPrimitiveProperty, PiLangClass, PiLangEnumeration, PiLangUnion, PiLangEnumProperty } from "./PiLanguage";
import { PiLangConceptReference } from "./PiLangReferences";
import { PiLogger } from "../../../../core/src/util/PiLogging";
import { PiParseClass } from "../parser/PiParseLanguage";

const LOGGER = new PiLogger("PiLanguageChecker").mute();

// This class first resolves the references that could not be parsed in another manner.
// Secondly, it checks all other constraints on the language metamodel
export class PiLanguageChecker extends Checker<PiLanguageUnit> {
    foundRoot = false;

    public check(language: PiLanguageUnit): void {
        LOGGER.log("Checking language '" + language.name + "'");
        this.simpleCheck(!!language.name, "Language should have a name, it is empty");

        this.language = language;
        // first resolve the PiParseClasses, and replace the parse classes by the resolved classes
        language.classes = this.resolvePiParseClass();
        
        // ensure all references to the language are set
        this.setLanguageReferences(language);    

        // now check the whole language
        language.classes.forEach(concept => this.checkClass(concept));
        language.enumerations.forEach(concept => this.checkEnumeration(concept));
        language.unions.forEach(concept => this.checkUnion(concept));
        // TODO: checkInterface
        // language.interfaces.forEach(concept => this.checkInterface(concept));

        this.simpleCheck(!!language.classes.find(c => c.isRoot), "There should be a root concept in your language.");
        this.simpleCheck(!(!!language.classes.find(c => c instanceof PiParseClass)), "Error in checker: there are unresolved parse classes.");
    }

    private setLanguageReferences(language: PiLanguageUnit) {
        language.classes.forEach(concept => {
            concept.language = language;
            concept.references.forEach(ref => ref.type.language = language);
            concept.parts.forEach(part => part.type.language = language);
            concept.enumProperties.forEach(en => en.type.language = language);
            if (!!concept.base) {
                concept.base.language = language;
            }
        });
        language.enumerations.forEach(enumeration => {
            enumeration.language = language;
        });
        language.unions.forEach(union => {
            union.language = language;
            union.members.forEach(mem => mem.language = language);
        });
    }

    private resolvePiParseClass() : PiLangClass[] {
        let newList: PiLangClass[] = [];
        this.language.classes.forEach(concept => {
            if (concept instanceof PiParseClass) { // should always be the case
                if (concept.isBinary || this.baseIsBinary(concept)) { // found binary expression  
                    // LOGGER.log("found binary expression " + concept.name);
                    let result = new PiLangBinaryExpressionConcept();
                    // copy properties
                    // result.symbol = concept.symbol;
                    result.priority = concept.priority;
                    result._isExpressionPlaceHolder = concept._isExpressionPlaceHolder;
                    this.copyCommonProperties(result, concept);
                    newList.push(result);
                }
                else if (concept.isExpression || this.baseIsExpression(concept)) { // found expression
                    // LOGGER.log("found expression " + concept.name);
                    let result = new PiLangExpressionConcept();
                    // copy properties
                    result._isExpressionPlaceHolder = concept._isExpressionPlaceHolder;
                    this.copyCommonProperties(result, concept);
                    newList.push(result);
                }
                else { // found class
                    // LOGGER.log("found class " + concept.name);
                    let result = new PiLangClass();
                    // copy properties
                    this.copyCommonProperties(result, concept);
                    newList.push(result);
                }
            }
        });
        return newList;
    }

    private copyCommonProperties(result: PiLangClass, concept: PiParseClass) {
        result.isRoot = concept.isRoot;
        result.isAbstract = concept.isAbstract;
        result.name = concept.name;
        result.base = concept.base;
        result.parts = concept.parts;
        result.references = concept.references;
        result.trigger = concept.trigger;
        result.primProperties = concept.primProperties;
        result.enumProperties = concept.enumProperties;

        // set owning class
        result.parts.forEach(part => part.owningConcept = result);
        result.primProperties.forEach(prop => prop.owningConcept = result);
        result.enumProperties.forEach(prop => prop.owningConcept = result);
        result.references.forEach(ref => ref.owningConcept = result);
    }

    private baseIsExpression(piClass: PiParseClass): boolean {
        if(!!piClass.base) {
            let baseConcept = this.language.classes.find(con => con.name === piClass.base.name);
            if( baseConcept instanceof PiParseClass ) { // should always be the case
                if ( baseConcept.isExpression ) return true;
                return this.baseIsExpression(baseConcept);
            }
        }
        return false;
    }

    private baseIsBinary(piClass: PiParseClass): boolean {
        if(!!piClass.base) {
            let baseConcept = this.language.classes.find(con => con.name === piClass.base.name);
            if( baseConcept instanceof PiParseClass ) { // should always be the case
                if ( baseConcept.isBinary ) return true;
                return this.baseIsBinary(baseConcept);
            }
        }
        return false;
    }

    // the remaining functions are checking functions
    private checkUnion(union: PiLangUnion): void {
        union.members.forEach (mem => 
            this.checkConceptReference(mem)
        );
    }

    private checkEnumeration(enumConcept: PiLangEnumeration) {
        this.simpleCheck(enumConcept.parts.length == 0 || enumConcept.references.length == 0 
            || enumConcept.enumProperties.length == 0 || enumConcept.primProperties.length == 0, 
            `Enumeration '${enumConcept.name}' may not have  properties [line: ${enumConcept.location?.start.line}, column: ${enumConcept.location?.start.column}].`);
    }


    private checkClass(piClass: PiLangClass): void {
        LOGGER.log("Checking class '" + piClass.name + "'");
        this.simpleCheck(!!piClass.name, `Concept should have a name [line: ${piClass.location?.start.line}, column: ${piClass.location?.start.column}].`);
        if(!!piClass.base) {
            this.checkConceptReference(piClass.base);
        }

        if( piClass.isRoot ) {
            this.simpleCheck(!this.foundRoot,
                `There may be only one root class in the language definition [line: ${piClass.location?.start.line}, column: ${piClass.location?.start.column}].`);
            this.foundRoot = true;
        }

        piClass.primProperties.forEach(prop => this.checkPrimitiveProperty(prop));
        piClass.enumProperties.forEach(prop => this.checkEnumProperty(prop));
        piClass.parts.forEach(part => this.checkConceptProperty(part));
        piClass.references.forEach(ref => this.checkConceptProperty(ref));

        if (piClass.binaryExpression() && !(piClass.isAbstract)) {
            const binExpConcept = piClass as PiLangBinaryExpressionConcept;
            // this.simpleCheck(binExpConcept.getSymbol() !== "undefined", `Concept ${piClass.name} should have a symbol`);
            this.simpleCheck(binExpConcept.getPriority() !== -1,
                `Concept ${piClass.name} should have a priority [line: ${piClass.location?.start.line}, column: ${piClass.location?.start.column}].`);

            const left = piClass.allParts().find(part => part.name === "left");
            this.simpleCheck(!!left, `Concept ${piClass.name} should have a left part, because it is a binary expression`);
            this.simpleCheck(!!left && left.type.referedElement() instanceof PiLangExpressionConcept,
                `Concept ${piClass.name}.left should be an expression [line: ${piClass.location?.start.line}, column: ${piClass.location?.start.column}].`);

            const right = piClass.allParts().find(part => part.name === "right");
            this.simpleCheck(!!right, `Concept ${piClass.name} should have a right part, because it is a binary expression`);
            this.simpleCheck(!!right && right.type.referedElement() instanceof PiLangExpressionConcept,
                `Concept ${piClass.name}.right should be an expression [line: ${piClass.location?.start.line}, column: ${piClass.location?.start.column}].`);
        }
    }

    checkEnumProperty(prop: PiLangEnumProperty) {
        this.simpleCheck(prop.owningConcept !== null,
            `Property '${prop.name}' should belong to a concept [line: ${prop.location?.start.line}, column: ${prop.location?.start.column}].`);
        // TODO check initialValue? check type?
    }

    checkConceptProperty(element: PiLangConceptProperty): void {
        LOGGER.log("Checking concept property '" + element.name + "'");
        this.nestedCheck(
            {
                check: !!element.type,
                error: "Element should have a type",
                whenOk: () => {
                    this.checkConceptReference(element.type); 
                    this.simpleCheck(!(element.type.referedElement() instanceof PiLangEnumeration),
                        `Part or reference property '${element.name}' may not have an Enumeration as type [line: ${element.location?.start.line}, column: ${element.location?.start.column}].`);
                }
            });
    }

    checkPrimitiveProperty(element: PiLangPrimitiveProperty): void {
        LOGGER.log("Checking primitive property '" + element.name + "'");
        this.simpleCheck(!!element.name, `Property should have a name, it is empty [line: ${element.location?.start.line}, column: ${element.location?.start.column}].`);
        this.nestedCheck(
            {
                check: !!element.primType,
                error: `Property '${element.name}' should have a type [line: ${element.location?.start.line}, column: ${element.location?.start.column}].`,
                whenOk: () => this.checkPrimitiveType(element.primType, element)
            });
    }
    
    checkConceptReference(reference: PiLangConceptReference): void {
        LOGGER.log("Checking concept reference '" + reference.name + "'");
        this.nestedCheck(
            {
                check: reference.name !== undefined,
                error: `Concept reference should have a name [line: ${reference.location?.start.line}, column: ${reference.location?.start.column}].`,
                whenOk: () => this.nestedCheck(
                    {
                        check: reference.referedElement() !== undefined,
                        error: `Reference to ${reference.name} cannot be resolved [line: ${reference.location?.start.line}, column: ${reference.location?.start.column}].`
                    })
            })
    }

    checkPrimitiveType(type: string, element: PiLangPrimitiveProperty) {
        LOGGER.log("Checking primitive type '" + type + "'");
        this.simpleCheck((type === "string" || type === "boolean" || type === "number"),
            "Primitive property '" + element.name + "' should have a primitive type (string, boolean, or number) [line: ${langRef.location?.start.line}, column: ${langRef.location?.start.column}]."
        );
    }
}
