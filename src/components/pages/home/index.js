import { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';

import Auth from '../../auth';

import { generateIdeas } from '../../../services/idea';
import { buildConcepts } from '../../../services/concept';
import { EXAMPLE_CONCEPTS, EXAMPLE_COUNT } from '../../../services/idea/constants';

const Home = ({
  user,
  firebase,
  setLocalConfig,
  localConfig,
  setIsLoading,
  isSignedIn
}) => {
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [issuesDuringGeneration, setIssuesDuringGeneration] = useState([]);
  const [rawConceptText, setRawConceptText] = useState(EXAMPLE_CONCEPTS);
  const [count, setCount] = useState(EXAMPLE_COUNT);

  const textAreaRef = useRef();

  useEffect(() => {
    generateNewIdeas();
  }, [])

  const generateNewIdeas = () => {
    const updatedRawConceptText = textAreaRef.current?.value;

    const { concepts, root } = buildConcepts(updatedRawConceptText);
    const { issues, ideas }  = generateIdeas({ concepts, root, count });

    setGeneratedIdeas(ideas);
    setIssuesDuringGeneration(issues);
    setRawConceptText(updatedRawConceptText);
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
      {generatedIdeas && (
        <div className="text-center p-4">
          <div className="font-bold">Results</div>
          {generatedIdeas.map(idea => (
            <div key={idea}>{idea}</div>
          ))}
        </div>
      )}
      {issuesDuringGeneration && (
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
