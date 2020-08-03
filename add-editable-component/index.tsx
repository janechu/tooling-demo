import React from "react";
import ReactDOM from "react-dom";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { MessageSystem } from "@microsoft/fast-tooling";
import { ModularForm, ModularNavigation } from "@microsoft/fast-tooling-react";
import { nativeElementExtendedSchemas } from "./native-element-schemas";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;

interface ExampleState {
    data: any;
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
                            schemaId: "div",
                            data: {}
                        },
                    },
                    "root",
                ],
                schemaDictionary: nativeElementExtendedSchemas,
            });
            fastMessageSystem.add({
                onMessage: this.handleMessageSystem,
            });
        }

        this.state = {
            data: {},
        };
    }

    public render() {
        return (
            <div>
                <ModularNavigation messageSystem={fastMessageSystem} />
                <pre>{this.state.data}</pre>
                <ModularForm messageSystem={fastMessageSystem} />
            </div>
        );
    }

    private handleMessageSystem = (e): void => {
        if (
            e.data &&
            typeof e.data.data === "string" &&
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
    <DndProvider backend={HTML5Backend}>
        <Example />
    </DndProvider>,
    document.getElementById("root")
);
