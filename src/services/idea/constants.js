export const EXAMPLE_CONCEPT = `#prompt
Draw [number] [color] [shapes]

#number
two
three

#color
red
green
blue

#shapes
cirles
squares
triangles
`;

export const DEFAULT_COUNT = 5;
export const DEFAULT_ATTEMPT_LIMIT = 2000;
export const DEFAULT_RECURSION_LIMIT = 2000;

export const EXAMPLE_CONCEPTS = [
  {
    id: 'untitled_map',
    text: EXAMPLE_CONCEPT,
    description: ''
  }
]

export const PATTERN_ID = /(?<!\[)\[(?:(?!\[\[).)*?\](?!\])/g;
export const PATTERN_SQUARE_BRACKET = /^\[|\]$/g;
export const PATTERN_DOUBLE_SQUARE_BRACKET = /\[\[(.*?)\]\]/g;
