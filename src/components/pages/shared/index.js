import { useState, useEffect, Fragment } from 'react';
import { withRouter, useParams } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';
import { find } from 'lodash';

import Auth from '../../auth';

import { generateIdeas } from '../../../services/idea';
import { buildConcepts } from '../../../services/concept';
import { DEFAULT_COUNT, EXAMPLE_CONCEPTS } from '../../../services/idea/constants';

const Home = ({
  user,
  firebase,
  setIsLoading,
  isSignedIn
}) => {
  const { id: conceptMapId } = useParams();

  const [results, setResults] = useState([]);
  const [issuesDuringGeneration, setIssuesDuringGeneration] = useState([]);
  const [count, setCount] = useState(DEFAULT_COUNT);

  const [conceptMapText, setConceptMapText] = useState(null);
  const [conceptMapDescription, setConceptMapDescription] = useState(null);

  useEffect(() => {
    loadConceptMap();
  }, [])

  const loadConceptMap = async () => {
    const db = firebase.firestore()

    const publicCollectionsRef = db.collection('public_collections');

    const snapshot = await publicCollectionsRef.doc(conceptMapId).get();

    const {
      conceptMapText: updatedConceptMapText,
      conceptMapDescription: updatedConceptMapDescription,
    } = snapshot.data();

    setConceptMapText(updatedConceptMapText);
    setConceptMapDescription(updatedConceptMapDescription);
  }

  const generateNewIdeas = () => {
    const { issues: issuesBuildingConcepts, concepts, root } = buildConcepts(conceptMapText);
    const { issues: issuesGeneratingIdeas, ideas }  = generateIdeas({ concepts, root, count });

    const allIssues = [...issuesBuildingConcepts, ...issuesGeneratingIdeas];

    setResults(ideas);
    setIssuesDuringGeneration(allIssues);
  }

  const handleClickGenerateIdeas = () => {
    generateNewIdeas();
  }

  const handleChangeCount = event => {
    const { value: updatedCount } = event.target;

    setCount(updatedCount);
  }

  const handleLogin = loggedInUser => {}

  const handleLogout = () => {}

  return (
    <div>
      <Fragment>
        {conceptMapText ? (
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
            {conceptMapId ? `Concept map not found for "${conceptMapId}".` : 'No concept map id in url.'}
          </Fragment>
        )}
        <Auth
          user={user}
          firebase={firebase}
          isSignedIn={isSignedIn}
          setIsLoading={setIsLoading}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </Fragment>
      <hr />
    </div>
  )
};

export default withRouter(Home);
