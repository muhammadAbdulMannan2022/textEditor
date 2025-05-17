import React, { useCallback, useMemo, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import TurndownService from "turndown";
import { withHistory } from "slate-history";
import { Button } from "./components/Button"; // Assume we create a button component
import Toolbar from "./components/Toolbar"; // Assume toolbar contains formatting buttons
import { htmlSerialize } from "./utils/htmlSerialize";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "Start writing your blog post here..." }],
  },
];

export default function BlogEditor() {
  const [editorValue, setEditorValue] = useState(initialValue);
  const [markdown, setMarkdown] = useState("");

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleSubmit = useCallback(() => {
    const html = htmlSerialize(editorValue);
    const turndownService = new TurndownService();
    const md = turndownService.turndown(html);
    setMarkdown(md);
  }, [editorValue]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toolbar editor={editor} />
      <Slate editor={editor} value={editorValue} onChange={setEditorValue}>
        <div className="border p-4 rounded bg-white min-h-[300px]">
          <Editable placeholder="Write your blog..." spellCheck autoFocus />
        </div>
      </Slate>

      <Button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white">
        Submit
      </Button>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Markdown Output</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {markdown}
        </pre>
      </div>
    </div>
  );
}
