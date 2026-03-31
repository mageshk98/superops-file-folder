import React, { useState } from "react";
import { File } from "./File";
import "./styles.css";

export default function Folder({ data, schema, updateCallback }) {
  const [showChildren, setShowChildren] = useState(false);

  if (!data) return null;

  const addFolder = () => {
    updateCallback({ type: "add-folder", id: data.id });
  };
  const deleteFolder = () => {
    updateCallback({ type: "delete-folder", id: data.id });
  };

  return (
    <div data-id={data.id} className={"folder"}>
      <p>
        <span>{showChildren ? "📂" : "📁"}</span>
        <span onClick={() => setShowChildren((prev) => !prev)}>
          &nbsp;{data.name}&nbsp;
        </span>
        <span onClick={addFolder}>➕</span>
        &nbsp;
        <span onClick={deleteFolder}>🗑️</span>
      </p>
      {showChildren && (
        <ul>
          {data.children.map((child) => (
            <FileFolder
              key={child.id}
              data={schema[child.id]}
              schema={schema}
              updateCallback={updateCallback}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function FileFolder({ data, ...rest }) {
  if (!data) return null;

  if (data.type === "folder") {
    return <Folder data={data} {...rest} />;
  }

  return <File data={data} {...rest} />;
}
