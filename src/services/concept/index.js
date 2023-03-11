export const buildConcepts = rawText => {
  const conceptText = rawText
    .split('\n')
    .filter(item => item.length > 0 && item !== '');

  const concepts = {}

  let activeKey = null;
  let root = null;

  for (const line of conceptText) {
    const isConceptKey = line[0] === '#';

    if (isConceptKey) {
      activeKey = line.substring(1);
      if (root === null) {
        root = activeKey;
      }
    } else if (activeKey) {
      if (concepts[activeKey]) {
        concepts[activeKey].push(line);
      } else {
        concepts[activeKey] = [line];
      }
    }
  }

  return { concepts, root }
}
