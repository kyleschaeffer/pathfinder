import { PathFinder } from './pathfinder';

// Pathfinding map (8x8)
const map =  `00000000
              00000000
              00000111
              00000000
              00110000
              00100000
              00100000
              00100000`;

// Maze map (12x12)
const maze = `000000000000
              011111111111
              000000000000
              111111111110
              000000000000
              011111111111
              000000000000
              111111111110
              000000000000
              011111111111
              000000000000
              111111111110`;

// Impossible map (8x8)
const impossible = `00000000
                    00000000
                    00000000
                    11111111
                    11111111
                    00000000
                    00000000
                    00000000`;

test('map string is parsed', () => {
  const pathfinder = new PathFinder(map);
  expect(pathfinder.map[4]).toEqual([0, 0, 1, 1, 0, 0, 0, 0]);
});

test('simple path is found', () => {
  const pathfinder = new PathFinder(map);
  expect(pathfinder.path({ x: 1, y: 1 }, { x: 3, y: 1 })).toBe(2);
});

test('complex path is found', () => {
  const pathfinder = new PathFinder(map);
  expect(pathfinder.path({ x: 7, y: 0 }, { x: 7, y: 7 })).toBe(29);
});

test('adjacent path is found', () => {
  const pathfinder = new PathFinder(map);
  expect(pathfinder.path({ x: 1, y: 1 }, { x: 2, y: 1 })).toBe(1);
});

test('complex maze path is found', () => {
  const pathfinder = new PathFinder(maze);
  expect(pathfinder.path({ x: 7, y: 0 }, { x: 7, y: 7 })).toBe(43);
});

test('impossible path is not found', () => {
  const pathfinder = new PathFinder(impossible);
  expect(pathfinder.path({ x: 0, y: 0 }, { x: 7, y: 7 })).toBe(-1);
});
