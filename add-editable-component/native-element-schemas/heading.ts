import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { commonHTMLAttributes } from "./common";

export const headingDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "h1",
            description: "The heading element",
            attributes: commonHTMLAttributes,
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
        {
            name: "h2",
            description: "The heading element",
            attributes: commonHTMLAttributes,
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
        {
            name: "h3",
            description: "The heading element",
            attributes: commonHTMLAttributes,
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
        {
            name: "h4",
            description: "The heading element",
            attributes: commonHTMLAttributes,
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
        {
            name: "h5",
            description: "The heading element",
            attributes: commonHTMLAttributes,
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
        {
            name: "h6",
            description: "The heading element",
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
