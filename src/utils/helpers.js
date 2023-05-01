const MAX_UNIQUE_ATTEMPTS = 1000;

export const getRandomNumbersInRangeSequence = ({ max, amount, sequenceLength }) => {
  let uniqueAttempts = 0;
  let lastSequence = [];
  const sequences = [];

  while (sequences.length < sequenceLength && uniqueAttempts < MAX_UNIQUE_ATTEMPTS) {
    const sequence = [];

    while (sequence.length < amount && uniqueAttempts < MAX_UNIQUE_ATTEMPTS) {
      const randomNum = Math.floor(Math.random() * (max + 1));

      if (!sequence.includes(randomNum)) {
        sequence.push(randomNum);
      }

      uniqueAttempts += 1;
    }

    if (!areArraysEqual(sequence, lastSequence)) {
      sequences.push(sequence);
      lastSequence = sequence;
    }

    uniqueAttempts += 1;
  }

  console.log(JSON.stringify(sequences));

  return sequences;
}

function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1.sort()[i] !== arr2.sort()[i]) {
      return false;
    }
  }

  return true;
}
