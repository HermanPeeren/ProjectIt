import {
    PiBinaryExpressionConcept, PiConcept,
    PiConceptProperty,
    PiExpressionConcept,
    PiPrimitiveProperty,
    PiProperty
} from "../../../languagedef/metalanguage";
import { Names, PROJECTITCORE, ENVIRONMENT_GEN_FOLDER, LANGUAGE_GEN_FOLDER, EDITORSTYLES } from "../../../utils";
import { PiLanguage } from "../../../languagedef/metalanguage/PiLanguage";
import { Roles } from "../../../utils/Roles";
import {
    PiEditConcept,
    PiEditUnit,
    PiEditProjection,
    PiEditProjectionText,
    PiEditPropertyProjection, PiEditProjectionDirection, PiEditParsedProjectionIndent, PiEditSubProjection
} from "../../metalanguage";

export class ProjectionTemplate {
    constructor() {
    }

    generateProjectionDefault(language: PiLanguage, editorDef: PiEditUnit, relativePath: string): string {
        const binaryConceptsWithDefaultProjection = language.concepts.filter(c => (c instanceof PiBinaryExpressionConcept))
            .filter(c => {
            const editor = editorDef.findConceptEditor(c);
            return editor === undefined || editor.projection === null;
        })
        ;
        const nonBinaryConceptsWithDefaultProjection = language.concepts.filter(c => !(c instanceof PiBinaryExpressionConcept) ).filter(c => {
            const editor = editorDef.findConceptEditor(c);
            return editor === undefined || editor.projection === null;
        });
        if (nonBinaryConceptsWithDefaultProjection.length>0){
            // console.error("Projection generator: there are elements without projections "+ nonBinaryConceptsWithDefaultProjection.map(c => c.name));
        }
        const nonBinaryConceptsWithProjection = language.concepts.filter(c => !(c instanceof PiBinaryExpressionConcept) ).filter(c => {
            const editor = editorDef.findConceptEditor(c);
            return !!editor && !!editor.projection;
        });

        return `
            import { observable } from "mobx";

            import { ${Names.styles} } from "${relativePath}${EDITORSTYLES}";
            import {
                AliasBox,
                Box,
                GridBox,
                IndentBox,
                GridCell,
                GridUtil,
                HorizontalListBox,
                SelectOption,
                SvgBox,
                SelectBox,
                KeyPressAction,
                LabelBox,
                ${Names.PiElement},
                ${Names.PiProjection},
                TextBox,
                VerticalListBox,
                VerticalPiElementListBox,
                PiUtils,
                createDefaultBinaryBox,
                createDefaultExpressionBox,
                isPiBinaryExpression,
                ${Names.PiBinaryExpression}
            } from "${PROJECTITCORE}";
            
            import { ${Names.PiElementReference} } from "${relativePath}${LANGUAGE_GEN_FOLDER }/${Names.PiElementReference}";
            import { ${language.concepts.map(c => `${Names.concept(c)}`).join(", ") } } from "${relativePath}${LANGUAGE_GEN_FOLDER }";
            import { ${language.interfaces.map(c => `${Names.interface(c)}`).join(", ") } } from "${relativePath}${LANGUAGE_GEN_FOLDER }";
            import { ${Names.selectionHelpers(language)} } from "./${Names.selectionHelpers(language)}";
            import { ${Names.environment(language)} } from "${relativePath}${ENVIRONMENT_GEN_FOLDER}/${Names.environment(language)}";

             /**
             * Class ${Names.projectionDefault(language)} implements the default projections for elements of
             * language ${language.name}.
             * These are merged with the custom build additions and definition-based editor parts 
             * in a three-way manner. For each modelelement, 
             * (1) if a custom build creator/behavior is present, this is used,
             * (2) if a creator/behavior based on the editor definition is present, this is used,
             * (3) if neither (1) nor (2) yields a result, the default is used.  
             */  
            export class ${Names.projectionDefault(language)} implements ${Names.PiProjection} {
                private helpers: ${Names.selectionHelpers(language)} = new ${Names.selectionHelpers(language)};
                rootProjection: ${Names.PiProjection};
                @observable showBrackets: boolean = false;
                name: string = "${editorDef.name}";
                
                constructor(name?: string) {
                    if (!!name) {
                        this.name = name;
                    }
                }
                
                getBox(exp: ${Names.PiElement}): Box {
                    if( exp === null ) {
                        return null;
                    }

                    switch( exp.piLanguageConcept() ) { 
                        ${language.concepts.map(c => `
                        case "${c.name}" : return this.${Names.projectionFunction(c)} (exp as ${Names.concept(c)});`
                        ).join("  ")}
                    }
                    // nothing fits
                    throw new Error("No box defined for this expression:" + exp.piId());
                }

                ${binaryConceptsWithDefaultProjection.map(c => `
                private ${Names.projectionFunction(c)} (element: ${Names.concept(c)}) {
                     return this.createBinaryBox(this, element, "${editorDef.findConceptEditor(c).symbol}");
                }                
                `).join("\n")}    
                
                ${nonBinaryConceptsWithProjection.map(c => this.generateUserProjection(language, c, editorDef.findConceptEditor(c))).join("\n")}
                
                /**
                 *  Create a standard binary box to ensure binary expressions can be edited easily
                 */
                private createBinaryBox(projection: ${Names.projectionDefault(language)}, exp: PiBinaryExpression, symbol: string): Box {
                    let binBox = createDefaultBinaryBox(this, exp, symbol, ${Names.environment(language)}.getInstance().editor);
                    if (
                        this.showBrackets &&
                        !!exp.piContainer().container &&
                        isPiBinaryExpression(exp.piContainer().container)
                    ) {
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
        `;
    }

    private generateUserProjection(language: PiLanguage, concept: PiConcept, editor: PiEditConcept) {
        let result: string = "";
        const element = Roles.elementName(concept);
        const projection: PiEditProjection = editor.projection;
        const multiLine = projection.lines.length > 1;
        if(multiLine){
            result += `new VerticalListBox(${element}, "${concept.name}-overall", [
            `;
        }

        projection.lines.forEach( (line, index) => {
            if( line.indent > 0) {
                result += `new IndentBox(${element}, "${concept.name}-indent-line-${index}", ${line.indent}, `
            }
            if( line.items.length > 1) {
                result += `new HorizontalListBox(${element}, "${concept.name}-hlist-line-${index}", [ `;
            }
            line.items.forEach((item, itemIndex) => {
                if ( item instanceof PiEditProjectionText ){
                    result += ` new LabelBox(${element}, "${element}-label-line-${index}-item-${itemIndex}", "${item.text}", {
                            style: projectitStyles.${item.style},
                            selectable: false
                        })  `
                    if( itemIndex < line.items.length-1 ){
                        result += ",";
                    }
                } else if( item instanceof PiEditPropertyProjection){
                    const appliedFeature: PiProperty = item.expression.appliedfeature.referredElement.referred;
                    if (appliedFeature instanceof PiPrimitiveProperty){
                        result += this.primitivePropertyProjection(appliedFeature, element);
                    } else if( appliedFeature instanceof PiConceptProperty) {
                        if (appliedFeature.isPart) {
                            if (appliedFeature.isList) {
                                const direction = (!!item.listJoin ? item.listJoin.direction.toString() : PiEditProjectionDirection.Horizontal.toString());
                                result += this.conceptPartListProjection(direction, concept, appliedFeature, element);

                            } else {
                                result += `((!!${element}.${appliedFeature.name}) ?
                                                this.rootProjection.getBox(${element}.${appliedFeature.name}) : 
                                                new AliasBox(${element}, "${Roles.newPart(appliedFeature)}", "[add]", { propertyName: "${appliedFeature.name}" } ))`
                            }
                        } else { // reference
                            if( appliedFeature.isList){
                                const direction = (!!item.listJoin ? item.listJoin.direction.toString() : PiEditProjectionDirection.Horizontal.toString());
                                result += this.conceptReferenceListProjection(direction, appliedFeature, element);
                            }else {
                                result += this.conceptReferenceProjection(language, appliedFeature, element) ;
                            }
                        }
                    } else {
                        result += `/* ERROR unknown property box here for ${appliedFeature.name} */ `;
                    }
                    if(itemIndex !== line.items.length -1 ){
                        result += ", "
                    }
                } else if( item instanceof PiEditSubProjection){
                    result += ` new LabelBox(${element}, "${element}-label-line-${index}-item-${itemIndex}", "OPTIONAL ${item.optional}", {
                            selectable: false
                        })  `
                    if( itemIndex < line.items.length-1 ){
                        result += ",";
                    }
                }
            });
            if( line.items.length > 1) {
                // TODO Too many things are now selectable, but if false, you cannot select e.g. an attribute
                result += ` ], { selectable: true } ) `
            }
            if( line.indent > 0 ){
                // end of line, finish indent when applicable
                result += ` )`;
            }
            if( index !== projection.lines.length -1) {
              result += ",";
            }
        });
        if( multiLine){
            result += ` 
                ])
            `;
        }
        if( result === "" ){ result = "null"}
        if (concept instanceof PiExpressionConcept ){
            return `public ${Names.projectionFunction(concept)} (${element}: ${Names.concept(concept)}) : Box {
                    return createDefaultExpressionBox( ${element}, "default-expression-box", [
                            ${result}
                        ],
                        { selectable: false }
                    );
                }`;
        } else {
            if (result[0] === "\n") {
                // TODO find out where this newline is added and make sure this is not done
                // this error occurred in openhab project for concept ItemModel (!!only for this concept)
                // for now:
                // console.log("FOUND NEWLINE");
                result = result.substr(1);
            }
            return `public ${Names.projectionFunction(concept)} (${element}: ${Names.concept(concept)}) : Box {
                    return ${result};
                }`;
        }
    }

    /**
     * generate the part list
     *
     * @param direction         Horizontal or Vertical.
     * @param propertyConcept   The property for which the projection is generated.
     * @param element           The name of the element parameter of the getBox projection method.
     */
    conceptPartListProjection(direction: string, concept: PiConcept, propertyConcept: PiConceptProperty, element: string) {
        return `
            new ${direction}ListBox(${element}, "${Roles.property(propertyConcept)}-list", 
                ${element}.${propertyConcept.name}.map(feature => {
                    return this.rootProjection.getBox(feature);
                }).concat(
                    new AliasBox(${element}, "${Roles.newConceptPart(concept, propertyConcept)}", "<+>" , { //  add ${propertyConcept.name}
                        style: ${Names.styles}.placeholdertext,
                        propertyName: "${propertyConcept.name}"
                    })
                )
            )`;
    }

    conceptReferenceProjection(language: PiLanguage, appliedFeature: PiConceptProperty, element: string) {
        const featureType = Names.classifier(appliedFeature.type.referred);
        return ` this.helpers.getReferenceBox(${element}, "${Roles.property(appliedFeature)}", "<select ${appliedFeature.name}>", "${featureType}",
                    () => {
                        if (!!${element}.${appliedFeature.name}) {
                            return { id: ${element}.${appliedFeature.name}.name, label: ${element}.${appliedFeature.name}.name };
                        } else {
                            return null;
                        }
                    },
                    (option: SelectOption) => {
                        if (!!option) {
                            ${element}.${appliedFeature.name} = PiElementReference.create<${featureType}>(${Names.environment(language)}.getInstance().scoper.getFromVisibleElements(
                                ${element},
                                option.label,
                                "${featureType}"
                            ) as ${featureType}, "${featureType}");
                        } else {
                            ${element}.${appliedFeature.name} = null;
                        }
                    }
                )
            `
    }

    conceptReferenceProjectionInList(appliedFeature: PiConceptProperty, element: string) {
        const featureType = appliedFeature.type.name;
        return ` this.helpers.getReferenceBox(${element}, "${Roles.property(appliedFeature)}-index", "< select ${appliedFeature.name}>", "${featureType}",
                    () => {
                        if (!!${element}.${appliedFeature.name}) {
                            return { id: ent.name, label: ent.name };
                        } else {
                            return null;
                        }
                    },
                    (option: SelectOption) => {
                        ent.name = option.label;
                    }
                )
            `
    }


    conceptReferenceListProjection(direction: string, reference: PiConceptProperty, element: string) {
        return `new ${direction}ListBox(
                    ${element},
                    "${Roles.property(reference)}",
                    ${element}.${reference.name}.map((ent, index) => {
                        return ${this.conceptReferenceProjectionInList(reference, element) }
                    }), //  this one?
                    {
                        style: ${Names.styles}.indent
                    }
                )
            `
    }

    primitivePropertyProjection(property: PiPrimitiveProperty, element: string): string {
        if (property.isList) {
            // TODO remove this hack
            return this.listPrimitivePropertyProjection(property, element);
        } else {
            return this.singlePrimitivePropertyProjection(property, element);
        }
    }

    singlePrimitivePropertyProjection(property: PiPrimitiveProperty, element: string): string {
        const listAddition: string = `${property.isList ? `[index]` : ``}`;
        switch(property.primType) {
            case "string":
                return `new TextBox(${element}, "${Roles.property(property)}", () => ${element}.${property.name}${listAddition}, (c: string) => (${element}.${property.name}${listAddition} = c as ${"string"}),
                {
                    placeHolder: "text",
                    style: ${Names.styles}.placeholdertext
                })`;
            case "number":
                return `new TextBox(${element}, "${Roles.property(property)}", () => "" + ${element}.${property.name}${listAddition}, (c: string) => (${element}.${property.name}${listAddition} = Number.parseInt(c)) ,
                {
                    placeHolder: "text",
                    style: ${Names.styles}.placeholdertext
                })`;
            case "boolean":
                return `new TextBox(${element}, "${Roles.property(property)}", () => "" + ${element}.${property.name}${listAddition}, (c: string) => (${element}.${property.name}${listAddition} = (c === "true" ? true : false)),
                {
                    placeHolder: "text",
                    style: ${Names.styles}.placeholdertext
                })`;
            default:
                return `new TextBox(${element}, "${Roles.property(property)}", () => ${element}.${property.name}${listAddition}, (c: string) => (${element}.${property.name}${listAddition} = c as ${"string"}),
                {
                    placeHolder: "text",
                    style: ${Names.styles}.placeholdertext
                })`;
        }
    }

    private listPrimitivePropertyProjection(property: PiPrimitiveProperty, element: string) : string {
        return `new HorizontalListBox(${element}, "${Roles.property(property)}-hlist",
                            (${element}.${property.name}.map( (item, index)  =>
                                ${this.singlePrimitivePropertyProjection(property, element)}
                            ) as Box[]).concat( [
                                // TODO  Create Action for the role to actually add an element.
                                new AliasBox(${element}, "new-${Roles.property(property)}-hlist", "<+>")
                            ])
                        ),`;
    }
}
