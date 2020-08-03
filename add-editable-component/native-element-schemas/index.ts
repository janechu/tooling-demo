import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import textSchema from "./text";
import {
    divDefinition
} from "./div";
import {
    headingDefinition
} from "./heading";
import {
    imageDefinition
} from "./image";
import {
    paragraphDefinition
} from "./paragraph";

const nativeElementExtendedDefinitions: { [key: string]: WebComponentDefinition } = {
    divDefinition,
    headingDefinition,
    imageDefinition,
    paragraphDefinition
};
const nativeElementExtendedSchemas: { [key: string]: any } = {
    [textSchema.id]: textSchema
};

function mapToJSONSchemas(
    definitions: { [key: string]: WebComponentDefinition },
    schemas: { [key: string]: any }
): void {
    Object.entries(definitions).forEach(
        ([, definition]: [string, WebComponentDefinition]) => {
            mapWebComponentDefinitionToJSONSchema(definition).forEach(
                (definitionTagItem: any) => {
                    const jsonSchema = definitionTagItem;
                    schemas[jsonSchema.$id] = jsonSchema;
                }
            );
        }
    );
}

mapToJSONSchemas(nativeElementExtendedDefinitions, nativeElementExtendedSchemas);

export { nativeElementExtendedSchemas };
