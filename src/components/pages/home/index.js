import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';

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
  const [rawConceptText, setRawConceptText] = useState(localData.rawConceptText);
  const [count, setCount] = useState(DEFAULT_COUNT);

  const textAreaRef = useRef();

  useEffect(() => {
    if (results === []) {
      generateNewIdeas();
    }
  }, [])

  const generateNewIdeas = () => {
    const updatedRawConceptText = textAreaRef.current?.value;

    const { concepts, root } = buildConcepts(updatedRawConceptText);
    const { issues, ideas }  = generateIdeas({ concepts, root, count });

    setResults(ideas);
    setRawConceptText(updatedRawConceptText);

    setIssuesDuringGeneration(issues);

    setLocalData({
      rawConceptText: updatedRawConceptText,
      results: ideas,
      issuesDuringGeneration: issues
    });
  }

  const handleClickGenerateIdeas = () => {
    generateNewIdeas();
  }

  const handleChangeCount = event => {
    const { value: updatedCount } = event.target;

    setCount(updatedCount);
  }

  return (
    <div>
      <textarea className="w-full h-96" ref={textAreaRef} placeholder="Enter concepts" defaultValue={rawConceptText}/>
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
      <hr />
      <Auth
        user={user}
        firebase={firebase}
        isSignedIn={isSignedIn}
        setIsLoading={setIsLoading}
      />
    </div>
  )
};

export default withRouter(Home);
