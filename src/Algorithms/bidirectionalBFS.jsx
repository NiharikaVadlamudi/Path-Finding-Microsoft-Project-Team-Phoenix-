import BFS from "./bfs.jsx"
import BidirectionalAlgorithm from "./bidirectionalAlgorithm.jsx"

class BidirectionalBFS extends BidirectionalAlgorithm{

    constructor(graph, neigh, heur, exec=true) {
        
        super(graph, neigh, heur)

        this.s2g = new BFS(graph, neigh, heur, false)
        let graphRev = JSON.parse(JSON.stringify(graph))
        let temp = graphRev.gridState.startLoc
        graphRev.gridState.startLoc = graphRev.gridState.targetLoc
        graphRev.gridState.targetLoc = temp
        this.g2s = new BFS(graphRev, neigh, heur, false)
        
        // run on creation
        if (exec)
            return this.execute();
    }
}

export default BidirectionalBFS;