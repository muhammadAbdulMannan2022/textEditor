import { Editor } from "slate";
const serializeToMarkdown = (nodes) => {
  return nodes.map((n) => serializeNode(n)).join("\n\n");
};

const serializeNode = (node) => {
  if (Editor.isEditor(node)) {
    return node.children.map(serializeNode).join("");
  }

  if (node.type === "heading-one") {
    return `# ${serializeNode(node.children[0])}`;
  }

  if (node.type === "heading-two") {
    return `## ${serializeNode(node.children[0])}`;
  }

  if (node.type === "bulleted-list") {
    return node.children.map((child) => `- ${serializeNode(child)}`).join("\n");
  }

  if (node.type === "numbered-list") {
    return node.children
      .map((child, index) => `${index + 1}. ${serializeNode(child)}`)
      .join("\n");
  }

  if (node.type === "list-item") {
    return node.children.map(serializeNode).join(" ");
  }

  if (node.type === "horizontal-rule") {
    return "---";
  }

  if (node.type === "image") {
    return `![image](${node.url})`;
  }

  if (node.type === "video") {
    return `[Video: ${node.url}]`;
  }

  if (node.type === "table") {
    return "[Table not supported in markdown]";
  }

  if (node.type === "paragraph") {
    return node.children.map(serializeNode).join("");
  }

  if (node.text) {
    let text = node.text;
    if (node.bold) text = `**${text}**`;
    if (node.italic) text = `_${text}_`;
    if (node.code) text = `\`${text}\``;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.fontSize)
      text = `<span style="font-size:${node.fontSize}">${text}</span>`;
    return text;
  }

  return "";
};
export default serializeToMarkdown;
