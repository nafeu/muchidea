import React from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Preview = ({ conceptMapDescription }) => {
  return (
    <div className="flex flex-col pl-3 font-mono ">
      <div className="text-sm font-bold text-center py-1 text-secondary bg-primary">description preview</div>
      <div className="grow prose prose-invert p-5 bg-secondary border-b-2 border-primary">
        <ReactMarkdown children={conceptMapDescription} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  )
};

export default Preview;
