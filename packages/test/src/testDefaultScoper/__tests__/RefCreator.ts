import { ScoperTestDefaultWorker } from "../utils/gen";
import { DSmodel, DSprivate, DSpublic, DSref, DSunit, PiElementReference } from "../language/gen";

export class RefCreator extends ScoperTestDefaultWorker {
    references: PiElementReference<DSref>[] = [];

    /**
     * Visits 'modelelement' before visiting its children.
     * @param modelelement
     */
    public execBeforeDSunit(modelelement: DSunit): boolean {
        const modelName = (modelelement.piContainer().container as DSmodel).name;
        const unitName = modelelement.name;
        modelelement.dsPublics.forEach(pub => {
            // this.references.push(PiElementReference.create<DSref>([modelName, unitName, pub.name], "DSref"));
            this.references.push(PiElementReference.create<DSref>([unitName, pub.name], "DSref"));
            this.references.push(PiElementReference.create<DSref>([pub.name], "DSref"));
        });
        modelelement.dsPrivates.forEach(pub => {
            // this.references.push(PiElementReference.create<DSref>([modelName, unitName, pub.name], "DSref"));
            this.references.push(PiElementReference.create<DSref>([unitName, pub.name], "DSref"));
            this.references.push(PiElementReference.create<DSref>([pub.name], "DSref"));
        })
        return false;
    }

    /**
     * Visits 'modelelement' before visiting its children.
     * @param modelelement
     */
    public execBeforeDSpublic(modelelement: DSpublic): boolean {
        this.allReferences(modelelement);
        return false;
    }

    private allReferences(modelelement: DSpublic) {
        const grandparentName = (modelelement.piContainer().container as DSmodel).name;
        const parentName = modelelement.name;
        modelelement.conceptParts.forEach(pub => {
            this.references.push(PiElementReference.create<DSref>([grandparentName, parentName, pub.name], "DSref"));
            this.references.push(PiElementReference.create<DSref>([parentName, pub.name], "DSref"));
            this.references.push(PiElementReference.create<DSref>([pub.name], "DSref"));
        });
        modelelement.conceptPrivates.forEach(pub => {
            this.references.push(PiElementReference.create<DSref>([grandparentName, parentName, pub.name], "DSref"));
            this.references.push(PiElementReference.create<DSref>([parentName, pub.name], "DSref"));
            this.references.push(PiElementReference.create<DSref>([pub.name], "DSref"));
        });
    }

    /**
     * Visits 'modelelement' before visiting its children.
     * @param modelelement
     */
    public execBeforeDSprivate(modelelement: DSprivate): boolean {
        this.allReferences(modelelement);
        return false;
    }

}
