/**
 * Simple implementation of pathfinding algorithm implementation
 *  - Use Dijkstra's algorithm for fill/intersection pathfinding
 *  - In the future, may want to add A*
 */
export class PathFinder {
  /**
   * Two-dimensional map of nodes for this area
   */
  public map: number[][];

  /**
   * Area size (square)
   */
  private size: number;

  /**
   * Instantiate a new pathfinder map
   */
  constructor(map: string = '000000\n000000\n000000\n000000\n000000\n000000') {
    // Parse map string
    const mapRows = map.split('\n');
    this.size = mapRows.length;

    // New empty node map
    this.map = new Array<number[]>(this.size);
    for (let i = 0; i < this.size; i++) {
      // Parse row
      const row: number[] = mapRows[i].trim().split('').map(c => parseInt(c, 10));
      if (row.length !== this.size) throw new Error('Invalid map input');

      // Set map row
      this.map[i] = row;
    }
  }

  /**
   * Find shortest path between given points
   *  - Uses Dijkstra's pathfinding algorithm
   *  - Spiral out from both points until an intersection is found
   */
  public path(a: IPoint, b: IPoint): number {
    // Out of bounds
    if (!this.inBounds(a) || !this.inBounds(b)) throw new Error('Point out of range');

    // Points are identical
    if (a.x === b.x && a.y === b.y) throw new Error('Points are identical');

    // Visited points array
    const visitedPoints: IVisitedPoint[][] = this.map.map((row, y) => row.map((point, x) => {
      return { closedBy: ClosedBy.None, distance: 0, x, y };
    }));

    // Close points a and b
    visitedPoints[a.y][a.x].closedBy = ClosedBy.A;
    visitedPoints[b.y][b.x].closedBy = ClosedBy.B;

    // Point queues
    let aQueue: IVisitedPoint[] = [visitedPoints[a.y][a.x]];
    let bQueue: IVisitedPoint[] = [visitedPoints[b.y][b.x]];

    // Iteration counter
    let i = 0;

    // Spiral out from points a and b
    while (aQueue.length && bQueue.length) {
      i++;

      // Get point and neighbors (a)
      const aPoint = aQueue.shift();
      aQueue = [];
      for (const neighbor of this.neighbors(aPoint)) {
        // Get neighbor visited point
        const nPoint = visitedPoints[neighbor.y][neighbor.x];

        // Found the path
        if (nPoint.closedBy === ClosedBy.B) return nPoint.distance + i;

        // Update neighbor and add to queue
        else if (nPoint.closedBy === ClosedBy.None) {
          nPoint.distance = i;
          nPoint.closedBy = ClosedBy.A;
          aQueue.push(nPoint);
        }
      }

      // Get point and neighbors (b)
      const bPoint = bQueue.shift();
      bQueue = [];
      for (const neighbor of this.neighbors(bPoint)) {
        // Get neighbor visited point
        const nPoint = visitedPoints[neighbor.y][neighbor.x];

        // Found the path
        if (nPoint.closedBy === ClosedBy.A) return nPoint.distance + i;

        // Update neighbor and add to queue
        else if (nPoint.closedBy === ClosedBy.None) {
          nPoint.distance = i;
          nPoint.closedBy = ClosedBy.B;
          bQueue.push(nPoint);
        }
      }
    }

    // Not found
    console.log(visitedPoints.map((row, y) => row.map((point, x) => point.closedBy).join(' ')).join('\n'));
    return -1;
  }

  /**
   * Get in-bound non-blocked neighbors from given point
   */
  private neighbors(point: IPoint|IVisitedPoint): IPoint[] {
    // Init neighbors
    const neighbors: IPoint[] = [];

    // Left
    const leftNeighbor: IPoint = { x: point.x - 1, y: point.y };
    if (this.inBounds(leftNeighbor) && this.map[leftNeighbor.y][leftNeighbor.x] !== 1) neighbors.push(leftNeighbor);

    // Right
    const rightNeighbor: IPoint = { x: point.x + 1, y: point.y };
    if (this.inBounds(rightNeighbor) && this.map[rightNeighbor.y][rightNeighbor.x] !== 1) neighbors.push(rightNeighbor);

    // Top
    const topNeighbor: IPoint = { x: point.x, y: point.y - 1 };
    if (this.inBounds(topNeighbor) && this.map[topNeighbor.y][topNeighbor.x] !== 1) neighbors.push(topNeighbor);

    // Bottom
    const bottomNeighbor: IPoint = { x: point.x, y: point.y + 1 };
    if (this.inBounds(bottomNeighbor) && this.map[bottomNeighbor.y][bottomNeighbor.x] !== 1) neighbors.push(bottomNeighbor);

    return neighbors;
  }

  /**
   * Determine if given point is within the map bounds
   */
  private inBounds(point: IPoint|IVisitedPoint): boolean {
    return (
      point.x >= 0 &&
      point.y >= 0 &&
      point.x < this.size &&
      point.y < this.size
    );
  }
}

interface IPoint {
  x: number;
  y: number;
}

interface IVisitedPoint extends IPoint {
  closedBy: ClosedBy;
  distance: number;
}

enum ClosedBy {
  None,
  A,
  B,
}
