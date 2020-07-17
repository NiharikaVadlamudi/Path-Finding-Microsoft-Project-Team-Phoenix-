class BidirectionalAlgorithm {

    constructor(graph, neight, heur) {

        // setting up some params and variables
        this.status = graph.gridState.status
        this.beg = graph.gridState.startLoc
        this.end = graph.gridState.targetLoc
        this.rows = this.status.length
        this.cols = this.status[0].length
        
        this.par = []
        for (let i = 0; i < this.rows; i++) {
            this.par[i] = []
            for (let j = 0; j < this.cols; j++) {
                this.par[i][j] = [i, j]
            }
        }
        
        this.f = 0;
        this.orderVisited = []
        this.path = []
        this.meetingPoint = undefined
        this.timeTaken = 0; 
    }

    getPath() {
        console.log(this.meetingPoint, this.f)
        // failure case
        if (this.f !== 1)
            return;

        // backtracking meeting point to goal way
        let newx, x = this.meetingPoint[0]
        let y = this.meetingPoint[1]
        let path_temp = []
        while (this.g2s.par[x][y][0] !== x || this.g2s.par[x][y][1] !== y) {
            path_temp.push([x, y])
            newx = this.g2s.par[x][y][0]
            y = this.g2s.par[x][y][1]
            x = newx
        }
        path_temp = path_temp.reverse();
        this.path = this.path.concat(path_temp)

        // backtracking meeting point to source way
        x = this.meetingPoint[0]
        y = this.meetingPoint[1]
        path_temp = []
        while (this.s2g.par[x][y][0] !== x || this.s2g.par[x][y][1] !== y) {
            path_temp.push(this.s2g.par[x][y])
            newx = this.s2g.par[x][y][0]
            y = this.s2g.par[x][y][1]
            x = newx
        }
        path_temp.pop()
        this.path = this.path.concat(path_temp)

    }

    step() {
        // one step of search
        let x, y, goNext;
        goNext = false;
        if (this.s2g.step() || this.s2g.f) {
            x = this.s2g.orderVisited[this.s2g.orderVisited.length - 1][0]
            y = this.s2g.orderVisited[this.s2g.orderVisited.length - 1][1]
            if (this.g2s.vis[x][y] === 2) {
                this.f = 1;
                this.meetingPoint = [x, y]
                return false;
            }
            this.orderVisited.push([x, y])
            this.par[x][y] = this.s2g.par[x][y]
            goNext = true;
        }
        if (this.g2s.step() || this.g2s.f) {
            x = this.g2s.orderVisited[this.g2s.orderVisited.length - 1][0]
            y = this.g2s.orderVisited[this.g2s.orderVisited.length - 1][1]
            if (this.s2g.vis[x][y] === 2) {
                this.f = 1;
                this.meetingPoint = [x, y]
                return false;
            }
            this.orderVisited.push([x, y])
            this.par[x][y] = this.g2s.par[x][y]
            goNext = true;
        }
        return goNext;
    }

    execute() {

        // loop to find target
        this.timeTaken = (new Date()).getTime();
        while (true) {
            if (!this.step())
                break;
        }

        // set time
        if(this.f === 1)
            this.timeTaken = (new Date()).getTime() - this.timeTaken;
        else
            this.timeTaken = Infinity

        // remove begin and target from list as they dont have to be marked
        this.orderVisited = this.orderVisited.reverse()
        this.orderVisited.pop()
        this.orderVisited.pop()

        // find the path
        this.getPath()
        return this;
    }
}

export default BidirectionalAlgorithm