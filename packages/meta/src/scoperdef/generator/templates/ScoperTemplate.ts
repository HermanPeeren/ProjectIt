import { PiLangExp, PiLangFunctionCallExp, PiLanguageUnit } from "../../../languagedef/metalanguage";
import { Names, LANGUAGE_GEN_FOLDER, PROJECTITCORE, TYPER_GEN_FOLDER, ENVIRONMENT_GEN_FOLDER, langExpToTypeScript } from "../../../utils";
import { PiScopeDef } from "../../metalanguage";

export class ScoperTemplate {
    hasAlternativeScopeText: string = '';
    getAlternativeScopeText: string = '';
    alternativeScopeImports: string = '';

    generateIndex(language: PiLanguageUnit): string {
        return `
        export * from "./${Names.scoper(language)}";
        export * from "./${Names.namespace(language)}";
        `;
    }

    generateScoper(language: PiLanguageUnit, scopedef: PiScopeDef, relativePath: string): string {
        const allLangConcepts : string = Names.allConcepts(language);
        const langConceptType : string = Names.metaType(language);
        const generatedClassName : string = Names.scoper(language);
        const namespaceClassName : string = Names.namespace(language);
        const scoperInterfaceName : string = Names.PiScoper;
        const typerClassName : string = Names.typer(language);

        let generateAlternativeScopes = false;
        if (!!scopedef) {
            this.makeAlternativeScopeTexts(scopedef, language);
            if (this.hasAlternativeScopeText.length > 0) generateAlternativeScopes = true;
        } else {
            // generate default
            scopedef = new PiScopeDef();
            scopedef.languageName = language.name;
            scopedef.namespaces = [];
        }

        // Template starts here
        return `
        import { ${allLangConcepts}, ${langConceptType}, ${scopedef.namespaces.map(ref => `${ref.name}`).join(", ")}${this.alternativeScopeImports} } from "${relativePath}${LANGUAGE_GEN_FOLDER}";
        import { ${namespaceClassName} } from "./${namespaceClassName}";
        import { ${scoperInterfaceName},  ${Names.PiNamedElement}, PiLogger } from "${PROJECTITCORE}"
        ${generateAlternativeScopes? `import { ${typerClassName} } from "${relativePath}${TYPER_GEN_FOLDER}";
                                      import { ${Names.environment(language)} } from "${relativePath}${ENVIRONMENT_GEN_FOLDER}/${Names.environment(language)}";`:`` }  
        ${scopedef.namespaces.length == 0?
            `import { ${language.rootConcept.name} } from "${relativePath}${LANGUAGE_GEN_FOLDER}";` : ``}              
                                   
        const LOGGER = new PiLogger("${generatedClassName}");        
        export class ${generatedClassName} implements ${scoperInterfaceName} {
            ${generateAlternativeScopes? `myTyper: ${typerClassName};` : ``}
    
            getVisibleElements(modelelement: ${allLangConcepts}, metatype?: ${langConceptType}, excludeSurrounding? : boolean): PiNamedElement[] {
                ${generateAlternativeScopes? `this.myTyper = ${Names.environment(language)}.getInstance().typer as ${typerClassName};` : ``}
                let result: PiNamedElement[] = [];
                if (!!modelelement) {
                    let doSurrouding: boolean = !(!(excludeSurrounding === undefined) && excludeSurrounding);
                    let nearestNamespace: ${namespaceClassName};
                    // first, see if we need to use an alternative scope/namespace
                    if (this.hasAlternativeScope(modelelement)) {
                        nearestNamespace = this.getAlternativeScope(modelelement);
                        // do not search surrounding namespaces for alternative scopes
                        doSurrouding = false;
                    } else {
                        nearestNamespace = this.findNearestNamespace(modelelement);
                    }
                    // second, get the element from the found namespace
                    if (!!nearestNamespace) result = nearestNamespace.getVisibleElements(metatype);
            
                    // third, get the elements from any surrounding namespaces
                    let parentElement = this.getParent(modelelement);
                    while (doSurrouding) {
                        let parentNamespace = this.findNearestNamespace(parentElement);
                        if (!!parentNamespace) {
                            // join the results with shadowing
                            ${namespaceClassName}.joinResultsWithShadowing(parentNamespace.getVisibleElements(metatype), result);
                            parentElement = this.getParent(parentElement);
                        } else {
                            doSurrouding = false;
                        }
                    }
                } else {
                    LOGGER.error(this, "getVisibleElements: modelelement is null");
                    return result;
                }
                return result;
            }
        
            getFromVisibleElements(modelelement: ${allLangConcepts}, name : string, metatype?: ${langConceptType}, excludeSurrounding? : boolean) : PiNamedElement {
                let vis = this.getVisibleElements(modelelement, metatype, excludeSurrounding);
                if (vis !== null) {
                    for (let e of vis) {
                        let n: string = e.name;
                        if (name === n) {
                            return e;
                        }  
                    }
                }    
                return null;
            }
            
            getVisibleNames(modelelement: ${allLangConcepts}, metatype?: ${langConceptType}, excludeSurrounding? : boolean) : string[] {
                let result: string[] = [];
                let vis = this.getVisibleElements(modelelement, metatype, excludeSurrounding);
                for (let e of vis) {
                    let n: string = e.name;
                    result.push(n);                    
                }
                return result;
            }
            
            isInScope(modelElement: ${allLangConcepts}, name: string, metatype?: ${langConceptType}, excludeSurrounding? : boolean) : boolean {
                if (this.getFromVisibleElements(modelElement, name, metatype, excludeSurrounding) !== null) {
                    return true;
                } else {
                    return false;
                }
            }
            
             /**
             * returns the enclosing namespace for 'modelelement'
             * @param modelelement
             */
            private findNearestNamespace(modelelement: ${allLangConcepts}): ${namespaceClassName} {
                if (modelelement === null) {
                    return null;
                }
                if (this.isNameSpace(modelelement)) {
                    return ${namespaceClassName}.create(modelelement);
                } else {
                    return this.findNearestNamespace(this.getParent(modelelement));
                }
            }
        
            /**
             * returns true if 'modelelement' is marked by 'isnamespace' in the scoper definition
             * @param modelelement
             */
            private isNameSpace(modelelement: ${allLangConcepts}): boolean {
                // if-statement generated for each concept marked with @namespace annotation
                // or for the model root if there are no namespaces defined in the scoper definition
                ${scopedef.namespaces.map(ref => `if(modelelement instanceof ${ref.name}) return true;`).join("\n")}
                ${scopedef.namespaces.length == 0?
                    `if(modelelement instanceof ${language.rootConcept.name}) return true;` : ``}              
                return false;
            }
        
            /**
             * returns the element in the abstract syntax tree that contains 'modelelement'
             * @param modelelement
             */
            private getParent(modelelement: ${allLangConcepts}): ${allLangConcepts} {
                let parent: ${allLangConcepts} = null;
                if (modelelement.piContainer() !== null) {
                    if (modelelement.piContainer().container !== null) {
                        // if (modelelement.piContainer().container instanceof ${allLangConcepts}) {
                        parent = modelelement.piContainer().container as ${allLangConcepts};
                        // }
                    }
                }
                return parent;
            }
        
             /**
             *  returns the namespace to be used as alternative scope for 'modelelement'
             * @param modelelement
             */
            private getAlternativeScope(modelelement: ${allLangConcepts}): ${namespaceClassName} {
                ${this.getAlternativeScopeText}
                return null;
            }
        
             /**
             * returns true if there is an alternative scope defined for this modelelement
             * @param modelelement
             */
            private hasAlternativeScope(modelelement: ${allLangConcepts}) {
                ${this.hasAlternativeScopeText}
                return false;
            }
        }`;

        this.hasAlternativeScopeText = "";
        this.getAlternativeScopeText = "";
    }

    private makeAlternativeScopeTexts(scopedef: PiScopeDef, language: PiLanguageUnit) {
        const allLangConcepts : string = Names.allConcepts(language);
        const namespaceClassName : string = Names.namespace(language);
        for (let def of scopedef.scopeConceptDefs) {
            if (!!def.alternativeScope) {
                let conceptName = def.conceptRef.referred.name;
                // we are adding to three textstrings
                // first, to the import statements
                this.alternativeScopeImports = this.alternativeScopeImports.concat(", " + conceptName);

                // second, to the 'hasAlternativeScope' method
                this.hasAlternativeScopeText = this.hasAlternativeScopeText.concat(
                    `if (!!modelelement && modelelement instanceof ${conceptName}) {
                        return true;
                     }`);

                // third, to the 'getAlternativeScope' method
                this.getAlternativeScopeText = this.getAlternativeScopeText.concat(
                    `if (!!modelelement && modelelement instanceof ${conceptName}) {
                        // use alternative scope '${def.alternativeScope.expression.toPiString()}'
                        ${this.altScopeExpToTypeScript(def.alternativeScope.expression, allLangConcepts, language)}
                    }`);
            }
        }
    }

    private altScopeExpToTypeScript(expression: PiLangExp, allLangConcepts: string, language: PiLanguageUnit): string {
        let result = ``;
        // special case: the expression refers to 'typeof'
        if (expression instanceof  PiLangFunctionCallExp && expression.sourceName === "typeof") {
            let actualParamToGenerate: string = ``;
            // we know that typeof has exactly 1 actual parameter
            if( expression.actualparams[0].sourceName === "container" ) {
                actualParamToGenerate = `modelelement.piContainer().container as ${allLangConcepts}`;
            } else {
                actualParamToGenerate = langExpToTypeScript(expression.actualparams[0]);
            }
            result = `let container = ${actualParamToGenerate};
                if (!!container) {
                    let newScopeElement = this.myTyper.inferType(${actualParamToGenerate});
                    return ${Names.namespace(language)}.create(newScopeElement);
                }`
        } else {
            // normal case: the expression is an ordinary expression over the language
            result = langExpToTypeScript(expression);
        }
        return result;
    }
}
