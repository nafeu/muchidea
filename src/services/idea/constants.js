export const EXAMPLE_CONCEPT_A = `#root
[a] [b] [c]

#a
1
2
3

#b
x
y
z

#c
!
#
*
`;

export const EXAMPLE_CONCEPT_B = `#root
[d] [e] [f]

#d
4
5
6

#e
u
v
w

#f
$
%
^
`;

export const DEFAULT_COUNT = 5;
export const DEFAULT_ATTEMPT_LIMIT = 2000;
export const DEFAULT_RECURSION_LIMIT = 2000;

export const EXAMPLE_CONCEPTS = [
  {
    id: 'exampleA',
    text: EXAMPLE_CONCEPT_A
  },
  {
    id: 'exampleB',
    text: EXAMPLE_CONCEPT_B
  },
]

export const PATTERN_ID = /(?<!\[)\[(?:(?!\[\[).)*?\](?!\])/g;
export const PATTERN_SQUARE_BRACKET = /^\[|\]$/g;
export const PATTERN_DOUBLE_SQUARE_BRACKET = /\[\[(.*?)\]\]/g;
