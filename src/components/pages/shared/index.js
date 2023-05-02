import { useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';

import Generate from '../../generate';

import { generateIdeas } from '../../../services/idea';
import { buildConcepts } from '../../../services/concept';
import { DEFAULT_RESULTS_COUNT, DEFAULT_PICK_COUNT } from '../../../services/idea/constants';

import {
  MAX_RESULTS_COUNT,
  MIN_RESULTS_COUNT
} from '../home/constants';

const Shared = ({
  user,
  firebase,
  setIsLoading,
  isSignedIn
}) => {
  const { id: conceptMapId } = useParams();

  const [results, setResults] = useState([]);
  const [issuesDuringGeneration, setIssuesDuringGeneration] = useState([]);

  const [resultsCount, setResultsCount] = useState(DEFAULT_RESULTS_COUNT);
  const [pickCount, setPickCount] = useState(DEFAULT_PICK_COUNT);

  const [conceptMapText, setConceptMapText] = useState(null);
  const [conceptMapDescription, setConceptMapDescription] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingFinished, setIsGeneratingFinished] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [isPickingFinished, setIsPickingFinished] = useState(false);

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
    setIsGenerating(true);

    const { issues: issuesBuildingConcepts, concepts, root } = buildConcepts(conceptMapText);
    const { issues: issuesGeneratingIdeas, ideas }  = generateIdeas({ concepts, root, count: resultsCount });

    const allIssues = [...issuesBuildingConcepts, ...issuesGeneratingIdeas];

    setResults(ideas);
    setIssuesDuringGeneration(allIssues);

    if (allIssues.length > 0) {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    loadConceptMap();
  }, [])

  useEffect(() => {
    if (results === []) {
      generateNewIdeas();
    }
  }, [])

  const handleClickGenerateResults = () => {
    generateNewIdeas();
  }

  const handleClickPickResults = () => {
    setIsPicking(true);
  }

  const handleChangeResultsCount = event => {
    const { value: updatedCount } = event.target;

    setResultsCount(updatedCount);
  }

  const handleChangePickCount = event => {
    const { value: updatedCount } = event.target;

    setPickCount(updatedCount);
  }

  const handleBlurResultsCount = event => {
    const { value: updatedCount } = event.target;

    const clampedCount = Math.min(
      Math.max(
        Number(updatedCount),
        MIN_RESULTS_COUNT
      ),
      MAX_RESULTS_COUNT
    );

    setResultsCount(clampedCount);
  }

  const handleBlurPickCount = event => {
    const { value: updatedCount } = event.target;

    const clampedCount = Math.min(
      Math.max(
        Number(updatedCount),
        MIN_RESULTS_COUNT
      ),
      resultsCount - 1
    );

    setPickCount(clampedCount);
  }

  const handleIncrementResultsCount = () => {
    setResultsCount(count => Math.min(Number(count) + 1, MAX_RESULTS_COUNT));
  }

  const handleDecrementResultsCount = () => {
    setResultsCount(count => Math.max(Number(count) - 1, MIN_RESULTS_COUNT));
  }

  const handleIncrementPickCount = () => {
    setPickCount(count => Math.min(Number(count) + 1, resultsCount - 1));
  }

  const handleDecrementPickCount = () => {
    setPickCount(count => Math.max(Number(count) - 1, MIN_RESULTS_COUNT));
  }

  const handleClickReset = () => {
    setResults([]);
    setIsGenerating(false);
    setIsGeneratingFinished(false);
    setIsPicking(false);
    setIsPickingFinished(false);
  }

  return (
    <div className="flex flex-col grow overflow-hidden">
      <Generate
        conceptMapDescription={conceptMapDescription}
        conceptMapId={conceptMapId}
        generatedResults={results}
        isGenerating={isGenerating}
        isGeneratingFinished={isGeneratingFinished}
        isPicking={isPicking}
        isPickingFinished={isPickingFinished}
        issuesDuringGeneration={issuesDuringGeneration}
        onBlurPickCount={handleBlurPickCount}
        onBlurResultsCount={handleBlurResultsCount}
        onChangePickCount={handleChangePickCount}
        onChangeResultsCount={handleChangeResultsCount}
        onClickGenerateResults={handleClickGenerateResults}
        onClickPickResults={handleClickPickResults}
        onClickReset={handleClickReset}
        onDecrementPickCount={handleDecrementPickCount}
        onDecrementResultsCount={handleDecrementResultsCount}
        onIncrementPickCount={handleIncrementPickCount}
        onIncrementResultsCount={handleIncrementResultsCount}
        pickCount={pickCount}
        resultsCount={resultsCount}
        setIsGenerating={setIsGenerating}
        setIsGeneratingFinished={setIsGeneratingFinished}
        setIsPicking={setIsPicking}
        setIsPickingFinished={setIsPickingFinished}
        setPickCount={setPickCount}
      />
    </div>
  )
};

export default withRouter(Shared);
