export default {
    wallButtonId: 1,
    startButtonId: 2,
    targetButtonId: 3,
    weightButtonId: 4,

    emptyWeightId: -1,
    emptyId: 0,
    wallId: 1,
    startId: 2,
    targetId: 3,
    visId: 4,
    weightId: 5,
    visAndWeightId: 6,
    pathId: 7,
    pathAndWeightId: 8,

    bfsButtonId : 1,
    aStarButtonId : 2,
    dijkstraButtonId : 3,
    bestfsButtonId: 4,
    dfsButtonId:5,
    bidirectionalBFSButtonId : 6,
    bidirectionalDijkstraButtonId: 7,
    bidirectionalDFSButtonId: 8,
    bidirectionalAstarButtonId: 9,

    searchPhaseId : 1,
    designPhaseId : -1,

    startStopButtonId:1,
    pauseResumeButtonId:2,
    clearWallsButtonId:3,
    tutorialButtonId:4,

    ManhattanId: 1,
    EuclideanId: 2,
    ChebyshevId: 3,
    OctileId: 4,

    weightVal: 10,
    normalVal: 1,

    bfsInfo: "A traversing algorithm where you start from the start node and traverse the graph layerwise ie. from source node to directly connected nodes and further to the next level neighbour nodes.",
    bestfsInfo: "Unlike BFS and DFS, it uses an evaluation function to decide which adjacent node is most promising and then explore. Best FS falls in the criteria of heuristic search or informed search.",
    aStarInfo: "An informed search algorithms to find the shortest path between nodes in graph, and uses information about path and heuristics to find the solution",
    dijkstraInfo: "An algorithm for finding the shortest path from source vertex to all vertices in a given graph.",
    bidirectionalDFSInfo: "Unlike normal DFS where the search begins in one direction, here the search starts in both directions simultaneously from source to goal vertex. The recursive algorithm starts at the root node and explores as far as possible along each branch before backtracking.",
    bidirectionalBFSInfo: "Unlike normal BFS where the search begins in one direction, here the search starts in both directions simultaneously from source to goal vertex. The traversal goes on layerwise ie. from source node to directly connected nodes and further to the next level neighbour nodes.",
    bidirectionalAstarInfo: "The source and goal node  use A* method inorder to reach a common intersection point,hence reducing the time complexity.",
    bidirectionalDijkstraInfo: "The source and goal adapt Djikstra's process to reach a common intersection point,hence reducing the time complexity.",
    dfsInfo: "A traversing recursive algorithm that starts at the root node and explores as far as possible along each branch before backtracking.",

    manhattanInfo: "M",
    euclideanInfo: "E",
    octileInfo: "O",
    chebyshevInfo: "C"
}
