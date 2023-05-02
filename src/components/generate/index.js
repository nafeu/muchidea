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
  conceptCollection,
  conceptMapDescription,
  conceptMapId,
  generatedResults,
  isGenerating,
  isGeneratingFinished,
  isPicking,
  isPickingFinished,
  issuesDuringGeneration,
  onBlurPickCount,
  onBlurResultsCount,
  onChangePickCount,
  onChangeResultsCount,
  onClickGenerateResults,
  onClickPickResults,
  onClickReset,
  onDecrementPickCount,
  onDecrementResultsCount,
  onIncrementPickCount,
  onIncrementResultsCount,
  onSelectConceptMap,
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
          <div className={`flex flex-col items-center gap-1 w-4/6 overflow-hidden ${conceptCollection ? '' : 'justify-center'}`}>
            {conceptCollection && (
              <div className="w-full mb-8">
                <select className="rounded-md bg-secondary brightness-75 py-1 px-1" disabled={(isGenerating || isPicking)} value={conceptMapId} onChange={onSelectConceptMap}>
                  {conceptCollection.map(({ id }) => {
                    return (
                      <option key={id} value={id}>{id}</option>
                    )
                  })}
                </select>
              </div>
            )}
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
                <button className="select-none text-xl font-bold text-secondary bg-primary w-1/4 rounded-md h-10 active:brightness-75 hover:brightness-125 transition-[filter]" onClick={onClickGenerateResults}>
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-2 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="h-6 w-6 mr-2 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z"/>
                      </svg>
                      Generate
                    </div>
                  )}
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
                <button className="select-none text-xl font-bold text-secondary bg-primary w-1/4 rounded-md h-10 active:brightness-75 hover:brightness-125 transition-[filter]" onClick={onClickPickResults}>
                  {isPicking ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-2 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="h-6 w-6 mr-2 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                      </svg>
                      Pick
                    </div>
                  )}
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
                <button className="select-none text-xl font-bold text-secondary bg-primary w-1/4 rounded-md h-10 active:brightness-75 hover:brightness-125 transition-[filter]" onClick={handleClickReset}>
                  <div className="flex items-center justify-center">
                    <svg className="h-6 w-6 mr-2 fill-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                      <path d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H288h9.4H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H387.9L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416H288l-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"/>
                    </svg>
                    Reset
                  </div>
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
