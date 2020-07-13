import glob from '../components/global.jsx';
import TinyQueue from 'tinyqueue';

class Dijkstra {
  constructor(graph, neigh, heur, exec=true) {
    this.status = graph.gridState.status
    this.beg = graph.gridState.startLoc
    this.end = graph.gridState.targetLoc
    this.rows = this.status.length
    this.cols = this.status[0].length
    this.dist = []
    this.vis = []
    this.par = []
    this.que = new TinyQueue([], this.compare)

    for (let i = 0; i < this.rows; i++) {
      this.dist[i] = []
      this.vis[i] = []
      this.par[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.vis[i][j] = 0;
        this.par[i][j] = [i, j]
        if(i == this.beg[0] && j == this.beg[1]){
          this.dist[i][j] = 0;
          this.que.push([[i, j], 0]);
        }
        else{
          this.dist[i][j] = Infinity;
          this.que.push([[i, j], Infinity]);
        }
      }
    }
    this.neigh = neigh;
    this.f = 0;
    this.orderVisited = [];
    if(exec)
      return this.execute();
  }

  compare(a, b){
    if(a[1] === Infinity && b[1] === Infinity)
      return 0;
    return a[1] - b[1];
  }

  isValid(x, y) {
    return x < this.rows && x >= 0 && y < this.cols && y >= 0;
  }

  neighbours(x, y) {
    if (this.neigh == 4)
      return [[x - 1, y], [x, y - 1], [x, y + 1], [x + 1, y]];
    else
      return [[x - 1, y - 1], [x - 1, y], [x, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x, y + 1], [x + 1, y], [x + 1, y + 1]];
  }

  getActualDist(par, cur){
    return 1;
  }

  step(){
    if(this.que.length === 0 || this.f === 1)
      return false;
    let cur = this.que.pop();
    console.log(cur)
    let x = cur[0][0];
    let y = cur[0][1];
    let d = cur[1];
    if(d === Infinity)
      return false;
    if(this.vis[x][y] === 1)
      return true;
    this.dist[x][y] = d;
    this.vis[x][y] = 1;
    this.orderVisited.push([x, y]);
    if(x === this.end[0] && y === this.end[1]){
      this.f = 1;
      return false;
    }
    let neigh = this.neighbours(x, y)
    for(let i = 0; i < neigh.length; i++){
      let a = neigh[i][0]
      let b = neigh[i][1]
      if(this.isValid(a, b) && this.status[a][b] !== glob.wallButtonId){
        let newd = d + this.getActualDist([x, y], [a, b]);
        if(this.dist[a][b] > newd){
          this.dist[a][b] = newd;
          this.par[a][b] = [x, y]
          this.que.push([[a, b], newd])
        }
      }
    }
    return true;
  }

  execute() {
    while (true) {
      if(!this.step())
        break;
    }
    this.orderVisited.pop();
    this.orderVisited = this.orderVisited.reverse()
    this.orderVisited.pop();
    return this;
  }
}

export default Dijkstra



