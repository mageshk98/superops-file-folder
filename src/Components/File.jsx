import React from "react";

export function File({ data, updateCallback }) {
  if (!data) return;
  const deleteFile = () => {
    updateCallback({ type: "delete-file", id: data.id });
  };
  return (
    <div data-id={data.id}>
      <span>📄&nbsp;</span>
      {data?.name}
      &nbsp;
      <span onClick={deleteFile}>🗑️</span>
    </div>
  );
}
