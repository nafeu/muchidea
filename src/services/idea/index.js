import { find, map, sample, includes, flattenDeep, keys, uniq } from 'lodash';

import { ROOT_CONCEPT } from './constants';

export const generateIdeas = ({ concepts, count }) => {
  const conceptCollection = map(keys(concepts), key => ({
    id: key,
    data: concepts[key]
  }))

  let originalIdeaCounter = count;
  const ideas = [];
  let issues = [];

  const interpolate = inputString => {
    const inputArray = inputString.split(' ');

    const output = map(inputArray, item => {
      const hasSquareBrackets = includes(item, '[') && includes(item, ']');

      if (hasSquareBrackets) {
        const id = item.substring(1, item.length - 1);

        const matchedConcept = find(conceptCollection, { id });

        if (matchedConcept) {
          return interpolate(sample(matchedConcept.data));
        } else {
          issues.push(`Could not match the concept: ${id}`)
        }
      }

      return item;
    })

    return flattenDeep(output).join(' ');
  }

  while (originalIdeaCounter > 0) {
    const idea = interpolate(sample(find(conceptCollection, { id: ROOT_CONCEPT }).data))

    const isOriginalIdea = !includes(ideas, idea);

    if (isOriginalIdea) {
      ideas.push(idea);
      originalIdeaCounter -= 1;
    }
  }

  issues = uniq(issues);

  return { ideas, issues }
}
