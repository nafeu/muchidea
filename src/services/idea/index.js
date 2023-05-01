import { find, map, sample, includes, keys, uniq } from 'lodash';
import {
  DEFAULT_ATTEMPT_LIMIT,
  DEFAULT_RECURSION_LIMIT,
  PATTERN_ID,
  PATTERN_SQUARE_BRACKET,
  PATTERN_DOUBLE_SQUARE_BRACKET
} from './constants';

export const generateIdeas = ({
  attemptLimit = DEFAULT_ATTEMPT_LIMIT,
  concepts,
  count,
  recursionLimit = DEFAULT_RECURSION_LIMIT,
  root
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
  let attemptCount = 0;
  let recursionCount = 0;

  const ideas = [];
  let issues = [];

  const interpolate = inputString => {
    recursionCount += 1;

    if (recursionCount >= recursionLimit) {
      console.log(`Reached recursion limit of ${recursionLimit}`);
      issues.push(`To generate that many results, please expand the amount of unique combinations made possible in your concept map.`);
      return inputString;
    }

    let input = inputString;
    const matches = inputString.matchAll(PATTERN_ID);

    for (const [match] of matches) {
      const isEscapedMatch = match.match(PATTERN_DOUBLE_SQUARE_BRACKET) !== null

      if (isEscapedMatch) {
        input = input.replace(match, match.replace(PATTERN_SQUARE_BRACKET, ''));
        continue;
      }

      const id = match.replace(PATTERN_SQUARE_BRACKET, '');
      const matchedConcept = find(conceptCollection, { id });

      if (matchedConcept) {
        input = input.replace(match, interpolate(sample(matchedConcept.data)));
      } else {
        issues.push(`Could not match the concept: ${id}`)
      }
    }

    return input;
  }

  while (originalIdeaCounter > 0 && attemptCount < attemptLimit) {
    const idea = interpolate(sample(find(conceptCollection, { id: root }).data))

    const isOriginalIdea = !includes(ideas, idea);

    if (isOriginalIdea) {
      ideas.push(idea);
      originalIdeaCounter -= 1;
    }

    attemptCount += 1;
  }

  if (attemptCount === attemptLimit) {
    console.log(`Reached limit of attempts (${attemptLimit}) to create unique results.`)
    issues.push(`To generate that many results, please expand the amount of unique combinations made possible in your concept map.`)
  }

  issues = uniq(issues) || [];

  return { ideas, issues }
}
