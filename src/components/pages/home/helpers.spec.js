import { validateConceptMapId, getNewUniqueId } from './helpers';

describe('validateConceptMapId', () => {
  const exampleConceptCollection = [
    {
      id: 'a',
      text: '#a\n1\n2'
    },
    {
      id: 'b',
      text: '#b\n3\n4'
    }
  ];

  describe('given an empty string', () => {
    it('should return as invalid with an error message', () => {
      expect(validateConceptMapId({
        id: '',
        conceptCollection: exampleConceptCollection,
        currentId: 'a'
      })).toEqual({
        error: 'Name cannot be empty.',
        isValidId: false
      });
    })
  });
  describe('given a string that is too long', () => {
    it('should return as invalid with an error message', () => {
      expect(validateConceptMapId({
        id: 'fkj;lkjaosidjfasdfja;sdlkfj;alsdkjfasodifjalsdkfjasd',
        conceptCollection: exampleConceptCollection,
        currentId: 'a'
      })).toEqual({
        error: 'Name is too long.',
        isValidId: false
      });
    })
  });
  describe('given a string for a conceptMapId that already exists', () => {
    it('should return as invalid with an error message', () => {
      expect(validateConceptMapId({
        id: 'a',
        conceptCollection: exampleConceptCollection,
        currentId: 'b'
      })).toEqual({
        error: 'Name already exists.',
        isValidId: false
      });
    })
  });
  describe('given the same string as the currentId', () => {
    it('should return as valid', () => {
      expect(validateConceptMapId({
        id: 'a',
        conceptCollection: exampleConceptCollection,
        currentId: 'a'
      })).toEqual({
        isValidId: true
      });
    })
  });
})

describe('getNewUniqueId', () => {
  describe('given an array of ids without untitled_map', () => {
    it('should return untitled_map', () => {
      expect(getNewUniqueId(
        [
          'a',
          'b'
        ]
      )).toBe('untitled_map')
    })
  })
  describe('given an array of ids with untitled_map', () => {
    it('should return untitled_map_1', () => {
      expect(getNewUniqueId(
        [
          'a',
          'b',
          'untitled_map'
        ]
      )).toBe('untitled_map_1')
    })
  })
  describe('given an array of ids with untitled_map, untitled_map_1', () => {
    it('should return untitled_map_2', () => {
      expect(getNewUniqueId(
        [
          'a',
          'b',
          'untitled_map',
          'untitled_map_1'
        ]
      )).toBe('untitled_map_2')
    })
  })
})
