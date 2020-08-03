import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { commonHTMLAttributes } from "./common";

export const paragraphDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "p",
            description: "The paragraph element",
            attributes: commonHTMLAttributes,
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
    ],
};
