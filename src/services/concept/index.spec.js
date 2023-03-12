import { buildConcepts } from './index';

describe('buildConcepts', () => {
  describe('given an empty string', () => {
    it('should return an empty concept map and empty root string', () => {
      const exampleInput = ''

      const result = buildConcepts(exampleInput);

      expect(Object.keys(result.concepts).length).toBe(0);
      expect(result.root).toBeNull();
    })
  });
  describe('given a non-empty string', () => {
    describe('with no # symbol', () => {
      it('should return an issue, an empty concept map and null root', () => {
        const exampleInput = 'root\nexample'

        const result = buildConcepts(exampleInput);

        expect(result).toEqual({
          issues: ['Missing root id'],
          concepts: {},
          root: null
        });
      })
    })
    describe('with a flat heirarchy', () => {
      it('should return a valid concept map with root string and no issues', () => {
        const exampleInput = '#root\nexample'

        const result = buildConcepts(exampleInput);

        expect(result).toEqual({
          concepts: {
            root: ['example']
          },
          root: 'root',
          issues: []
        });
      })
    })
    describe('with a deep heirarchy', () => {
      it('should return a valid concept map with root string and no issues', () => {
        const exampleInput = '#x\n[a]\n#a\n[b]\n#b\nc'

        const result = buildConcepts(exampleInput);

        expect(result).toEqual({
          concepts: {
            x: ['[a]'],
            a: ['[b]'],
            b: ['c']
          },
          root: 'x',
          issues: []
        });
      })
    })
  });
})
