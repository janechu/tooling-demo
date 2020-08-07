import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { commonHTMLAttributes } from "./common";

export const divDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "div",
            description: "The div element",
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
