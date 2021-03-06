// ref: https://github.com/microsoft/vscode-css-languageservice

import {
  Connection,
  TextDocuments,
  createConnection,
  ProposedFeatures,
  InitializedParams,
  TextDocumentSyncKind
} from "vscode-languageserver";

import { Engine } from "paperclip";
import { createServices } from "./services";
import { VSCServiceBridge } from "./bridge";

const connection = createConnection(ProposedFeatures.all);

connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that the server supports code completion
      // completionProvider: {
      //   resolveProvider: true
      // },
      documentLinkProvider: {
        resolveProvider: true
      },
      colorProvider: true,
      definitionProvider: true
    }
  };
});

const init = async (
  connection: Connection
) => {
  // Paperclip engine for parsing & evaluating documents
  const engine = new Engine();

  // Language service for handling information about the document such as colors, references,
  // etc
  const services = createServices(engine);

  // Bridges language services to VSCode
  new VSCServiceBridge(engine, services, connection);
};

connection.onInitialized((_params: InitializedParams) => {
  init(connection);
});

connection.listen();
