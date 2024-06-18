import { useState, useEffect } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { find } from 'lodash';

import Auth from '../../auth';
import Edit from '../../edit';
import Generate from '../../generate';
import Landing from '../../landing';

import { generateIdeas } from '../../../services/idea';
import { buildConcepts } from '../../../services/concept';
import { DEFAULT_RESULTS_COUNT, DEFAULT_PICK_COUNT, EXAMPLE_CONCEPTS } from '../../../services/idea/constants';
import { validateConceptMapId, buildNewConceptMap } from './helpers';

import {
  MAX_RESULTS_COUNT,
  MIN_RESULTS_COUNT
} from './constants';

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

  const [resultsCount, setResultsCount] = useState(DEFAULT_RESULTS_COUNT);
  const [pickCount, setPickCount] = useState(DEFAULT_PICK_COUNT);

  const [conceptCollection, setConceptCollection] = useState(localData.conceptCollection);

  const [conceptMapText, setConceptMapText] = useState(localData.conceptMapText);
  const [conceptMapId, setConceptMapId] = useState(localData.conceptMapId);
  const [conceptMapIdRenaming, setConceptMapIdRenaming] = useState(localData.conceptMapId);
  const [conceptMapDescription, setConceptMapDescription] = useState(localData.conceptMapDescription);

  const [isRenameMode, setIsRenameMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingFinished, setIsGeneratingFinished] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [isPickingFinished, setIsPickingFinished] = useState(false);

  useEffect(() => {
    if (conceptMapId) {
      document.title = `muchidea.xyz | ${conceptMapId}`;
    } else {
      document.title = `muchidea.xyz`;
    }
  }, [conceptMapId])

  useEffect(() => {
    if (results === []) {
      generateNewIdeas();
    }
  }, [])

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

    setLocalData({
      conceptCollection,
      conceptMapDescription,
      conceptMapText,
      conceptMapId,
      results: ideas,
      issuesDuringGeneration: allIssues
    });
  }

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

  const handleSelectConceptMap = event => {
    const selectedId = event.target.value;

    const {
      text: updatedConceptText,
      description: updatedConceptDescription
    } = find(conceptCollection, { id: selectedId });

    setConceptMapText(updatedConceptText);
    setConceptMapDescription(updatedConceptDescription);
    setConceptMapId(selectedId)
    setConceptMapIdRenaming(selectedId)
  }

  const handleChangeConceptMapText = event => {
    const updatedConceptText = event.target.value;
    const updatedConceptCollection = conceptCollection.map(conceptMap => {
      if (conceptMap.id === conceptMapId) {
        return {
          ...conceptMap,
          text: updatedConceptText
        }
      }

      return conceptMap;
    });

    setConceptMapText(updatedConceptText);
    setConceptCollection(updatedConceptCollection);
    setLocalData({
      ...localData,
      conceptMapText: updatedConceptText,
      conceptCollection: updatedConceptCollection
    })
  }

  const handleChangeConceptMapDescription = event => {
    const updatedConceptDescription = event.target.value;
    const updatedConceptCollection = conceptCollection.map(conceptMap => {
      if (conceptMap.id === conceptMapId) {
        return {
          ...conceptMap,
          description: updatedConceptDescription
        }
      }

      return conceptMap;
    });

    setConceptMapDescription(updatedConceptDescription);
    setConceptCollection(updatedConceptCollection);
    setLocalData({
      ...localData,
      conceptMapDescription: updatedConceptDescription,
      conceptCollection: updatedConceptCollection
    })
  }

  const handleClickRenameConceptMap = () => {
    if (!isRenameMode) {
      setIsRenameMode(true);
      return;
    }

    const { isValidId, error } = validateConceptMapId({
      id: conceptMapIdRenaming,
      currentId: conceptMapId,
      conceptCollection
    });

    if (isValidId) {
      const updatedConceptCollection = conceptCollection.map(conceptMap => {
        if (conceptMap.id === conceptMapId) {
          return {
            ...conceptMap,
            id: conceptMapIdRenaming
          }
        }

        return conceptMap;
      })

      setConceptMapId(conceptMapIdRenaming);
      setConceptCollection(updatedConceptCollection);
      setLocalData({
        ...localData,
        conceptMapId: conceptMapIdRenaming,
        conceptCollection: updatedConceptCollection,
      });

      setIsRenameMode(false);
      return;
    }

    // TODO: Handle error messages
    alert(error);
  }

  const handleChangeConceptMapId = event => {
    const { value } = event.target;
    const newValue = value
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9 \-_\.]/g, "")
      .toLowerCase();

    setConceptMapIdRenaming(newValue);
  }

  const handleClickNewConceptMap = () => {
    const newConceptMap = buildNewConceptMap(conceptCollection);
    const updatedConceptCollection = [...conceptCollection, newConceptMap];

    setConceptCollection(updatedConceptCollection);
    setConceptMapId(newConceptMap.id);
    setConceptMapIdRenaming(newConceptMap.id);
    setConceptMapText(newConceptMap.text);
    setConceptMapDescription(newConceptMap.description);
    setLocalData({
      ...localData,
      conceptMapId: newConceptMap.id,
      conceptCollection: updatedConceptCollection,
    });
  }

  const handleClickDeleteConceptMap = () => {
    setIsDeleteMode(true);
  }

  const handleClickConfirmDelete = () => {
    let deletionIndex = null;

    const updatedConceptCollection = conceptCollection.filter(({ id }, index) => {
      if (id === conceptMapId) {
        deletionIndex = index;
        return false
      }

      return true;
    });

    if (deletionIndex !== null) {
      if (deletionIndex >= updatedConceptCollection.length) {
        deletionIndex = updatedConceptCollection.length - 1;
      }

      if (updatedConceptCollection.length > 0) {
        const activeConceptMap = updatedConceptCollection[deletionIndex];

        setConceptCollection(updatedConceptCollection);
        setConceptMapId(activeConceptMap.id);
        setConceptMapIdRenaming(activeConceptMap.id);
        setConceptMapText(activeConceptMap.text);
        setConceptMapDescription(activeConceptMap.description);
        setLocalData({
          ...localData,
          conceptMapId: activeConceptMap.id,
          conceptCollection: updatedConceptCollection,
        });
      } else {
        setConceptCollection(updatedConceptCollection);
        setConceptMapId(null);
        setConceptMapIdRenaming(null);
        setConceptMapText(null);
        setConceptMapDescription(null);
        setLocalData({
          ...localData,
          conceptMapId: null,
          conceptCollection: updatedConceptCollection,
        });
      }
    }

    setIsDeleteMode(false);
  }

  const handleClickCancelDelete = () => {
    setIsDeleteMode(false);
  }

  const handleClickSave = async () => {
    const db = firebase.firestore()

    const userCollectionsRef = db.collection('user_collections');

    setIsSaving(true);

    try {
      await userCollectionsRef.doc(user.uid).set({
        owner: user.uid,
        conceptCollection,
        timestamp: (new Date()).getTime()
      })

      setIsSaving(false);
    } catch (error) {
      // TODO: Handle error messages
      setIsSaving(false);
      console.error(error);
      alert(error);
    }
  }

  const handleClickPublish = async () => {
    handleClickSave();

    const db = firebase.firestore()

    const publicCollectionsRef = db.collection('public_collections');

    setIsPublishing(true);

    try {
      const snapshot = await publicCollectionsRef.doc(conceptMapId).get();

      const isUpdateable = snapshot.exists && snapshot.data().owner === user.uid;
      const isNotAuthorized = snapshot.exists && snapshot.data().owner !== user.uid
      const isCreatable = !snapshot.exists;

      if (isUpdateable || isCreatable) {
        await publicCollectionsRef.doc(conceptMapId).set({
          owner: user.uid,
          conceptMapText,
          conceptMapDescription: conceptMapDescription || '',
          timestamp: (new Date()).getTime()
        })
      } else if (isNotAuthorized) {
        // TODO: Handle error messages
        console.log({ error: { message: 'This name is already in use.' }})
      }

      setIsPublishing(false);
    } catch (error) {
      // TODO: Handle error messages
      alert(error);
      console.error(error);
      setIsPublishing(false);
    }
  }

  const handleLogin = loggedInUser => {
    const db = firebase.firestore()

    const userCollectionsRef = db.collection('user_collections');

    userCollectionsRef.doc(loggedInUser.uid).get()
      .then((documentRef) => {
        const { conceptCollection: updatedConceptCollection } = documentRef.data();

        setLocalData({
          conceptCollection: updatedConceptCollection,
          conceptMapText: updatedConceptCollection[0].text,
          conceptMapDescription: updatedConceptCollection[0].description,
          conceptMapId: updatedConceptCollection[0].id,
          results: [],
          issuesDuringGeneration: []
        });

        window.location.reload(false);
      })
      .catch((error) => { alert(error) })

  }

  const handleLogout = () => {
    setConceptMapId(null);
    setConceptMapIdRenaming(null);
    setConceptMapText(null);
    setConceptMapDescription(null);

    const localData = JSON.parse(localStorage.getItem('muchidea-data'));

    const isMissingLocalDataKeys = localData === null
      || localData.conceptMapText === undefined
      || localData.conceptMapId === undefined
      || localData.results === undefined
      || localData.issuesDuringGeneration === undefined
      || localData.conceptCollection === undefined

    if (localData && !isMissingLocalDataKeys) {
      setConceptCollection(localData.conceptCollection);
      setLocalData(localData);
    } else {
      setConceptCollection(EXAMPLE_CONCEPTS);
      setLocalData({
        conceptCollection: EXAMPLE_CONCEPTS,
        conceptMapText: EXAMPLE_CONCEPTS[0].text,
        conceptMapDescription: EXAMPLE_CONCEPTS[0].description,
        conceptMapId: EXAMPLE_CONCEPTS[0].id,
        results: [],
        issuesDuringGeneration: []
      });
    }

    window.location.reload(false);
  }

  return (
    <div className="flex flex-col grow overflow-hidden">
      <Switch>
        <Route path={`/edit`}>
          <Edit
            conceptCollection={conceptCollection}
            conceptMapDescription={conceptMapDescription}
            conceptMapId={conceptMapId}
            conceptMapIdRenaming={conceptMapIdRenaming}
            conceptMapText={conceptMapText}
            firebase={firebase}
            isDeleteMode={isDeleteMode}
            isPublishing={isPublishing}
            isRenameMode={isRenameMode}
            isSaving={isSaving}
            isSignedIn={isSignedIn}
            onCancelDelete={handleClickCancelDelete}
            onChangeConceptMapDescription={handleChangeConceptMapDescription}
            onChangeConceptMapId={handleChangeConceptMapId}
            onChangeConceptMapText={handleChangeConceptMapText}
            onClickCancelDelete={handleClickCancelDelete}
            onClickConfirmDelete={handleClickConfirmDelete}
            onClickNewConceptMap={handleClickNewConceptMap}
            onClickPublish={handleClickPublish}
            onClickRenameConceptMap={handleClickRenameConceptMap}
            onClickSave={handleClickSave}
            onConfirmDelete={handleClickConfirmDelete}
            onDeleteConceptMap={handleClickDeleteConceptMap}
            onSelectConceptMap={handleSelectConceptMap}
            user={user}
          />
        </Route>
        <Route path={`/generate`}>
          <Generate
            conceptCollection={conceptCollection}
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
            onSelectConceptMap={handleSelectConceptMap}
            pickCount={pickCount}
            resultsCount={resultsCount}
            setIsGenerating={setIsGenerating}
            setIsGeneratingFinished={setIsGeneratingFinished}
            setIsPicking={setIsPicking}
            setIsPickingFinished={setIsPickingFinished}
            setPickCount={setPickCount}
          />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
      <Auth
        user={user}
        firebase={firebase}
        isSignedIn={isSignedIn}
        setIsLoading={setIsLoading}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  )
};

export default withRouter(Home);
