import React from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Preview = ({ conceptMapDescription }) => {
  return (
    <div className="px-3">
      <div className="text-sm font-bold text-center underline">Preview</div>
      <div className="prose prose-invert p-3 rounded-md">
        <ReactMarkdown children={conceptMapDescription} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  )
};

export default Preview;
