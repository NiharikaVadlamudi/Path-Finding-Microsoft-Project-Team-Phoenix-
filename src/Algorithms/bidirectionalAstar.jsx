import Astar from "./astar.jsx"
import BidirectionalAlgorithm from "./bidirectionalAlgorithm.jsx"

class BidirectionalAstar extends BidirectionalAlgorithm{

    constructor(graph, neigh, heur, exec=true) {
        
        super(graph, neigh, heur)

        this.s2g = new Astar(graph, neigh, heur, false)
        let graphRev = JSON.parse(JSON.stringify(graph))
        let temp = graphRev.gridState.startLoc
        graphRev.gridState.startLoc = graphRev.gridState.targetLoc
        graphRev.gridState.targetLoc = temp
        this.g2s = new Astar(graphRev, neigh, heur, false)
        
        // run on creation
        if (exec)
            return this.execute();
    }
}

export default BidirectionalAstar;
