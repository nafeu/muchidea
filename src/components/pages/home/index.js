import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';

import Auth from '../../auth';

import { generateIdeas } from '../../../services/idea';
import { EXAMPLE_CONCEPTS, EXAMPLE_COUNT } from '../../../services/idea/constants';

const Home = ({
  user,
  firebase,
  setLocalConfig,
  localConfig,
  setIsLoading,
  isSignedIn
}) => {
  const [generatedIdeas, setGeneratedIdeas] = useState([])
  const [issuesDuringGeneration, setIssuesDuringGeneration] = useState([])

  useEffect(() => {
    generateNewIdeas();
  }, [])

  const generateNewIdeas = () => {
    const { issues, ideas } = generateIdeas({
      concepts: EXAMPLE_CONCEPTS,
      count: EXAMPLE_COUNT
    });

    setGeneratedIdeas(ideas);
    setIssuesDuringGeneration(issues);
  }

  const handleClickGenerateIdeas = () => {
    generateNewIdeas();
  }

  return (
    <div>
      <button onClick={handleClickGenerateIdeas}>Generate Ideas</button>
      {generatedIdeas && (
        <div className="text-center p-4">
          <div className="font-bold">Ideas</div>
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
