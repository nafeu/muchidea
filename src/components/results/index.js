import React, { Fragment, useState, useCallback, useRef, useEffect } from "react";
import { useTransition, animated } from "@react-spring/web"
import { getRandomNumbersInRangeSequence } from "../../utils/helpers";

import {
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

const Results = ({
  issuesDuringGeneration,
  results,
  pickCount,
  isGenerating,
  isPicking,
  setIsPicking,
  setIsGenerating
}) => {
  const generatedResultsTimers = useRef([]);
  const generatedResultsRef = useRef([]);
  const pickedResultsTimers = useRef([]);
  const generatingTimer = useRef();
  const pickingTimer = useRef();

  const [generatedResults, setGeneratedResults] = useState([]);

  const transitions = useTransition(generatedResults, {
    from: {
      opacity: 0,
      height: 0
    },
    enter: [
      // ADD MORE ANIMATIONS HERE IF NEEDED
      { opacity: 1, height: 'auto' }
    ],
    leave: [
      // ADD MORE ANIMATIONS HERE IF NEEDED
      // { opacity: 0, height: 0, innerHeight: 0 }
    ],
    update: [
      // { color: "red" },
      // { color: "white" }
    ],
    keys: generatedResults.map(generatedResult => JSON.parse(generatedResult).idea)
  })

  const resetAllTimers = () => {
    generatedResultsTimers.current.forEach(clearTimeout);
    pickedResultsTimers.current.forEach(clearTimeout);
    clearTimeout(pickingTimer.current);
    clearTimeout(generatingTimer.current);
  }

  const animateGenerating = useCallback(() => {
    const generatedResultsSequence = results
      .map((result, index) => results.slice(0, index + 1))
      .map(sequence => sequence.map(result => JSON.stringify({ idea: result, isPicked: false })));

    generatedResultsTimers.current = []
    setGeneratedResults([])

    for (const [index, values] of generatedResultsSequence.entries()) {
      generatedResultsTimers.current.push(setTimeout(() => setGeneratedResults(values), 500 * index));
    }

    generatingTimer.current = setTimeout(() => setIsGenerating(false), 500 * (generatedResultsSequence.length + 1));
    pickingTimer.current = setTimeout(() => setIsPicking(true), 500 * (generatedResultsSequence.length + 1));
  }, [isGenerating])

  const animatePicking = useCallback(() => {
    const originalGeneratedResults = [...generatedResults].map(encodedResult => JSON.parse(encodedResult));
    // TODO: Continue...
    const randomNumberSequence = getRandomNumbersInRangeSequence({ max: results.length - 1, amount: 2, sequenceLength: 5 })

    const pickedResultsSequence = randomNumberSequence.map(randomNumbers => {
      return originalGeneratedResults.map((originalGeneratedResult, index) => {
        return JSON.stringify({ ...originalGeneratedResult, isPicked: randomNumbers.includes(index) })
      })
    })

    pickedResultsTimers.current = []

    for (const [index, values] of pickedResultsSequence.entries()) {
      pickedResultsTimers.current.push(setTimeout(() => { setGeneratedResults(values); }, 100 * index));
    }

    pickingTimer.current = setTimeout(() => setIsPicking(false), 100 * (pickedResultsSequence.length + 1));
  }, [isPicking])

  useEffect(() => {
    if (isGenerating) {
      animateGenerating();
    }

    if (isPicking) {
      animatePicking();
    }

    return () => resetAllTimers();
  }, [isGenerating, isPicking]);

  const hasIssuesGenerating = issuesDuringGeneration.length > 0;

  return (
    <Fragment>
      {hasIssuesGenerating ? (
        <div className="scrollbar h-1/2 max-h-fit overflow-y-auto">
          <div className="text-center p-4">
            <div className="font-bold">Issues</div>
            {issuesDuringGeneration.map(issue => (
              <div key={issue}>{issue}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="scrollbar h-4/6 max-h-4/6 overflow-y-auto w-full">
          <div className="text-center p-4 max-h-full w-full">
            {transitions(({ innerHeight, ...rest }, result, index) => {
              const { idea, isPicked } = JSON.parse(result);

              return (
                <animated.div
                  className={`flex items-center justify-center bg-secondary brightness-75 block text-lg py-1 px-2 my-1 hover:brightness-150 cursor-pointer w-full ${isPicked ? 'brightness-150' : ''}`}
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
