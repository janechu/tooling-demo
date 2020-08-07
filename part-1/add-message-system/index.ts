import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import {
    MessageSystem,
} from "@microsoft/fast-tooling";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;

if ((window as any).Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: [
            {
                root: {
                    schemaId: "text",
                    data: "Hello world",
                },
            },
            "root",
        ],
        schemaDictionary: {
            text: {
                id: "text",
                type: "string",
            },
        },
    });
}
