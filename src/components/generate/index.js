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

import Results from '../results';

const iconButtonClassName = `w-6 h-6 text-secondary bg-primary rounded-full hover:opacity-50 active:opacity-25 cursor-pointer`;

const Generate = ({
  conceptMapDescription,
  conceptMapId,
  generatedResults,
  isGenerating,
  isPicking,
  issuesDuringGeneration,
  onBlurResultsCount,
  onBlurPickCount,
  onChangePickCount,
  onChangeResultsCount,
  onClickGenerateResults,
  onDecrementPickCount,
  onDecrementResultsCount,
  onIncrementPickCount,
  onIncrementResultsCount,
  pickCount,
  resultsCount,
  setIsGenerating,
  setIsPicking
}) => {
  return (
    <div className="grow bg-secondary brightness-75 rounded-md p-3 my-2 overflow-hidden">
      {conceptMapId ? (
        <div className="flex grow h-full overflow-hidden">
          <div className="flex flex-col items-center gap-1 justify-center w-4/6 overflow-hidden">
            <div className="text-3xl font-thin">How Many Results?</div>
            <div className="select-none w-full flex items-center justify-center text-2xl gap-2 py-1 mb-1">
              <MinusIcon className={iconButtonClassName} onClick={onDecrementResultsCount} />
              <input
                className="text-center bg-secondary border-primary border rounded-md w-1/6"
                type="number"
                min={MIN_RESULTS_COUNT}
                max={MAX_RESULTS_COUNT}
                value={resultsCount}
                onChange={onChangeResultsCount}
                onBlur={onBlurResultsCount}
              />
              <PlusIcon className={iconButtonClassName} onClick={onIncrementResultsCount} />
            </div>
            <button className="select-none text-xl font-bold text-secondary bg-primary w-1/4 rounded-md" onClick={onClickGenerateResults}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
            <Results
              issuesDuringGeneration={issuesDuringGeneration}
              results={generatedResults}
              setIsGenerating={setIsGenerating}
              setIsPicking={setIsPicking}
              isGenerating={isGenerating}
              isPicking={isPicking}
            />
          </div>
          <div className="border-l-2 w-2/6 ml-2">
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
