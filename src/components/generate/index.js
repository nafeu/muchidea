import React, { Fragment } from "react";

const Generate = ({
  conceptMapDescription,
  conceptMapId,
  count,
  handleChangeCount,
  handleClickGenerateIdeas,
  issuesDuringGeneration,
  results
}) => {
  return (
    <Fragment>
      {conceptMapId ? (
        <Fragment>
          <input type="number" min={1} max={20} value={count} onChange={handleChangeCount} />
          <div>{conceptMapDescription}</div>
          <button onClick={handleClickGenerateIdeas}>Generate</button>
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
        </Fragment>
      ) : (
        <Fragment>
          Create a new concept map.
        </Fragment>
      )}
    </Fragment>
  )
};

export default Generate;
