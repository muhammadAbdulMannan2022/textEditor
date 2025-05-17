import { Editor, Transforms, Element as SlateElement, Path } from "slate";

// ----------- Constants -------------
export const FONT_SIZES = ["12px", "16px", "20px", "24px", "30px"];
export const LIST_TYPES = ["numbered-list", "bulleted-list"];

// ----------- Mark Utilities -------------

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const getActiveFontSize = (editor) => {
  const marks = Editor.marks(editor);
  return marks && marks.fontSize ? marks.fontSize : null;
};

export const toggleFontSize = (editor, size) => {
  const currentSize = getActiveFontSize(editor);
  if (currentSize === size) {
    Editor.removeMark(editor, "fontSize");
  } else {
    Editor.addMark(editor, "fontSize", size);
  }
};

// ----------- Block Utilities -------------

export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  });

  let newType = isActive ? "paragraph" : isList ? "list-item" : format;
  Transforms.setNodes(editor, { type: newType });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// ----------- Insertion Utilities -------------

export const insertImageFile = (editor, file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const url = reader.result;
    const image = { type: "image", url, children: [{ text: "" }] };
    Transforms.insertNodes(editor, image);

    const [imageEntry] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "image",
    });

    if (imageEntry) {
      const [, imagePath] = imageEntry;
      const nextPath = Path.next(imagePath);
      Transforms.insertNodes(
        editor,
        { type: "paragraph", children: [{ text: "" }] },
        { at: nextPath }
      );
      Transforms.select(editor, Editor.start(editor, nextPath));
    }
  };
  reader.readAsDataURL(file);
};

export const insertVideoFile = (editor, file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const url = reader.result;
    const video = { type: "video", url, children: [{ text: "" }] };
    Transforms.insertNodes(editor, video);

    const [videoEntry] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "video",
    });

    if (videoEntry) {
      const [, videoPath] = videoEntry;
      const nextPath = Path.next(videoPath);
      Transforms.insertNodes(
        editor,
        { type: "paragraph", children: [{ text: "" }] },
        { at: nextPath }
      );
      Transforms.select(editor, Editor.start(editor, nextPath));
    }
  };
  reader.readAsDataURL(file);
};

export const insertHorizontalRule = (editor) => {
  const hr = { type: "horizontal-rule", children: [{ text: "" }] };
  Transforms.insertNodes(editor, hr);
};

export const insertTable = (editor) => {
  const table = {
    type: "table",
    children: [
      {
        type: "table-row",
        children: [
          {
            type: "table-cell",
            children: [{ type: "paragraph", children: [{ text: "" }] }],
          },
          {
            type: "table-cell",
            children: [{ type: "paragraph", children: [{ text: "" }] }],
          },
        ],
      },
      {
        type: "table-row",
        children: [
          {
            type: "table-cell",
            children: [{ type: "paragraph", children: [{ text: "" }] }],
          },
          {
            type: "table-cell",
            children: [{ type: "paragraph", children: [{ text: "" }] }],
          },
        ],
      },
    ],
  };
  Transforms.insertNodes(editor, table);

  const [tableEntry] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === "table",
  });

  if (tableEntry) {
    const [, tablePath] = tableEntry;
    const nextPath = Path.next(tablePath);
    Transforms.insertNodes(
      editor,
      { type: "paragraph", children: [{ text: "" }] },
      { at: nextPath }
    );
    Transforms.select(editor, Editor.start(editor, nextPath));
  }
};

// ----------- Removal Utilities -------------

export const removeNode = (editor) => {
  if (!editor.selection) return;

  const [match] = Editor.nodes(editor, {
    match: (n) =>
      SlateElement.isElement(n) && ["image", "video", "table"].includes(n.type),
    mode: "highest",
  });

  if (match) {
    Transforms.removeNodes(editor, { at: match[1] });
  }
};
