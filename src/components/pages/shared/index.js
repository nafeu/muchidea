import { useState, useEffect, Fragment } from 'react';
import { withRouter, useParams } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';

import Auth from '../../auth';
import Generate from '../../generate';

import { generateIdeas } from '../../../services/idea';
import { buildConcepts } from '../../../services/concept';
import { DEFAULT_RESULTS_COUNT } from '../../../services/idea/constants';

const Shared = ({
  user,
  firebase,
  setIsLoading,
  isLoading,
  isSignedIn
}) => {
  const { id: conceptMapId } = useParams();

  const [results, setResults] = useState([]);
  const [issuesDuringGeneration, setIssuesDuringGeneration] = useState([]);
  const [count, setCount] = useState(DEFAULT_RESULTS_COUNT);

  const [conceptMapText, setConceptMapText] = useState(null);
  const [conceptMapDescription, setConceptMapDescription] = useState(null);

  useEffect(() => {
    loadConceptMap();
  }, [])

  const loadConceptMap = async () => {
    const db = firebase.firestore()

    const publicCollectionsRef = db.collection('public_collections');

    try {
      const snapshot = await publicCollectionsRef.doc(conceptMapId).get();

      const {
        conceptMapText: updatedConceptMapText,
        conceptMapDescription: updatedConceptMapDescription,
      } = snapshot.data();

      setConceptMapText(updatedConceptMapText);
      setConceptMapDescription(updatedConceptMapDescription);
    } catch (error) {
      // TODO: Handle error
      console.log({ error });
    }
  }

  const generateNewIdeas = () => {
    const { issues: issuesBuildingConcepts, concepts, root } = buildConcepts(conceptMapText);
    const { issues: issuesGeneratingIdeas, ideas }  = generateIdeas({ concepts, root, count });

    const allIssues = [...issuesBuildingConcepts, ...issuesGeneratingIdeas];

    setResults(ideas);
    setIssuesDuringGeneration(allIssues);
  }

  const handleClickGenerateResults = () => {
    generateNewIdeas();
  }

  const handleChangeCount = event => {
    const { value: updatedCount } = event.target;

    setCount(updatedCount);
  }

  const handleLogin = loggedInUser => {}

  const handleLogout = () => {}

  return (
    <div className="flex flex-col grow">
      <Fragment>
        {conceptMapText ? (
          <Generate
            conceptMapDescription={conceptMapDescription}
            conceptMapId={conceptMapId}
            count={count}
            handleChangeCount={handleChangeCount}
            handleClickGenerateResults={handleClickGenerateResults}
            issuesDuringGeneration={issuesDuringGeneration}
            results={results}
          />
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
    </div>
  )
};

export default withRouter(Shared);
