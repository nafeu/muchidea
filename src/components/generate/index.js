import React, { Fragment, useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTransition, animated } from "@react-spring/web"

import {
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

import {
  MIN_RESULTS_COUNT,
  MIN_PICK_COUNT,
  MAX_RESULTS_COUNT,
  MAX_PICK_COUNT
} from '../pages/home/constants';

import Results from '../results';

const iconButtonClassName = `w-6 h-6 text-secondary bg-primary rounded-full hover:opacity-50 active:opacity-25 cursor-pointer`;

const Generate = ({
  conceptMapDescription,
  conceptMapId,
  generatedResults,
  isGenerating,
  isGeneratingFinished,
  isPicking,
  isPickingFinished,
  issuesDuringGeneration,
  onBlurResultsCount,
  onBlurPickCount,
  onChangePickCount,
  onChangeResultsCount,
  onClickGenerateResults,
  onClickPickResults,
  onDecrementPickCount,
  onDecrementResultsCount,
  onIncrementPickCount,
  onIncrementResultsCount,
  onClickReset,
  pickCount,
  resultsCount,
  setIsGenerating,
  setIsGeneratingFinished,
  setIsPicking,
  setIsPickingFinished,
  setPickCount
}) => {
  const [reset, setReset] = useState(false);

  const prompts = [
    'How many results would you like to generate?',
    'How many would you like to pick?',
    'Selection complete.'
  ];

  const [promptIndex, setPromptIndex] = useState(0);

  const promptTextPropsTransition = useTransition(prompts[promptIndex], {
    from: {
      opacity: 0,
      transform: "translateY(-100%)"
    },
    enter: {
      opacity: 1,
      transform: "translateY(0%)"
    },
    leave: {
      opacity: 0,
      transform: "translateY(-100%)",
    },
    trail: 500
  });

  const handleClickReset = () => {
    setReset(true);
    onClickReset();
  }

  useEffect(() => {
    if (!isGeneratingFinished && !isPickingFinished) {
      setPromptIndex(0);
    } else if (isGeneratingFinished && !isPickingFinished) {
      setPromptIndex(1);
    } else {
      setPromptIndex(2);
    }
  }, [isGeneratingFinished, isPickingFinished])

  const showGeneratePrompt = !isGeneratingFinished && !isPickingFinished;
  const showPickingPrompt = isGeneratingFinished && !isPickingFinished;
  const showFinishedPrompt = isGeneratingFinished && isPickingFinished;

  return (
    <div className="grow bg-secondary brightness-75 rounded-md p-3 my-2 overflow-hidden">
      {conceptMapId ? (
        <div className="flex grow h-full overflow-hidden">
          <div className="flex flex-col items-center gap-1 justify-center w-4/6 overflow-hidden">
            <div className="flex items-center justify-center p-4">
              {promptTextPropsTransition((style, promptText) => (
                <animated.div
                  style={style}
                  className="text-3xl font-thin max-h-14 absolute"
                >
                  {promptText}
                </animated.div>
              ))}
            </div>
            {showGeneratePrompt && (
              <Fragment>
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
              </Fragment>
            )}
            {showPickingPrompt && (
              <Fragment>
                <div className="select-none w-full flex items-center justify-center text-2xl gap-2 py-1 mb-1">
                  <MinusIcon className={iconButtonClassName} onClick={onDecrementPickCount} />
                  <input
                    className="text-center bg-secondary border-primary border rounded-md w-1/6"
                    type="number"
                    min={MIN_PICK_COUNT}
                    max={resultsCount}
                    value={pickCount}
                    onChange={onChangePickCount}
                    onBlur={onBlurPickCount}
                  />
                  <PlusIcon className={iconButtonClassName} onClick={onIncrementPickCount} />
                </div>
                <button className="select-none text-xl font-bold text-secondary bg-primary w-1/4 rounded-md" onClick={onClickPickResults}>
                  {isPicking ? 'Picking...' : 'Pick'}
                </button>
              </Fragment>
            )}
            {showFinishedPrompt && (
              <Fragment>
                <div className="select-none w-full flex items-center justify-center text-2xl gap-2 py-1 mb-1 opacity-25">
                  <MinusIcon className={iconButtonClassName} onClick={() => {}} />
                  <input
                    className="text-center bg-secondary border-primary border rounded-md w-1/6"
                    type="number"
                    min={MIN_RESULTS_COUNT}
                    max={MAX_RESULTS_COUNT}
                    value={resultsCount}
                    onChange={onChangeResultsCount}
                    onBlur={onBlurResultsCount}
                    disabled
                  />
                  <PlusIcon className={iconButtonClassName} onClick={() => {}} />
                </div>
                <button className="select-none text-xl font-bold text-secondary bg-primary w-1/4 rounded-md" onClick={handleClickReset}>
                  Reset
                </button>
              </Fragment>
            )}
            <Results
              issuesDuringGeneration={issuesDuringGeneration}
              results={generatedResults}
              pickCount={pickCount}
              setIsGenerating={setIsGenerating}
              setIsGeneratingFinished={setIsGeneratingFinished}
              setIsPicking={setIsPicking}
              setIsPickingFinished={setIsPickingFinished}
              isGenerating={isGenerating}
              isPicking={isPicking}
              reset={reset}
              setReset={setReset}
              setPickCount={setPickCount}
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
