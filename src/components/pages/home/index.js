import { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';
import { find } from 'lodash';

import Auth from '../../auth';

import { generateIdeas } from '../../../services/idea';
import { buildConcepts } from '../../../services/concept';
import { DEFAULT_COUNT, EXAMPLE_CONCEPTS } from '../../../services/idea/constants';
import { validateConceptMapId, buildNewConceptMap } from './helpers';

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

  const [conceptMapText, setConceptMapText] = useState(localData.conceptMapText);
  const [conceptMapId, setConceptMapId] = useState(localData.conceptMapId);
  const [conceptMapIdRenaming, setConceptMapIdRenaming] = useState(localData.conceptMapId);
  const [conceptMapDescription, setConceptMapDescription] = useState(localData.conceptMapDescription);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isRenameMode, setIsRenameMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (results === []) {
      generateNewIdeas();
    }
  }, [])

  const generateNewIdeas = () => {
    const { issues: issuesBuildingConcepts, concepts, root } = buildConcepts(conceptMapText);
    const { issues: issuesGeneratingIdeas, ideas }  = generateIdeas({ concepts, root, count });

    const allIssues = [...issuesBuildingConcepts, ...issuesGeneratingIdeas];

    setResults(ideas);
    setIssuesDuringGeneration(allIssues);

    setLocalData({
      conceptCollection,
      conceptMapDescription,
      conceptMapText,
      conceptMapId,
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

  const handleClickEdit = () => {
    setIsEditMode(true);
  }

  const handleClickViewGenerator = () => {
    setIsEditMode(false);
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
    setConceptMapIdRenaming(event.target.value);
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
    setConceptCollection(EXAMPLE_CONCEPTS);
    setConceptMapId(null);
    setConceptMapIdRenaming(null);
    setConceptMapText(null);
    setConceptMapDescription(null);
    setLocalData({
      conceptCollection: EXAMPLE_CONCEPTS,
      conceptMapText: EXAMPLE_CONCEPTS[0].text,
      conceptMapDescription: EXAMPLE_CONCEPTS[0].description,
      conceptMapId: EXAMPLE_CONCEPTS[0].id,
      results: [],
      issuesDuringGeneration: []
    });

    window.location.reload(false);
  }

  return (
    <div>
      <div>
        {!isEditMode && (<button onClick={handleClickEdit}>Edit</button>)}
        {isEditMode && (<button onClick={handleClickViewGenerator}>Generate</button>)}
      </div>
      {isEditMode ? (
        <div>
          {conceptMapId && (
            <Fragment>
              {isRenameMode ? (
                <input value={conceptMapIdRenaming} onChange={handleChangeConceptMapId} />
              ) : (
                <select value={conceptMapId} onChange={handleSelectConceptMap}>
                  {conceptCollection.map(({ id }) => {
                    return (
                      <option key={id} value={id}>{id}</option>
                    )
                  })}
                </select>
              )}
            </Fragment>
          )}
          {conceptMapId && (
            <button className="m-2" onClick={handleClickRenameConceptMap}>
              {isRenameMode ? ('[Done]') : ('[Rename]')}
            </button>
          )}
          {isDeleteMode ? (
            <Fragment>
              Are You Sure?
              <button className="m-2" onClick={handleClickConfirmDelete}>[Yes]</button>
              <button className="m-2" onClick={handleClickCancelDelete}>[No]</button>
            </Fragment>
          ) : (
            <Fragment>
              {conceptMapId && (<button className="m-2" onClick={handleClickDeleteConceptMap}>[Delete]</button>)}
            </Fragment>
          )}
          <button className="m-2" onClick={handleClickNewConceptMap}>[New]</button>
          {isSignedIn && (
            <Fragment>
            {conceptMapId && isSaving ? (
              <button className="m-2">[Saving...]</button>
            ) : (
              <button className="m-2" onClick={handleClickSave}>[Save]</button>
            )}
            {conceptMapId && isPublishing ? (
              <button className="m-2">[Publishing...]</button>
            ) : (
              <button className="m-2" onClick={handleClickPublish}>[Publish]</button>
            )}
            </Fragment>
          )}
          <hr/>
          {conceptMapText ? (
            <Fragment>
              <textarea
                className="m-4 p-4 border border-black w-1/2 h-96"
                placeholder="Enter concepts"
                onChange={handleChangeConceptMapText}
                value={conceptMapText}
              />
              <textarea
                className="m-4 p-4 border border-black w-1/2 h-96"
                placeholder="Enter description"
                onChange={handleChangeConceptMapDescription}
                value={conceptMapDescription}
              />
            </Fragment>
          ) : (
            <div>Create a new concept map</div>
          )}
          <Auth
            user={user}
            firebase={firebase}
            isSignedIn={isSignedIn}
            setIsLoading={setIsLoading}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      ) : (
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
      )}
      <hr />
    </div>
  )
};

export default withRouter(Home);
