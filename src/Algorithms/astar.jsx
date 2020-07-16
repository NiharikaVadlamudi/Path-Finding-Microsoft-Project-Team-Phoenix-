import glob from '../components/global.jsx';
import PQ from './PQ.jsx';
import Algorithm from "./algorithm.jsx"

class Astar extends Algorithm {

  constructor(graph, neigh, heur, exec=true) {
    
    super(graph, neigh, heur);

    // setting up additional params and variables
    for (let i = 0; i < this.rows; i++) {
      this.par[i] = []
      this.vis[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.vis[i][j] = 0;
        this.par[i][j] = [i, j];
      }
    }
    this.que = new PQ(
      [[this.beg, [0, this.getHeuristic(this.beg)]]],
      this.compare
    )

    // run on creation
    if(exec)
      return this.execute();
  }

  getHeuristic = (a) => {
    // get estimated distance
    return this.metric(a, this.end);
  }

  getG(a) {
    // get A* heuristic value 
    // f = g + h
    return a[1][0] + a[1][1];
  }

  compare = (a, b) => {
    // compare function for queue ordering
    a = this.getG(a)
    b = this.getG(b)
    return a < b ? -1 : a > b ? 1 : 0;
  }

  step() {
    // one step of search
    if(this.que.length === 0 || this.f === 1)
      return false;

    let cur = this.que.pop()
    let x = cur[0][0]
    let y = cur[0][1]
    let d = cur[1][0]
    this.vis[x][y] = 2
    this.orderVisited.push(cur[0])
    if ((x) === this.end[0] && y === this.end[1]) {
      this.f = 1
      return false;
    }
    let neigh = this.neighbours(x, y);
    for (let i = 0; i < neigh.length; i++) {
      let a = neigh[i][0]
      let b = neigh[i][1]
      if (this.isValid(a, b) && this.vis[a][b] !== 2 && this.status[a][b] !== glob.wallId) {
        if (this.vis[a][b] === 0) {
          this.que.push([[a, b], [d + this.getActualDist([x, y], [a, b]), this.getHeuristic([a, b])]]);
          this.vis[a][b] = 1;
          this.par[a][b] = [x, y];
        }
        else {
          let ind = this.que.find([a, b]);
          let newg = d + this.getActualDist([x, y], [a, b])
          if (this.que.data[ind][1][0] > newg) {
            this.que.data[ind][1][0] = newg;
            this.que._up(ind);
            this.par[a][b] = [x, y]
          }
        }
      }
    }
    return true;
  }
}

export default Astar;
