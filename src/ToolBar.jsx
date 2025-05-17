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
      editor.onChange = onChange; // restore if unmounted
    };
  }, [editor]);

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
    <div className="flex flex-wrap gap-2 mb-3 items-center">
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "bold");
        }}
        className={isMarkActive(editor, "bold") ? "btn-active" : "btn"}
      >
        <FaBold />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "italic");
        }}
        className={isMarkActive(editor, "italic") ? "btn-active" : "btn"}
      >
        <FaItalic />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "underline");
        }}
        className={isMarkActive(editor, "underline") ? "btn-active" : "btn"}
      >
        <FaUnderline />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, "code");
        }}
        className={isMarkActive(editor, "code") ? "btn-active" : "btn"}
      >
        <FaCode />
      </button>

      {FONT_SIZES.map((size) => (
        <button
          key={size}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleFontSize(editor, size);
          }}
          className={activeFontSize === size ? "btn-active" : "btn"}
        >
          <FaFont />
          <span>{size}</span>
        </button>
      ))}

      {/* Headings */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "heading-one");
        }}
        className={isBlockActive(editor, "heading-one") ? "btn-active" : "btn"}
      >
        <FaHeading />
        <span>H1</span>
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "heading-two");
        }}
        className={isBlockActive(editor, "heading-two") ? "btn-active" : "btn"}
      >
        <FaHeading />
        <span>H2</span>
      </button>

      {/* Lists */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "bulleted-list");
        }}
        className={
          isBlockActive(editor, "bulleted-list") ? "btn-active" : "btn"
        }
      >
        <FaListUl />
      </button>

      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, "numbered-list");
        }}
        className={
          isBlockActive(editor, "numbered-list") ? "btn-active" : "btn"
        }
      >
        <FaListOl />
      </button>

      {/* Horizontal Rule */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          insertHorizontalRule(editor);
        }}
        className="btn"
      >
        <FaMinus />
      </button>

      {/* Insert Table */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          insertTable(editor);
        }}
        className="btn"
      >
        <FaTable />
      </button>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={onImageChange}
      />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          imageInputRef.current.click();
        }}
        className="btn"
      >
        <FaImage />
      </button>

      {/* Video Upload */}
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        style={{ display: "none" }}
        onChange={onVideoChange}
      />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          videoInputRef.current.click();
        }}
        className="btn"
      >
        <FaUpload />
      </button>

      {/* Remove Node */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          removeNode(editor);
        }}
        className="btn"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default Toolbar;
