import glob from "../components/global.jsx"
import { euclideanMetric, manhattanMetric, vancouverMetric } from './metrics.js';

class Algorithm {

    constructor(graph, neigh, heur) {
        // setting up some parameters and variables
        this.status = graph.gridState.status
        this.beg = graph.gridState.startLoc
        this.end = graph.gridState.targetLoc
        this.rows = this.status.length
        this.cols = this.status[0].length
        this.vis = []
        this.par = []
        this.metric = this.chooseHeuristic(heur)
        this.neigh = neigh
        this.f = 0;
        this.orderVisited = []
        this.path = []
        this.timeTaken = 0
    }

    getActualDist(par, cur) {
        // get distance between neighbours
        return this.status[cur[0]][cur[1]] === glob.weightId ? glob.weightVal : glob.normalVal;
    }

    chooseHeuristic(heur) {
        // set up metric for distance estimation
        switch (heur) {
            case glob.ManhattanId: return manhattanMetric;
            case glob.EuclideanId: return euclideanMetric;
            case glob.VancouverId: return vancouverMetric;
            default: break;
        }
    }

    isValid(x, y) {
        // check out of bounds
        return x < this.rows && x >= 0 && y < this.cols && y >= 0;
    }

    neighbours(x, y) {
        // return list of neighbours
        if (this.neigh == 4)
            return [[x - 1, y], [x, y - 1], [x, y + 1], [x + 1, y]];
        else
            return [[x - 1, y - 1], [x - 1, y], [x, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x, y + 1], [x + 1, y], [x + 1, y + 1]];
    }

    getPath() {
        // failure case
        if (this.f !== 1)
            return;

        // backtracking to find the path
        let newx, x = this.end[0]
        let y = this.end[1]
        while (this.par[x][y][0] !== x || this.par[x][y][1] !== y) {
            this.path.push(this.par[x][y])
            newx = this.par[x][y][0]
            y = this.par[x][y][1]
            x = newx
        }
        this.path.pop()
    }

    execute() {

        // loop to find target
        this.timeTaken = (new Date()).getTime();
        while (true) {
            if (!this.step())
                break;
        }
        // remove begin and target from list as they dont have to be marked and set time
        if(this.f === 1){
            this.orderVisited.pop()
            this.timeTaken = (new Date()).getTime() - this.timeTaken;
        }
        else{
            this.timeTaken = Infinity
        }
        this.orderVisited = this.orderVisited.reverse()
        this.orderVisited.pop()
        
        // find the path
        this.getPath()
        
        return this
    }

}

export default Algorithm