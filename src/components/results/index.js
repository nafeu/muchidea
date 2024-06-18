import React, { Fragment, useState, useCallback, useRef, useEffect } from "react";
import { useTransition, animated } from "@react-spring/web"
import { getRandomNumbersInRangeSequence, getRandomInt } from "../../utils/helpers";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const RESULT_COUNT_STYLES_TEXT_2XL = 2;
const RESULT_COUNT_STYLES_TEXT_XL = 6;
const RESULT_COUNT_STYLES_TEXT_MD = 10;
const ANIMATION_SPEED_MS = 500;
const PICKING_RANDOMIZATION_COUNT_MIN = 12;
const PICKING_RANDOMIZATION_COUNT_MAX = 5;

const iconClassName = `w-8 h-8`;

const getResultStylesByLength = length => {
  if (length < RESULT_COUNT_STYLES_TEXT_2XL) {
    return `text-2xl py-2 pb-2 mb-1`;
  }

  if (length < RESULT_COUNT_STYLES_TEXT_XL) {
    return `text-xl py-2 pb-2 mb-1`;
  }

  if (length < RESULT_COUNT_STYLES_TEXT_MD) {
    return `text-md py-1 pb-2 mb-1`
  }

  return `text-sm py-1 px-2 my-1`
}

const Results = ({
  issuesDuringGeneration,
  results,
  pickCount,
  isGenerating,
  isPicking,
  setIsPicking,
  setIsPickingFinished,
  setIsGenerating,
  setIsGeneratingFinished,
  setPickCount,
  reset,
  setReset
}) => {
  const generatedResultsTimers = useRef([]);
  const pickedResultsTimers = useRef([]);
  const generatingTimer = useRef();
  const generatingFinishedTimer = useRef();
  const pickingTimer = useRef();
  const pickingFinishedTimer = useRef();

  const [generatedResults, setGeneratedResults] = useState([]);

  const transitions = useTransition(generatedResults, {
    from: {
      opacity: 0
    },
    enter: [
      { opacity: 1 },
    ],
    leave: [
      { opacity: 0 }
    ],
    update: [],
    keys: generatedResults.map(generatedResult => JSON.parse(generatedResult).idea)
  })

  useEffect(() => {
    if (reset) {
      setGeneratedResults([]);
      setReset(false);
    }
  }, [reset])

  const resetAllTimers = () => {
    generatedResultsTimers.current.forEach(clearTimeout);
    pickedResultsTimers.current.forEach(clearTimeout);
    clearTimeout(pickingTimer.current);
    clearTimeout(generatingTimer.current);
    clearTimeout(pickingFinishedTimer.current);
    clearTimeout(generatingFinishedTimer.current);
  }

  const animateGenerating = useCallback(() => {
    const generatedResultsSequence = results
      .map((result, index) => results.slice(0, index + 1))
      .map(sequence => sequence.map(result => JSON.stringify({ idea: result, isPicked: false })));

    generatedResultsTimers.current = []
    setGeneratedResults([])

    for (const [index, values] of generatedResultsSequence.entries()) {
      generatedResultsTimers.current.push(setTimeout(() => setGeneratedResults(values), ANIMATION_SPEED_MS * index));
    }

    generatingTimer.current = setTimeout(() => setIsGenerating(false), ANIMATION_SPEED_MS * (generatedResultsSequence.length + 1));
    generatingFinishedTimer.current = setTimeout(() => {
      setIsGeneratingFinished(true);
      setPickCount(currentPickCount => Math.min(results.length, currentPickCount));
    }, ANIMATION_SPEED_MS * (generatedResultsSequence.length + 1));
  }, [isGenerating])

  const animatePicking = useCallback(() => {
    const originalGeneratedResults = [...generatedResults].map(encodedResult => JSON.parse(encodedResult));
    const randomNumberSequence = getRandomNumbersInRangeSequence({
      max: results.length - 1,
      amount: pickCount,
      sequenceLength: getRandomInt(PICKING_RANDOMIZATION_COUNT_MIN, PICKING_RANDOMIZATION_COUNT_MAX)
    });

    const pickedResultsSequence = randomNumberSequence.map(randomNumbers => {
      return originalGeneratedResults.map((originalGeneratedResult, index) => {
        return JSON.stringify({ ...originalGeneratedResult, isPicked: randomNumbers.includes(index) })
      })
    });

    pickedResultsTimers.current = []

    for (const [index, values] of pickedResultsSequence.entries()) {
      pickedResultsTimers.current.push(setTimeout(() => {
        setGeneratedResults(values);
      }, ANIMATION_SPEED_MS * index));

      if (index === pickedResultsSequence.length - 1) {
        const pickedValuesSorted = [
          ...values.filter(value => JSON.parse(value).isPicked),
          ...values.filter(value => !JSON.parse(value).isPicked)
        ];

        pickedResultsTimers.current.push(setTimeout(() => {
          setGeneratedResults(pickedValuesSorted);
        }, ANIMATION_SPEED_MS * (index + 1)));

        const pickedValuesOnly = values.filter(value => JSON.parse(value).isPicked);

        pickedResultsTimers.current.push(setTimeout(() => {
          setGeneratedResults(pickedValuesOnly);
        }, ANIMATION_SPEED_MS * (index + 2)));
      }
    }

    pickingTimer.current = setTimeout(() => setIsPicking(false), ANIMATION_SPEED_MS * (pickedResultsSequence.length + 3));
    pickingFinishedTimer.current = setTimeout(() => setIsPickingFinished(true), ANIMATION_SPEED_MS * (pickedResultsSequence.length + 3));
  }, [isPicking])

  useEffect(() => {
    if (issuesDuringGeneration.length === 0) {
      if (isGenerating) {
        animateGenerating();
      }

      if (isPicking) {
        animatePicking();
      }
    }

    return () => resetAllTimers();
  }, [isGenerating, isPicking, issuesDuringGeneration]);

  const hasIssuesGenerating = issuesDuringGeneration.length > 0;

  return (
    <Fragment>
      {hasIssuesGenerating ? (
        <div className="scrollbar h-1/2 max-h-fit overflow-y-auto">
          <div className="text-center p-4">
            <div className="font-bold flex items-center justify-center">
              <ExclamationTriangleIcon className={iconClassName} />
            </div>
            {issuesDuringGeneration.map(issue => (
              <div key={issue}>{issue}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="scrollbar h-4/6 max-h-4/6 overflow-y-scroll w-full">
          <div className="text-center p-4 max-h-full w-full">
            {transitions(({ innerHeight, ...rest }, result, index) => {
              const { idea, isPicked } = JSON.parse(result);

              return (
                <animated.div
                  className={`flex items-center justify-center border bg-secondary block ${getResultStylesByLength(results.length)} transition-[filter,border] hover:brightness-150 cursor-pointer w-full box-border ${isPicked ? 'brightness-150' : 'brightness-75'} ${(isPicked && !isPicking) ? 'border-primary' : 'border-secondary'}`}
                  style={rest}
                  key={idea}
                >
                  <div style={{ height: innerHeight }}>
                    {idea}
                  </div>
                </animated.div>
              )
            })}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Results;
