import React from "react";
import ReactDOM from "react-dom";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { MessageSystem, MessageSystemDataTypeAction, MessageSystemType } from "@microsoft/fast-tooling";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;

interface ExampleState {
    data: string;
}

class Example extends React.Component<{}, ExampleState> {
    constructor(props) {
        super(props);

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
                        title: "Text",
                        id: "text",
                        type: "string",
                    },
                },
            });
            fastMessageSystem.add({
                onMessage: this.handleMessageSystem,
            });
        }

        this.state = {
            data: "Hello world",
        };
    }

    public render() {
        return (
            <div>
                <input type="text" value={this.state.data} onChange={this.handleOnChange} />
                <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </div>
        );
    }

    private handleOnChange = (e): void => {
        fastMessageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.update,
            dataLocation: "",
            data: e.target.value,
        });
    }

    private handleMessageSystem = (e): void => {
        if (
            e.data &&
            typeof e.data.data !== "undefined" &&
            e.data.data !== this.state.data
        ) {
            this.setState({
                data: e.data.data,
            });
        }
    };
}

/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(
    <Example />,
    document.getElementById("root")
);
