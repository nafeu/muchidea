import { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';
import { find } from 'lodash';

import Auth from '../../auth';

import { generateIdeas } from '../../../services/idea';
import { buildConcepts } from '../../../services/concept';
import { DEFAULT_COUNT } from '../../../services/idea/constants';
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

  const [rawConceptMapText, setRawConceptMapText] = useState(localData.rawConceptMapText);
  const [rawConceptMapId, setRawConceptMapId] = useState(localData.rawConceptMapId)
  const [rawConceptMapIdRenaming, setRawConceptMapIdRenaming] = useState(localData.rawConceptMapId)

  const [isEditMode, setIsEditMode] = useState(false);
  const [isRenameMode, setIsRenameMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    if (results === []) {
      generateNewIdeas();
    }
  }, [])

  const generateNewIdeas = () => {
    const { issues: issuesBuildingConcepts, concepts, root } = buildConcepts(rawConceptMapText);
    const { issues: issuesGeneratingIdeas, ideas }  = generateIdeas({ concepts, root, count });

    const allIssues = [...issuesBuildingConcepts, ...issuesGeneratingIdeas];

    setResults(ideas);
    setIssuesDuringGeneration(allIssues);

    setLocalData({
      conceptCollection,
      rawConceptMapText,
      rawConceptMapId,
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

    const updatedrawConceptMapText = find(conceptCollection, { id: selectedId }).text;

    setRawConceptMapText(updatedrawConceptMapText);
    setRawConceptMapId(selectedId)
    setRawConceptMapIdRenaming(selectedId)
  }

  const handleClickEdit = () => {
    setIsEditMode(true);
  }

  const handleClickViewGenerator = () => {
    setIsEditMode(false);
  }

  const handleChangeRawConceptMapText = event => {
    const updatedrawConceptMapText = event.target.value;
    setRawConceptMapText(updatedrawConceptMapText);
    setLocalData({ ...localData, rawConceptMapText })
  }

  const handleClickRenameConceptMap = () => {
    if (!isRenameMode) {
      setIsRenameMode(true);
      return;
    }

    const { isValidId, error } = validateConceptMapId({
      id: rawConceptMapIdRenaming,
      currentId: rawConceptMapId,
      conceptCollection
    });

    if (isValidId) {
      const updatedConceptCollection = conceptCollection.map(conceptMap => {
        if (conceptMap.id === rawConceptMapId) {
          return {
            ...conceptMap,
            id: rawConceptMapIdRenaming
          }
        }

        return conceptMap;
      })

      setRawConceptMapId(rawConceptMapIdRenaming);
      setConceptCollection(updatedConceptCollection);
      setLocalData({
        ...localData,
        rawConceptMapId: rawConceptMapIdRenaming,
        conceptCollection: updatedConceptCollection,
      });

      setIsRenameMode(false);
      return;
    }

    // TODO: Handle error messages
    console.log({ error });
  }

  const handleChangeConceptMapId = event => {
    setRawConceptMapIdRenaming(event.target.value);
  }

  const handleClickNewConceptMap = () => {
    const newConceptMap = buildNewConceptMap(conceptCollection);
    const updatedConceptCollection = [...conceptCollection, newConceptMap];

    setConceptCollection(updatedConceptCollection);
    setRawConceptMapId(newConceptMap.id);
    setRawConceptMapIdRenaming(newConceptMap.id);
    setRawConceptMapText(newConceptMap.text);
    setLocalData({
      ...localData,
      rawConceptMapId: newConceptMap.id,
      conceptCollection: updatedConceptCollection,
    });
  }

  const handleClickDeleteConceptMap = () => {
    setIsDeleteMode(true);
  }

  const handleClickConfirmDelete = () => {
    let deletionIndex = null;

    const updatedConceptCollection = conceptCollection.filter(({ id }, index) => {
      if (id === rawConceptMapId) {
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
        setRawConceptMapId(activeConceptMap.id);
        setRawConceptMapIdRenaming(activeConceptMap.id);
        setRawConceptMapText(activeConceptMap.text);
        setLocalData({
          ...localData,
          rawConceptMapId: activeConceptMap.id,
          conceptCollection: updatedConceptCollection,
        });
      } else {
        setConceptCollection(updatedConceptCollection);
        setRawConceptMapId(null);
        setRawConceptMapIdRenaming(null);
        setRawConceptMapText(null);
        setLocalData({
          ...localData,
          rawConceptMapId: null,
          conceptCollection: updatedConceptCollection,
        });
      }
    }

    setIsDeleteMode(false);
  }

  const handleClickCancelDelete = () => {
    setIsDeleteMode(false);
  }

  const handleClickPublishConceptMap = () => {

  }

  return (
    <div>
      <div>
        {!isEditMode && (<button onClick={handleClickEdit}>Edit</button>)}
        {isEditMode && (<button onClick={handleClickViewGenerator}>Generate</button>)}
      </div>
      {isEditMode ? (
        <div>
          {rawConceptMapId && (
            <Fragment>
              {isRenameMode ? (
                <input value={rawConceptMapIdRenaming} onChange={handleChangeConceptMapId} />
              ) : (
                <select value={rawConceptMapId} onChange={handleSelectConceptMap}>
                  {conceptCollection.map(({ id }) => {
                    return (
                      <option key={id} value={id}>{id}</option>
                    )
                  })}
                </select>
              )}
            </Fragment>
          )}
          {rawConceptMapId && (
            <button className="m-2" onClick={handleClickRenameConceptMap}>
              {isRenameMode ? ('[Done]') : ('[Edit]')}
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
              {rawConceptMapId && (<button className="m-2" onClick={handleClickDeleteConceptMap}>[Delete]</button>)}
            </Fragment>
          )}
          <button className="m-2" onClick={handleClickNewConceptMap}>[New]</button>
          {rawConceptMapId && (<button className="m-2" onClick={handleClickPublishConceptMap}>[Publish]</button>)}
          <hr/>
          {rawConceptMapText ? (
            <textarea
              className="m-4 p-4 border border-black w-1/2 h-96"
              placeholder="Enter concepts"
              onChange={handleChangeRawConceptMapText}
              value={rawConceptMapText}
            />
          ) : (
            <div>Create a new concept map</div>
          )}
          <Auth
            user={user}
            firebase={firebase}
            isSignedIn={isSignedIn}
            setIsLoading={setIsLoading}
          />
        </div>
      ) : (
        <Fragment>
          {rawConceptMapId ? (
            <Fragment>
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
