import React from "react";

export const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
    >
      {children}
    </button>
  );
};
