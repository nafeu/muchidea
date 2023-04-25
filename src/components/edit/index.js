import React, { Fragment, useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  CheckIcon,
  ClipboardIcon,
  CloudArrowUpIcon,
  DocumentCheckIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const buttonClassName = `flex gap-1 border border-primary rounded-md px-2 py-1 hover:opacity-50`;
const buttonDisabledClassName = `flex gap-1 border border-primary rounded-md px-2 py-1 opacity-50`;
const selectClassName = `border bg-secondary border-primary rounded-md px-2 py-1.5`;
const inputClassName = `border bg-primary border-primary rounded-md px-2 py-1`;
const iconClassName = `w-5 h-6`;

const ONE_SECOND = 1000;

const Edit = ({
  conceptCollection,
  conceptMapDescription,
  conceptMapId,
  conceptMapIdRenaming,
  conceptMapText,
  firebase,
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
  onSelectConceptMap,
  user
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const shareUrl = `${window.location.origin}/shared/${conceptMapId}`;

  const checkIfIsPublished = async () => {
    setIsPublished(false);

    const db = firebase.firestore()

    const publicCollectionsRef = db.collection('public_collections');

    try {
      const snapshot = await publicCollectionsRef.doc(conceptMapId).get();

      const isUpdateable = snapshot.exists && snapshot.data().owner === user.uid;

      if (isUpdateable) {
        setIsPublished(true);
      }
    } catch (error) {
      // TODO: Handle error messages
      alert(error);
      console.error(error);
    }
  }

  useEffect(() => {
    if (!isSignedIn) return;

    checkIfIsPublished();
  }, [isSignedIn, isPublishing])

  const handleClickCopy = () => {
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, ONE_SECOND)
  }

  const handleClickNewConceptMap = () => {
    setIsPublished(false);
    onClickNewConceptMap();
  }

  return (
    <div className="flex grow flex-col pb-3">
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
          <div className="flex gap-2 items-center">
            <div className="font-bold">Are You Sure?</div>
            <button className={buttonClassName} onClick={onConfirmDelete}>
              <CheckIcon className={iconClassName} />
            </button>
            <button className={buttonClassName} onClick={onCancelDelete}>
              <XMarkIcon className={iconClassName} />
            </button>
          </div>
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
        <button className={buttonClassName} onClick={handleClickNewConceptMap}>
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
            <button disabled className={buttonDisabledClassName}>
              <EllipsisHorizontalIcon className={iconClassName}/>
              Publishing
            </button>
          ) : (
            <button className={buttonClassName} onClick={onClickPublish}>
              <CloudArrowUpIcon className={iconClassName}/>
              Publish
            </button>
          )}
          {conceptMapId && isPublished ? (
            <CopyToClipboard
              text={shareUrl}
              onCopy={handleClickCopy}
            >
              <button className={buttonClassName}>
                <ClipboardIcon className={iconClassName}/>
                {isCopied ? 'Copied To Clipboard.' : 'Copy Share URL'}
              </button>
            </CopyToClipboard>
          ) : (
            <button className={buttonDisabledClassName}>
              <ClipboardIcon className={iconClassName}/>
              Copy Share URL
            </button>
          )}
          {conceptMapId && isPublished ? (
            <a href={shareUrl} target="_blank" rel="noreferrer" className={buttonClassName}>
              <EyeIcon className={iconClassName}/>
              Preview
            </a>
          ) : (
            <button className={buttonDisabledClassName}>
              <EyeIcon className={iconClassName}/>
              Preview
            </button>
            )}
          </Fragment>
        )}
      </div>
      {conceptMapText ? (
        <div className="flex gap-5 pt-3 grow">
          <textarea
            className="p-4 resize-none bg-secondary brightness-75 text-primary rounded-md w-1/2 scrollbar outline-0 grow"
            placeholder="Enter concepts"
            onChange={onChangeConceptMapText}
            value={conceptMapText}
          />
          <textarea
            className="p-4 resize-none bg-secondary brightness-75 text-primary rounded-md w-1/2 scrollbar outline-0"
            placeholder="Enter description"
            onChange={onChangeConceptMapDescription}
            value={conceptMapDescription}
          />
        </div>
      ) : (
        <div>Create a new concept map</div>
      )}
    </div>
  )
};

export default Edit;
