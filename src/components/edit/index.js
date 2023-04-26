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

const buttonClassName = `flex gap-1 text-primary bg-secondary brightness-75 rounded-md px-2 py-1 hover:opacity-50`;
const buttonDisabledClassName = `flex gap-1 text-primary bg-secondary brightness-75 rounded-md px-2 py-1 opacity-25`;
const selectClassName = `cursor-pointer text-primary bg-secondary brightness-75 rounded-md px-2 py-1.5`;
const inputClassName = `text-secondary bg-primary brightness-75 rounded-md px-2 py-1`;
const iconClassName = `w-5 h-6`;
const hiddenSmallScreenSpanClassName = 'hidden lg:block';

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
                <Fragment>
                  <CheckIcon className={iconClassName} />
                  <span className={hiddenSmallScreenSpanClassName}>Done</span>
                </Fragment>
              ) : (
                <Fragment>
                  <PencilIcon className={iconClassName} />
                  <span className={hiddenSmallScreenSpanClassName}>Rename</span>
                </Fragment>
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
                <span className={hiddenSmallScreenSpanClassName}>Delete</span>
              </button>
            )}
          </Fragment>
        )}
        <button className={buttonClassName} onClick={handleClickNewConceptMap}>
          <PlusIcon className={iconClassName}/>
          <span className={hiddenSmallScreenSpanClassName}>New</span>
        </button>
        {isSignedIn && (
          <Fragment>
          {conceptMapId && isSaving ? (
            <button className={buttonClassName}>
              <EllipsisHorizontalIcon className={iconClassName}/>
              <span className={hiddenSmallScreenSpanClassName}>Saving</span>
            </button>
          ) : (
            <button className={buttonClassName} onClick={onClickSave}>
              <DocumentCheckIcon className={iconClassName}/>
              <span className={hiddenSmallScreenSpanClassName}>Save</span>
            </button>
          )}
          {conceptMapId && isPublishing ? (
            <button disabled className={buttonDisabledClassName}>
              <EllipsisHorizontalIcon className={iconClassName}/>
              <span className={hiddenSmallScreenSpanClassName}>Publishing</span>
            </button>
          ) : (
            <button className={buttonClassName} onClick={onClickPublish}>
              <CloudArrowUpIcon className={iconClassName}/>
              <span className={hiddenSmallScreenSpanClassName}>Publish</span>
            </button>
          )}
          {conceptMapId && isPublished ? (
            <CopyToClipboard
              text={shareUrl}
              onCopy={handleClickCopy}
            >
              <button className={buttonClassName}>
                {isCopied ? <CheckCircleIcon className={iconClassName}/> : <ClipboardIcon className={iconClassName}/>}

                <span className={hiddenSmallScreenSpanClassName}>{isCopied ? 'Copied To Clipboard.' : 'Copy Public URL'}</span>
              </button>
            </CopyToClipboard>
          ) : (
            <button className={buttonDisabledClassName}>
              <ClipboardIcon className={iconClassName}/>
              <span className={hiddenSmallScreenSpanClassName}>Copy Public URL</span>
            </button>
          )}
          {conceptMapId && isPublished ? (
            <a href={shareUrl} target="_blank" rel="noreferrer" className={buttonClassName}>
              <EyeIcon className={iconClassName}/>
              <span className={hiddenSmallScreenSpanClassName}>View</span>
            </a>
          ) : (
            <button className={buttonDisabledClassName}>
              <EyeIcon className={iconClassName}/>
              <span className={hiddenSmallScreenSpanClassName}>View</span>
            </button>
            )}
          </Fragment>
        )}
      </div>
      {conceptMapText ? (
        <div className="flex grow">
          <div className="flex flex-col pt-3 w-4/6">
            <div className="text-sm font-bold text-center underline text-secondary bg-primary rounded-t-md">Description</div>
            <textarea
              className="p-4 resize-none bg-secondary brightness-75 h-36 text-primary rounded-md scrollbar outline-0 mb-3"
              placeholder="Enter description (Markdown supported)"
              onChange={onChangeConceptMapDescription}
              value={conceptMapDescription}
            />
            <div className="text-sm font-bold text-center underline text-secondary bg-primary rounded-t-md">Concept Map</div>
            <textarea
              className="p-4 resize-none bg-secondary brightness-75 text-primary rounded-md scrollbar outline-0 grow"
              placeholder="Enter concepts"
              onChange={onChangeConceptMapText}
              value={conceptMapText}
            />
          </div>
          <div className="flex flex-col pt-3 w-2/6">
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
