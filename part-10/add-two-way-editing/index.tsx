import React from "react";
import ReactDOM from "react-dom";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { html_beautify } from "vscode-html-languageservice/lib/esm/beautify/beautify-html";
import { MessageSystem, MessageSystemType, DataDictionary } from "@microsoft/fast-tooling";
import { ModularForm, ModularNavigation, ModularViewer } from "@microsoft/fast-tooling-react";
import { nativeElementExtendedSchemas } from "./native-element-configs";
import { previewReady } from "./preview";
import { mapDataDictionaryToMonacoEditorHTML } from "@microsoft/fast-tooling/dist/data-utilities/monaco";
import { MonacoAdaptor } from "@microsoft/fast-tooling/dist/data-utilities/monaco-adaptor";
import {
    MonacoAdaptorAction,
    MonacoAdaptorActionCallbackConfig,
} from "@microsoft/fast-tooling/dist/data-utilities/monaco-adaptor-action";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let fastMessageSystem: MessageSystem;

interface ExampleState {
    data: any;
    width: number;
    height: number;
}

class Example extends React.Component<{}, ExampleState> {
    private editor: monaco.editor.IStandaloneCodeEditor;
    private monacoValue: string[];
    private monacoEditorModel: monaco.editor.ITextModel;
    private adapter: MonacoAdaptor;
    private firstRun: boolean = true;

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

        this.monacoValue = [];

        this.adapter = new MonacoAdaptor({
            messageSystem: fastMessageSystem,
            actions: [
                new MonacoAdaptorAction({
                    id: "monaco.setValue",
                    action: (config: MonacoAdaptorActionCallbackConfig): void => {
                        // trigger an update to the monaco value that
                        // also updates the DataDictionary which fires a
                        // postMessage to the MessageSystem
                        config.updateMonacoModelValue(this.monacoValue);
                    },
                }),
            ],
        });

        monaco.editor.onDidCreateModel((listener: monaco.editor.ITextModel) => {
            this.monacoEditorModel = monaco.editor.getModel(
                listener.uri
            ) as monaco.editor.ITextModel;

            this.monacoEditorModel.onDidChangeContent(
                (e: monaco.editor.IModelContentChangedEvent) => {
                    /**
                     * Sets the value to be used by monaco
                     */
                    const modelValue = this.monacoEditorModel.getValue();
                    this.monacoValue = Array.isArray(modelValue)
                        ? modelValue
                        : [modelValue];
                
                    if (!this.firstRun) {
                        this.adapter.action("monaco.setValue").run();
                    }

                    this.firstRun = false;
                }
            );
        });

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
                gridTemplateRows: "auto 400px",
                height: "100vh"
            }}>
                <ModularNavigation jssStyleSheet={{
                    navigation: {
                        gridColumnStart: "1",
                        gridRowStart: "1",
                        gridRowEnd: "3",
                    }
                }} messageSystem={fastMessageSystem} />
                <ModularViewer jssStyleSheet={{
                    viewer: {
                        gridColumnStart: "2",
                        gridRowStart: "1",
                        gridRowEnd: "1",
                    }
                }} messageSystem={fastMessageSystem} iframeSrc="/preview.html" responsive={true} width={this.state.width} height={this.state.height} onUpdateHeight={this.handleUpdateHeight} onUpdateWidth={this.handleUpdateWidth} />
                <div id="monaco" style={{
                    position: "relative",
                    overflow: "hidden",
                    gridColumnStart: "2",
                    gridRowStart: "2",
                    gridRowEnd: "2",
                }}></div>
                <ModularForm jssStyleSheet={{
                    form: {
                        gridColumnStart: "3",
                        gridRowStart: "1",
                        gridRowEnd: "3",
                    }
                }} messageSystem={fastMessageSystem} />
            </div>
        );
    }

    public componentDidMount = () => {
        this.editor = monaco.editor.create(document.getElementById("monaco") as HTMLElement, {
            value: "",
            language: "html",
            formatOnPaste: true,
            lineNumbers: "off",
            theme: "vs-dark",
            wordWrap: "on",
            wordWrapColumn: 80,
            wordWrapMinified: true,
            wrappingIndent: "same",
            minimap: {
                showSlider: "mouseover",
            },
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

        if (
            e.data.type === MessageSystemType.data ||
            e.data.type === MessageSystemType.initialize
        ) {
            if (!e.data.options || e.data.options.from !== "monaco-adaptor") {
                this.updateEditorContent(e.data.dataDictionary);
            }
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

    private updateEditorContent(dataDictionary: DataDictionary<unknown>): void {
        this.editor.setValue(
            html_beautify(
                mapDataDictionaryToMonacoEditorHTML(dataDictionary, nativeElementExtendedSchemas)
            )
        );
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
