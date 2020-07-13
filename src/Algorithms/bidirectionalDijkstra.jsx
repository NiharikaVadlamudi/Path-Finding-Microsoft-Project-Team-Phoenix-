import Dijkstra from "./dijkstra.jsx"

class BidirectionalDijkstra {

    constructor(graph, neigh, heur, exec=true) {
        this.status = graph.gridState.status
        this.beg = graph.gridState.startLoc
        this.end = graph.gridState.targetLoc
        this.rows = this.status.length
        this.cols = this.status[0].length
        let graphRev = JSON.parse(JSON.stringify(graph))
        let temp = graphRev.gridState.startLoc
        graphRev.gridState.startLoc = graphRev.gridState.targetLoc
        graphRev.gridState.targetLoc = temp
        this.s2g = new Dijkstra(graph, neigh, heur, false)
        this.g2s = new Dijkstra(graphRev, neigh, heur, false)
        this.orderVisited = []
        this.par = []
        for (let i = 0; i < this.rows; i++) {
            this.par[i] = []
            for (let j = 0; j < this.cols; j++) {
                this.par[i][j] = [i, j]
            }
        }
        this.f = 0;

        if (exec)
            return this.execute();
    }

    step() {
        let x, y, goNext;
        goNext = false;
        if (this.s2g.step()) {
            x = this.s2g.orderVisited[this.s2g.orderVisited.length - 1][0]
            y = this.s2g.orderVisited[this.s2g.orderVisited.length - 1][1]
            if (this.g2s.vis[x][y] === 2){
                this.f = 1;
                return false;
            }
            this.orderVisited.push([x, y])
            this.par[x][y] = this.s2g.par[x][y]
            goNext = true;
        }
        if (this.g2s.step()) {
            x = this.g2s.orderVisited[this.g2s.orderVisited.length - 1][0]
            y = this.g2s.orderVisited[this.g2s.orderVisited.length - 1][1]
            if (this.s2g.vis[x][y] === 2){
                this.f = 1;
                return false;
            }
            this.orderVisited.push([x, y])
            this.par[x][y] = this.g2s.par[x][y]
            goNext = true;
        }
        return goNext;
    }

    execute() {
        while (true) {
            if (!this.step())
                break;
        }
        this.orderVisited = this.orderVisited.reverse()
        this.orderVisited.pop()
        this.orderVisited.pop()
        return this;
    }
}

export default BidirectionalDijkstra;