export const getRandomNumbersInRangeSequence = ({ max, amount, sequenceLength }) => {
  const output = [];

  for (let i = 0; i < sequenceLength; i++) {
    const result = [];

    while (result.length < amount) {
      const randomNumber = Math.floor(Math.random() * (max + 1));
      if (!result.includes(randomNumber)) {
        result.push(randomNumber);
      }
    }

    output.push(result);
  }

  return output;
}
