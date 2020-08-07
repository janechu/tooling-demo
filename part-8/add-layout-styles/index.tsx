import React from "react";
import ReactDOM from "react-dom";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { MessageSystem, MessageSystemType } from "@microsoft/fast-tooling";
import { ModularForm, ModularNavigation, ModularViewer } from "@microsoft/fast-tooling-react";
import { nativeElementExtendedSchemas } from "./native-element-configs";
import { previewReady } from "./preview";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;

interface ExampleState {
    data: any;
    width: number;
    height: number;
}

class Example extends React.Component<{}, ExampleState> {
    constructor(props) {
        super(props);

        if ((window as any).Worker) {
            fastMessageSystem = new MessageSystem({
                webWorker: fastMessageSystemWorker
            });
            fastMessageSystem.add({
                onMessage: this.handleMessageSystem,
            });
        }

        this.state = {
            data: {},
            width: 300,
            height: 300,
        };
    }

    public render() {
        return (
            <div style={{
                display: "grid",
                gridTemplateColumns: "300px auto 300px",
                height: "100vh"
            }}>
                <ModularNavigation messageSystem={fastMessageSystem} />
                <ModularViewer messageSystem={fastMessageSystem} iframeSrc="/preview.html" responsive={true} width={this.state.width} height={this.state.height} onUpdateHeight={this.handleUpdateHeight} onUpdateWidth={this.handleUpdateWidth} />
                <ModularForm messageSystem={fastMessageSystem} />
            </div>
        );
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

        if (
            e.data &&
            e.data.type === MessageSystemType.custom &&
            e.data.value === previewReady
        ) {
            fastMessageSystem.postMessage({
                type: MessageSystemType.initialize,
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
        }
    };

    private handleUpdateWidth = (width: number): void => {
        this.setState({
            width
        });
    }

    private handleUpdateHeight = (height: number): void => {
        this.setState({
            height
        });
    }
}

const root: HTMLElement | null = document.getElementById("root");

if (root) {
    /**
     * Primary render function for app. Called on store updates
     */
    ReactDOM.render(
        <DndProvider backend={HTML5Backend}>
            <Example />
        </DndProvider>,
        root
    );
}
