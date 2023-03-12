import { find, map, sample, includes, keys, uniq } from 'lodash';
import { DEFAULT_MAX_ATTEMPT_COUNT } from './constants';

export const generateIdeas = ({
  concepts,
  count,
  root,
  maxAttemptCount = DEFAULT_MAX_ATTEMPT_COUNT
}) => {
  const isMissingConcepts = concepts === null
    || concepts === undefined
    || Object.keys(concepts).length === 0;
  const isMissingCount = count === null || count === undefined;
  const isMissingRoot = root === null || root === undefined;

  const missingIssues = [
    ...(isMissingConcepts ? ['Missing concept map'] : []),
    ...(isMissingCount ? ['Missing count'] : []),
    ...(isMissingRoot ? ['Missing root'] : []),
  ]

  if (missingIssues.length > 0) return ({ issues: missingIssues, ideas: [] });

  const conceptCollection = map(keys(concepts), key => ({
    id: key,
    data: concepts[key]
  }))

  let originalIdeaCounter = count;
  let attempts = 0;

  const ideas = [];
  let issues = [];

  const interpolate = inputString => {
    const idPattern = /(?<!\[)\[(?:(?!\[\[).)*?\](?!\])/g;
    const squareBracketPattern = /^\[|\]$/g;
    const doubleSquareBracketPattern = /\[\[(.*?)\]\]/g;

    let input = inputString;
    const matches = inputString.matchAll(idPattern);

    for (const [match] of matches) {
      const isEscapedMatch = match.match(doubleSquareBracketPattern) !== null

      if (isEscapedMatch) {
        input = input.replace(match, match.replace(squareBracketPattern, ''));
        continue;
      }

      const id = match.replace(squareBracketPattern, '');
      const matchedConcept = find(conceptCollection, { id });

      if (matchedConcept) {
        input = input.replace(match, interpolate(sample(matchedConcept.data)));
      } else {
        issues.push(`Could not match the concept: ${id}`)
      }
    }

    return input;
  }

  while (originalIdeaCounter > 0 && attempts < maxAttemptCount) {
    const idea = interpolate(sample(find(conceptCollection, { id: root }).data))

    const isOriginalIdea = !includes(ideas, idea);

    if (isOriginalIdea) {
      ideas.push(idea);
      originalIdeaCounter -= 1;
    }

    attempts += 1;
  }

  if (attempts === maxAttemptCount) {
    issues.push('Reached maximum number of attempts trying to create unique results.')
  }

  issues = uniq(issues) || [];

  return { ideas, issues }
}
