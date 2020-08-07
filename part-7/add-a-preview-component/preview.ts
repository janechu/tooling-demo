import {
    DataMessageOutgoing,
    htmlResolver,
    htmlMapper,
    InitializeMessageOutgoing,
    mapDataDictionary,
    MessageSystemOutgoing,
    MessageSystemType,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";
import {
    WebComponentDefinition,
    WebComponentDefinitionTag,
} from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { nativeElementExtendedDefinitions } from "./native-element-configs";

export const previewReady: string = "PREVIEW::READY";
let schemaDictionary: SchemaDictionary = {};
const handleMessage = function(message: MessageEvent): void {
    if (message.origin === location.origin) {
        let messageData: unknown;

        try {
            messageData = JSON.parse(message.data);
        } catch (e) {
            return;
        }

        if (messageData !== undefined) {
            switch ((messageData as MessageSystemOutgoing).type) {
                case MessageSystemType.initialize:
                    schemaDictionary = (messageData as InitializeMessageOutgoing).schemaDictionary;
                case MessageSystemType.data:
                    render(messageData as DataMessageOutgoing);
                    break;
            }
        }
    }
}

const render = function(message: DataMessageOutgoing | InitializeMessageOutgoing): void {
    const previewElement: HTMLElement | null = document.getElementById("preview");

    if (previewElement) {
        previewElement.innerText = "";
        previewElement.appendChild(
            mapDataDictionary({
                dataDictionary: message.dataDictionary,
                schemaDictionary,
                resolver: htmlResolver,
                mapper: htmlMapper({
                    version: 1,
                    tags: Object.entries({
                        ...nativeElementExtendedDefinitions,
                    }).reduce(
                        (
                            previousValue: WebComponentDefinitionTag[],
                            currentValue: [string, WebComponentDefinition]
                        ) => {
                            if (Array.isArray(currentValue[1].tags)) {
                                return previousValue.concat(currentValue[1].tags);
                            }

                            return previousValue;
                        },
                        []
                    ),
                })
            })
        );
    }
}

window.addEventListener("message", handleMessage);

window.postMessage(
    {
        type: MessageSystemType.custom,
        action: ViewerCustomAction.call,
        value: previewReady,
    },
    "*"
);
