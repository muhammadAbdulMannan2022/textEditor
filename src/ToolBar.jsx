// ToolBar.jsx
import React, { useRef, useState, useEffect } from "react";
import { useSlate } from "slate-react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaCode,
  FaFont,
  FaHeading,
  FaListUl,
  FaListOl,
  FaMinus,
  FaTable,
  FaImage,
  FaUpload,
  FaTrash,
} from "react-icons/fa";
import {
  isMarkActive,
  toggleMark,
  getActiveFontSize,
  toggleFontSize,
  isBlockActive,
  toggleBlock,
  insertImageFile,
  insertVideoFile,
  insertHorizontalRule,
  insertTable,
  removeNode,
} from "./ToolBarUtils";

const FONT_SIZES = ["12px", "16px", "20px", "24px", "30px"];

const Toolbar = () => {
  const editor = useSlate();
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const activeFontSize = getActiveFontSize(editor);
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    const { selection } = editor;
    const handler = () => forceUpdate((prev) => prev + 1);

    const { onChange } = editor;
    editor.onChange = () => {
      onChange?.();
      handler();
    };

    return () => {
      editor.onChange = onChange;
    };
  }, []);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) insertImageFile(editor, file);
    else alert("Please select a valid image.");
    e.target.value = null;
  };

  const onVideoChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("video/")) insertVideoFile(editor, file);
    else alert("Please select a valid video.");
    e.target.value = null;
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-100 border border-gray-200 rounded-md mb-3">
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "bold");
        }}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
          isMarkActive(editor, "bold")
            ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
            : ""
        }`}
        title="Bold"
      >
        <FaBold className="text-base" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "italic");
        }}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
          isMarkActive(editor, "italic")
            ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
            : ""
        }`}
        title="Italic"
      >
        <FaItalic className="text-base" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "underline");
        }}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
          isMarkActive(editor, "underline")
            ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
            : ""
        }`}
        title="Underline"
      >
        <FaUnderline className="text-base" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "code");
        }}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
          isMarkActive(editor, "code")
            ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
            : ""
        }`}
        title="Code"
      >
        <FaCode className="text-base" />
      </button>

      <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-md">
        {FONT_SIZES.map((size) => (
          <button
            key={size}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleFontSize(editor, size);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
              activeFontSize === size
                ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
                : ""
            }`}
            title={`Font Size ${size}`}
          >
            <FaFont className="text-base" />
            <span>{size}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-md">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "heading-one");
          }}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
            isBlockActive(editor, "heading-one")
              ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
              : ""
          }`}
          title="Heading 1"
        >
          <FaHeading className="text-base" />
          <span>H1</span>
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "heading-two");
          }}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
            isBlockActive(editor, "heading-two")
              ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
              : ""
          }`}
          title="Heading 2"
        >
          <FaHeading className="text-base" />
          <span>H2</span>
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-md">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "bulleted-list");
          }}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
            isBlockActive(editor, "bulleted-list")
              ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
              : ""
          }`}
          title="Bulleted List"
        >
          <FaListUl className="text-base" />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, "numbered-list");
          }}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400 ${
            isBlockActive(editor, "numbered-list")
              ? "bg-blue-500 text-white font-semibold border-blue-600 hover:bg-blue-600"
              : ""
          }`}
          title="Numbered List"
        >
          <FaListOl className="text-base" />
        </button>
      </div>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          insertHorizontalRule(editor);
        }}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400"
        title="Horizontal Rule"
      >
        <FaMinus className="text-base" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          insertTable(editor);
        }}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400"
        title="Insert Table"
      >
        <FaTable className="text-base" />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        className="hidden"
        onChange={onImageChange}
      />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          imageInputRef.current.click();
        }}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400"
        title="Insert Image"
      >
        <FaImage className="text-base" />
      </button>

      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        className="hidden"
        onChange={onVideoChange}
      />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          videoInputRef.current.click();
        }}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400"
        title="Insert Video"
      >
        <FaUpload className="text-base" />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          removeNode(editor);
        }}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md transition-all hover:bg-gray-100 hover:border-gray-400"
        title="Remove Node"
      >
        <FaTrash className="text-base" />
      </button>
    </div>
  );
};

export default Toolbar;
