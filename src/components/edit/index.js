import React, { Fragment, useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  CheckIcon,
  CheckCircleIcon,
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

import Preview from '../preview';
import Tooltip from '../tooltip';

const buttonClassName = `flex gap-1 text-primary bg-secondary px-2 py-1 hover:opacity-50`;
const buttonDisabledClassName = `flex gap-1 text-primary bg-secondary px-2 py-1 opacity-25`;
const selectClassName = `cursor-pointer text-primary bg-secondary px-2 py-1.5`;
const inputClassName = `text-secondary bg-primary px-2 py-1`;
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
    <div className="flex grow flex-col pb-3 font-mono">
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
          <Tooltip content="rename">
            <button className={buttonClassName} onClick={onClickRenameConceptMap}>
              {
                isRenameMode ? (
                  <Fragment>
                    <CheckIcon className={iconClassName} />
                  </Fragment>
                ) : (
                  <Fragment>
                    <PencilIcon className={iconClassName} />
                  </Fragment>
                )}
            </button>
          </Tooltip>
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
              <Tooltip content="delete">
                <button className={buttonClassName} onClick={onDeleteConceptMap}>
                  <TrashIcon className={iconClassName}/>
                </button>
              </Tooltip>
            )}
          </Fragment>
        )}
        <Tooltip content="create new">
          <button className={buttonClassName} onClick={handleClickNewConceptMap}>
            <PlusIcon className={iconClassName}/>
          </button>
        </Tooltip>
        {isSignedIn && (
          <Fragment>
          {conceptMapId && isSaving ? (
            <button className={buttonClassName}>
              <EllipsisHorizontalIcon className={iconClassName}/>
            </button>
          ) : (
            <Tooltip content="save">
              <button className={buttonClassName} onClick={onClickSave}>
                <DocumentCheckIcon className={iconClassName}/>
              </button>
            </Tooltip>
          )}
          {conceptMapId && isPublishing ? (
            <button disabled className={buttonDisabledClassName}>
              <EllipsisHorizontalIcon className={iconClassName}/>
            </button>
          ) : (
            <Tooltip content="publish">
              <button className={buttonClassName} onClick={onClickPublish}>
                <CloudArrowUpIcon className={iconClassName}/>
              </button>
            </Tooltip>
          )}
          {conceptMapId && isPublished ? (
            <CopyToClipboard
              text={shareUrl}
              onCopy={handleClickCopy}
            >
              <Tooltip content="copy public url">
                <button className={buttonClassName}>
                  {isCopied ? <CheckCircleIcon className={iconClassName}/> : <ClipboardIcon className={iconClassName}/>}

                </button>
              </Tooltip>
            </CopyToClipboard>
          ) : (
            <button className={buttonDisabledClassName}>
              <ClipboardIcon className={iconClassName}/>
            </button>
          )}
          {conceptMapId && isPublished ? (
            <Tooltip content="preview generator">
              <a href={shareUrl} target="_blank" rel="noreferrer" className={buttonClassName}>
                <EyeIcon className={iconClassName}/>
              </a>
            </Tooltip>
          ) : (
            <Tooltip content="preview (for published generators only)">
              <button className={buttonDisabledClassName}>
                <EyeIcon className={iconClassName}/>
              </button>
            </Tooltip>
            )}
          </Fragment>
        )}
      </div>
      {conceptMapText ? (
        <div className="flex grow font-mono">
          <div className="flex flex-col pt-3 w-4/6">
            <div className="text-sm font-bold text-center py-1 text-primary bg-quaternary">concept map</div>
            <textarea
              className="p-4 resize-none bg-secondary text-primary border-b-2 border-quaternary scrollbar outline-0 grow"
              placeholder="Enter concepts"
              onChange={onChangeConceptMapText}
              value={conceptMapText}
            />
          </div>
          <div className="flex flex-col pt-3 w-2/6">
            <div className="flex flex-col pl-3 mb-4">
              <div className="text-sm font-bold text-center py-1 text-secondary bg-tertiary">description (markdown)</div>
              <textarea
                className="p-4 resize-none bg-secondary h-44 text-primary border-b-2 border-tertiary scrollbar outline-0"
                placeholder="Enter description (Markdown supported)"
                onChange={onChangeConceptMapDescription}
                value={conceptMapDescription}
              />
            </div>
            <Preview conceptMapDescription={conceptMapDescription} />
          </div>
        </div>
      ) : (
        <div>Create a new concept map</div>
      )}
    </div>
  )
};

export default Edit;
