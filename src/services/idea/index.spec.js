import { generateIdeas } from './index';

describe('generateIdeas', () => {
  describe('given an empty concept map, count, and root', () => {
    it('should generate issues and empty ideas', () => {
      const exampleInput = {}

      const result = generateIdeas(exampleInput);

      expect(result.issues).toEqual([
        'Missing concept map',
        'Missing count',
        'Missing root'
      ]);
    })
  });
  describe('given a valid non-empty concept map, count, and root', () => {
    describe('when count = 1', () => {
      it('should generate empty issues and an ideas array', () => {
        const exampleInput = {
          concepts: {
            "root": ['a', 'b']
          },
          count: 1,
          root: 'root'
        }

        const result = generateIdeas(exampleInput);

        expect(result.issues.length).toBe(0);
        expect(result.ideas.length).toBe(1);
        expect([
          ['a'],
          ['b']
        ]).toContainEqual(result.ideas);
      })
    })
    describe('when count > 1', () => {
      it('should generate empty issues and an ideas array', () => {
        const exampleInput = {
          concepts: {
            "root": ['a', 'b']
          },
          count: 2,
          root: 'root'
        }

        const result = generateIdeas(exampleInput);

        expect([
          ['Reached limit of attempts (9999) to create unique results.'],
          []
        ]).toContainEqual(result.issues);
        expect(result.ideas.length).toBe(2);
        expect([
          ['a', 'b'],
          ['b', 'a'],
          ['a'],
          ['b']
        ]).toContainEqual(result.ideas);
      })
    })
    describe('when given a heirarchy with count = 1', () => {
      it('should generate empty issues and an ideas array', () => {
        const exampleInput = {
          concepts: {
            "root": ['[a] [b]'],
            "a": ['1'],
            "b": ['2']
          },
          count: 1,
          root: 'root'
        }

        const result = generateIdeas(exampleInput);

        expect(result.issues.length).toBe(0);
        expect(result.ideas.length).toBe(1);
        expect([
          ['1 2'],
        ]).toContainEqual(result.ideas);
      })
    })
    describe('when given an extended heirarchy with count = 1', () => {
      it('should generate empty issues and an ideas array', () => {
        const exampleInput = {
          concepts: {
            "root": ['[a] [b]'],
            "a": ['1', '2'],
            "b": ['3', '4']
          },
          count: 1,
          root: 'root'
        }

        const result = generateIdeas(exampleInput);

        expect(result.issues.length).toBe(0);
        expect(result.ideas.length).toBe(1);
        expect([
          ['1 3'],
          ['1 4'],
          ['2 3'],
          ['2 4']
        ]).toContainEqual(result.ideas);
      })
    })
    describe('when given no-spaces in root with count = 1', () => {
      it('should generate empty issues and an ideas array', () => {
        const exampleInput = {
          concepts: {
            "root": ['[a][b]'],
            "a": ['1'],
            "b": ['2']
          },
          count: 1,
          root: 'root'
        }

        const result = generateIdeas(exampleInput);

        expect(result.issues.length).toBe(0);
        expect(result.ideas.length).toBe(1);
        expect(result.ideas[0]).toEqual('12');
      })
    })
    describe('when given escaped square brackets in root with count = 1', () => {
      it('should generate empty issues and an ideas array', () => {
        const exampleInputA = {
          concepts: {
            "root": ['[[a]][b]'],
            "a": ['1'],
            "b": ['2']
          },
          count: 1,
          root: 'root'
        }

        const resultA = generateIdeas(exampleInputA);

        expect(resultA.issues.length).toBe(0);
        expect(resultA.ideas.length).toBe(1);
        expect(resultA.ideas[0]).toEqual('[a]2');

        const exampleInputB = {
          concepts: {
            "root": ['[[a]] [b] [[c]] [d][e]'],
            "b": ['1'],
            "d": ['2'],
            "e": ['3']
          },
          count: 1,
          root: 'root'
        }

        const resultB = generateIdeas(exampleInputB);

        expect(resultB.issues.length).toBe(0);
        expect(resultB.ideas.length).toBe(1);
        expect(resultB.ideas[0]).toEqual('[a] 1 [c] 23');
      })
    })
  });
  describe('given a small valid non-empty concept map with high count, and root', () => {
    it('should return a maximum attempt issue', () => {
      const exampleInput = {
        concepts: {
          "root": ['a']
        },
        count: 2,
        root: 'root',
        attemptLimit: 2
      }

      const result = generateIdeas(exampleInput);

      expect(result.issues.length).toBe(1);
      expect(result.ideas.length).toBe(1);
      expect([
        ['a'],
      ]).toContainEqual(result.ideas);
      expect(result.issues).toEqual([
        'Reached limit of attempts (2) to create unique results.'
      ]);
    })
  });
  describe('given a small non-empty concept map with a cyclical mapping', () => {
    it('should return a maximum recursion issue', () => {
      const exampleInput = {
        concepts: {
          "a": ['[b]'],
          "b": ['[a]']
        },
        count: 1,
        root: 'a'
      }

      const result = generateIdeas(exampleInput);

      expect(result.issues.length).toBe(1);
      expect(result.ideas.length).toBe(1);
      expect([
        ['[a]'],
        ['[b]']
      ]).toContainEqual(result.ideas);
      expect(result.issues).toEqual([
        'Reached recursion limit (2000) generating results'
      ]);
    })
  });
})
