import "./styles.css";
import initialSchema from "./MOCKDATA.json";
import { v4 as uuidv4 } from "uuid";
import Folder from "./Components/Folder";
import { useState } from "react";

const collectChildFiles = (id, schema) => {
  const toDelete = new Set([id]);

  const dfs = (nodeId) => {
    const node = schema[nodeId];
    if (node?.type === "folder" && node.children) {
      node.children.forEach((child) => {
        toDelete.add(child.id);
        dfs(child.id);
      });
    }
  };

  dfs(id);
  return toDelete;
};

export default function App() {
  const [schema, setSchema] = useState(initialSchema);

  const updateSchema = (payload) => {
    switch (payload.type) {
      case "add-folder": {
        const folderId = payload.id;
        const currentFolder = schema[folderId];
        const currentFolder_length = schema[folderId]?.children.filter(
          (f) => f.type === "folder"
        ).length;
        const newId = uuidv4();

        const newFolder = {
          id: newId,
          type: "folder",
          name: `Untitled_folder_${currentFolder_length + 1}`,
          children: [],
        };

        const updatedSchema = {
          ...schema,
          [folderId]: {
            ...currentFolder,
            children: [
              ...currentFolder.children,
              { id: newId, type: "folder" },
            ],
          },
          [newId]: newFolder,
        };

        setSchema(updatedSchema);
        break;
      }
      case "delete-folder": {
        const folderId = payload.id;
        const toDelete = collectChildFiles(folderId, schema);

        const newSchema = Object.fromEntries(
          Object.entries(schema).filter(([id]) => !toDelete.has(id))
        );
        for (const [id, node] of Object.entries(newSchema)) {
          if (node.type === "folder") {
            newSchema[id] = {
              ...node,
              children: node.children.filter(
                (child) => !toDelete.has(child.id)
              ),
            };
          }
        }
        setSchema(newSchema);
        break;
      }
      case "delete-file": {
        const fileId = payload.id;

        const schemaWithoutFile = { ...schema };
        delete schemaWithoutFile[fileId];

        for (const key in schemaWithoutFile) {
          const node = schemaWithoutFile[key];
          if (node.type === "folder") {
            node.children = node.children.filter(
              (child) => child.id !== fileId
            );
          }
        }

        setSchema(schemaWithoutFile);
        break;
      }

      default:
        console.log(payload.type, "Not found");
    }
  };

  return (
    <div className="App">
      <Folder
        data={schema["root"]}
        schema={schema}
        updateCallback={updateSchema}
      />
    </div>
  );
}
