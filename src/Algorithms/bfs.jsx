import glob from '../components/global.jsx'
import TinyQueue from 'tinyqueue';
import Algorithm from './algorithm.jsx'

class BFS extends Algorithm{

  constructor(graph, neigh, heur, exec=true) {

    super(graph, neigh, heur);

    // setting up additional params and variables
    for (let i = 0; i < this.rows; i++) {
      this.par[i] = []
      this.vis[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.vis[i][j] = 0;
        this.par[i][j] = [i, j]
      }
    }
    this.que = new TinyQueue(
      [[this.beg, 0]],
      this.compare
    )
    this.vis[this.beg[0]][this.beg[1]] = 1;

    // run on creation
    if(exec)
      return this.execute();
  }

  compare = (a, b) => {
    // compare function for queue ordering
    a = a[1]
    b = b[1]
    return a < b ? -1 : a > b ? 1 : 0;
  }

  step() {
    // one step of search
    if(this.que.length === 0 || this.f === 1){
      return false;
    }
    let cur = this.que.pop()
    this.orderVisited.push(cur[0])
    let x = cur[0][0]
    let y = cur[0][1]
    let d = cur[1] 
    this.vis[x][y] = 2
    if (x === this.end[0] && y === this.end[1]) {
      this.f = 1
      return false;
    }
    let neigh = this.neighbours(x, y);
    for (let i = 0; i < neigh.length; i++) {
      let a = neigh[i][0]
      let b = neigh[i][1]
      if (this.isValid(a, b) && this.vis[a][b] === 0 && this.status[a][b] !== glob.wallId) {
        this.par[a][b] = [x, y]
        this.que.push([[a, b], d + 1])
        this.vis[a][b] = 1;
      
      }
    }
    return true
  }

}

export default BFS;
