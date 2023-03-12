import { find, map, sample, includes, flattenDeep, keys, uniq } from 'lodash';
import { MAX_ATTEMPT_MULTIPLIER } from './constants';

export const generateIdeas = ({ concepts, count, root }) => {
  const conceptCollection = map(keys(concepts), key => ({
    id: key,
    data: concepts[key]
  }))

  let originalIdeaCounter = count;
  let attempts = 0;

  const maxAttempts = count * MAX_ATTEMPT_MULTIPLIER;

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

  while (originalIdeaCounter > 0 && attempts < maxAttempts) {
    const idea = interpolate(sample(find(conceptCollection, { id: root }).data))

    const isOriginalIdea = !includes(ideas, idea);

    if (isOriginalIdea) {
      ideas.push(idea);
      originalIdeaCounter -= 1;
    }

    attempts += 1;
  }

  if (attempts === maxAttempts) {
    issues.push('Reached maximum number of attempts trying to create unique results.')
  }

  issues = uniq(issues);

  return { ideas, issues }
}
