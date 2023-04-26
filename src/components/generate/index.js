import React, { Fragment } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

import {
  MIN_RESULTS_COUNT,
  MAX_RESULTS_COUNT,
} from '../pages/home/constants';

const iconClassName = `w-6 h-6 text-secondary bg-primary rounded-full`;

const Generate = ({
  conceptMapDescription,
  conceptMapId,
  count,
  onChangeCount,
  onClickGenerateIdeas,
  onIncrementCount,
  onDecrementCount,
  onBlurCount,
  issuesDuringGeneration,
  results
}) => {
  return (
    <div className="grow bg-secondary brightness-75 rounded-md p-3 my-2">
      {conceptMapId ? (
        <div className="flex grow h-full">
          <div className="flex flex-col items-center justify-center w-4/6">
            <div className="text-3xl font-thin">How Many Results?</div>
            <div className="w-full flex items-center justify-center text-2xl gap-2 py-2">
              <MinusIcon className={iconClassName} onClick={onDecrementCount} />
              <input
                className="text-center bg-secondary border-primary border rounded-md w-1/6"
                type="number"
                min={MIN_RESULTS_COUNT}
                max={MAX_RESULTS_COUNT}
                value={count}
                onChange={onChangeCount}
                onBlur={onBlurCount}
              />
              <PlusIcon className={iconClassName} onClick={onIncrementCount} />
            </div>
            <button onClick={onClickGenerateIdeas}>Generate</button>
            {results.length > 0 && (
              <div className="text-center p-4">
                <div className="font-bold">Results</div>
                {results.map(idea => (
                  <div key={idea}>{idea}</div>
                ))}
              </div>
            )}
            {issuesDuringGeneration.length > 0 && (
              <div className="text-center p-4">
                <div className="font-bold">Issues</div>
                {issuesDuringGeneration.map(issue => (
                  <div key={issue}>{issue}</div>
                ))}
              </div>
            )}
          </div>
          <div className="border-l-2 w-2/6">
            <div className="border-primary grow prose prose-invert p-5">
              <ReactMarkdown children={conceptMapDescription} remarkPlugins={[remarkGfm]} />
            </div>
          </div>
        </div>
      ) : (
        <Fragment>
          Create a new concept map.
        </Fragment>
      )}
    </div>
  )
};

export default Generate;
