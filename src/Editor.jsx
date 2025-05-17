// Editor.jsx
import React, { useMemo, useState } from "react";
import { createEditor, Editor, Element as SlateElement } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import Toolbar from "./ToolBar";

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "horizontal-rule":
      return (
        <div {...attributes}>
          <hr />
          {children}
        </div>
      );
    case "image":
      return (
        <div {...attributes} contentEditable={false}>
          <img src={element.url} alt="" style={{ maxWidth: "100%" }} />
          {children}
        </div>
      );
    case "video":
      return (
        <div {...attributes} contentEditable={false}>
          <video controls style={{ maxWidth: "100%" }}>
            <source src={element.url} type="video/mp4" />
          </video>
          {children}
        </div>
      );
    case "table":
      return (
        <table {...attributes}>
          <tbody>{children}</tbody>
        </table>
      );
    case "table-row":
      return <tr {...attributes}>{children}</tr>;
    case "table-cell":
      return (
        <td
          {...attributes}
          style={{ border: "1px solid #ccc", padding: "8px" }}
        >
          {children}
        </td>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.fontSize)
    children = <span style={{ fontSize: leaf.fontSize }}>{children}</span>;
  return <span {...attributes}>{children}</span>;
};

const SlateEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);

  return (
    <Slate
      editor={editor}
      value={value}
      initialValue={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <Toolbar />
      <Editable
        renderElement={(props) => <Element {...props} />}
        renderLeaf={(props) => <Leaf {...props} />}
        placeholder="Type something..."
        spellCheck
        autoFocus
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: 12,
          minHeight: "300px",
        }}
      />
    </Slate>
  );
};

export default SlateEditor;
