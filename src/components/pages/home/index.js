import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';
import { find } from 'lodash';

import Auth from '../../auth';

import { generateIdeas } from '../../../services/idea';
import { buildConcepts } from '../../../services/concept';
import { DEFAULT_COUNT } from '../../../services/idea/constants';

const Home = ({
  user,
  firebase,
  setLocalData,
  localData,
  setIsLoading,
  isSignedIn
}) => {
  const [results, setResults] = useState(localData.results);
  const [issuesDuringGeneration, setIssuesDuringGeneration] = useState(localData.issuesDuringGeneration);
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [conceptCollection, setConceptCollection] = useState(localData.conceptCollection);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rawConceptText, setRawConceptText] = useState(localData.rawConceptText);

  useEffect(() => {
    if (results === []) {
      generateNewIdeas();
    }
  }, [])

  const generateNewIdeas = () => {
    const { issues: issuesBuildingConcepts, concepts, root } = buildConcepts(rawConceptText);
    const { issues: issuesGeneratingIdeas, ideas }  = generateIdeas({ concepts, root, count });

    const allIssues = [...issuesBuildingConcepts, ...issuesGeneratingIdeas];

    setResults(ideas);
    setIssuesDuringGeneration(allIssues);

    setLocalData({
      conceptCollection,
      rawConceptText,
      results: ideas,
      issuesDuringGeneration: allIssues
    });
  }

  const handleClickGenerateIdeas = () => {
    generateNewIdeas();
  }

  const handleChangeCount = event => {
    const { value: updatedCount } = event.target;

    setCount(updatedCount);
  }

  const handleSelectConcept = event => {
    const updatedRawConceptText = find(conceptCollection, { id: event.target.value }).text;

    setRawConceptText(updatedRawConceptText);
  }

  const handleClickEdit = () => {
    setIsEditMode(true);
  }

  const handleClickViewGenerator = () => {
    setIsEditMode(false);
  }

  const handleChangeRawConceptText = event => {
    const updatedRawConceptText = event.target.value;
    setRawConceptText(updatedRawConceptText);
    setLocalData({ ...localData, rawConceptText })
  }

  return (
    <div>
      <div>
        {!isEditMode && (<button onClick={handleClickEdit}>Edit</button>)}
        {isEditMode && (<button onClick={handleClickViewGenerator}>Generate</button>)}
      </div>
      {isEditMode ? (
        <div>
          <select onChange={handleSelectConcept}>
            {conceptCollection.map(({ id }) => {
              return (
                <option key={id} value={id}>{id}</option>
              )
            })}
          </select>
          <hr/>
          <textarea
            className="m-4 p-4 border border-black w-1/2 h-96"
            placeholder="Enter concepts"
            onChange={handleChangeRawConceptText}
            value={rawConceptText}
          />
          <Auth
            user={user}
            firebase={firebase}
            isSignedIn={isSignedIn}
            setIsLoading={setIsLoading}
          />
        </div>
      ) : (
        <div>
          <input type="number" min={1} max={20} value={count} onChange={handleChangeCount} />
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
        </div>
      )}
      <hr />
    </div>
  )
};

export default withRouter(Home);
