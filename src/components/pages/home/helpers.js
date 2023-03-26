import { find, map, includes } from 'lodash';

import { MIN_ID_LENGTH, MAX_ID_LENGTH } from './constants';

export const validateConceptMapId = ({ id, conceptCollection, currentId }) => {
  if (id === currentId) {
    return { isValidId: true }
  }

  if (id === null || id === undefined || id.length < MIN_ID_LENGTH) {
    return {
      isValidId: false,
      error: 'Name cannot be empty.'
    }
  }

  if (id.length > MAX_ID_LENGTH) {
    return {
      isValidId: false,
      error: 'Name is too long.'
    }
  }

  if (find(conceptCollection, { id })) {
    return {
      isValidId: false,
      error: 'Name already exists.'
    }
  }

  return { isValidId: true };
}

export const getNewUniqueId = existingIds => {
  let count = 0;
  let output = 'untitled_map'

  while (includes(existingIds, output)) {
    count += 1;
    output = `untitled_map_${count}`
  }

  return output;
}

export const buildNewConceptMap = conceptCollection => {
  const existingIds = map(conceptCollection, ({ id }) => id);

  return {
    id: getNewUniqueId(existingIds),
    text: '#prompt\nMake a [concept]\n\n#concept\nthing\nproject\nvideo',
    description: ''
  }
}

export const getFourRandomDigits = () => (Math.floor(1000 + Math.random() * 9000))
