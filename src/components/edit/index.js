import React, { Fragment } from "react";
import {
  PencilIcon,
  CheckIcon,
  TrashIcon,
  PlusIcon,
  CloudArrowUpIcon,
  DocumentCheckIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'

const buttonClassName = `flex gap-1 border border-slate-300 rounded-md px-2 py-1 hover:opacity-50`;
const selectClassName = `border border-slate-300 rounded-md px-2 py-1.5`;
const inputClassName = `border bg-slate-300 border-slate-300 rounded-md px-2 py-1`;
const iconClassName = `w-5 h-6`;

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
  <div className="grow">
    <div className="flex gap-3 mt-3">
      {conceptMapId && (
        <Fragment>
          {isRenameMode ? (
            <input className={inputClassName} value={conceptMapIdRenaming} onChange={onChangeConceptMapId} />
          ) : (
            <select className={selectClassName} value={conceptMapId} onChange={onSelectConceptMap}>
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
        <button className={buttonClassName} onClick={onClickRenameConceptMap}>
          {
            isRenameMode ? (
              <Fragment><CheckIcon className={iconClassName} />Done</Fragment>
            ) : (
              <Fragment><PencilIcon className={iconClassName} />Rename</Fragment>
            )}
        </button>
      )}
      {isDeleteMode ? (
        <Fragment>
          Are You Sure?
          <button className={buttonClassName} onClick={onConfirmDelete}>Yes</button>
          <button className={buttonClassName} onClick={onCancelDelete}>No</button>
        </Fragment>
      ) : (
        <Fragment>
          {conceptMapId && (
            <button className={buttonClassName} onClick={onDeleteConceptMap}>
              <TrashIcon className={iconClassName}/>
              Delete
            </button>
          )}
        </Fragment>
      )}
      <button className={buttonClassName} onClick={onClickNewConceptMap}>
        <PlusIcon className={iconClassName}/>
        New
      </button>
      {isSignedIn && (
        <Fragment>
        {conceptMapId && isSaving ? (
          <button className={buttonClassName}>
            <EllipsisHorizontalIcon className={iconClassName}/>
            Saving
          </button>
        ) : (
          <button className={buttonClassName} onClick={onClickSave}>
            <DocumentCheckIcon className={iconClassName}/>
            Save
          </button>
        )}
        {conceptMapId && isPublishing ? (
          <button className={buttonClassName}>
            <EllipsisHorizontalIcon className={iconClassName}/>
            Publishing
          </button>
        ) : (
          <button className={buttonClassName} onClick={onClickPublish}>
            <CloudArrowUpIcon className={iconClassName}/>
            Publish
          </button>
        )}
        </Fragment>
      )}
    </div>
    {conceptMapText ? (
      <div className="flex gap-5 pt-3">
        <textarea
          className="p-4 resize-none bg-slate-100 rounded-md w-1/2 h-96"
          placeholder="Enter concepts"
          onChange={onChangeConceptMapText}
          value={conceptMapText}
        />
        <textarea
          className="p-4 resize-none bg-slate-100 rounded-md w-1/2 h-96"
          placeholder="Enter description"
          onChange={onChangeConceptMapDescription}
          value={conceptMapDescription}
        />
      </div>
    ) : (
      <div>Create a new concept map</div>
    )}
  </div>
);

export default Edit;
