import React from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Preview = ({ conceptMapDescription }) => {
  return (
    <div className="flex flex-col grow pl-3">
      <div className="text-sm font-bold text-center underline text-secondary bg-primary rounded-t-md">Preview</div>
      <div className="brightness-75 grow prose prose-invert p-3 rounded-md bg-secondary">
        <ReactMarkdown children={conceptMapDescription} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  )
};

export default Preview;
