import React, { Fragment } from "react";

const Edit = ({
  conceptCollection,
  conceptMapDescription,
  conceptMapId,
  conceptMapIdRenaming,
  conceptMapText,
  isDeleteMode,
  isPublishing,
  isRenameMode,
  isSaving,
  isSignedIn,
  onCancelDelete,
  onChangeConceptMapDescription,
  onChangeConceptMapId,
  onChangeConceptMapText,
  onClickCancelDelete,
  onClickConfirmDelete,
  onClickNewConceptMap,
  onClickPublish,
  onClickRenameConceptMap,
  onClickSave,
  onConfirmDelete,
  onDeleteConceptMap,
  onSelectConceptMap
}) => (
  <div>
    {conceptMapId && (
      <Fragment>
        {isRenameMode ? (
          <input value={conceptMapIdRenaming} onChange={onChangeConceptMapId} />
        ) : (
          <select value={conceptMapId} onChange={onSelectConceptMap}>
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
      <button className="m-2" onClick={onClickRenameConceptMap}>
        {isRenameMode ? ('[Done]') : ('[Rename]')}
      </button>
    )}
    {isDeleteMode ? (
      <Fragment>
        Are You Sure?
        <button className="m-2" onClick={onConfirmDelete}>[Yes]</button>
        <button className="m-2" onClick={onCancelDelete}>[No]</button>
      </Fragment>
    ) : (
      <Fragment>
        {conceptMapId && (<button className="m-2" onClick={onDeleteConceptMap}>[Delete]</button>)}
      </Fragment>
    )}
    <button className="m-2" onClick={onClickNewConceptMap}>[New]</button>
    {isSignedIn && (
      <Fragment>
      {conceptMapId && isSaving ? (
        <button className="m-2">[Saving...]</button>
      ) : (
        <button className="m-2" onClick={onClickSave}>[Save]</button>
      )}
      {conceptMapId && isPublishing ? (
        <button className="m-2">[Publishing...]</button>
      ) : (
        <button className="m-2" onClick={onClickPublish}>[Publish]</button>
      )}
      </Fragment>
    )}
    <hr/>
    {conceptMapText ? (
      <Fragment>
        <textarea
          className="m-4 p-4 border border-black w-1/2 h-96"
          placeholder="Enter concepts"
          onChange={onChangeConceptMapText}
          value={conceptMapText}
        />
        <textarea
          className="m-4 p-4 border border-black w-1/2 h-96"
          placeholder="Enter description"
          onChange={onChangeConceptMapDescription}
          value={conceptMapDescription}
        />
      </Fragment>
    ) : (
      <div>Create a new concept map</div>
    )}
  </div>
);

export default Edit;
