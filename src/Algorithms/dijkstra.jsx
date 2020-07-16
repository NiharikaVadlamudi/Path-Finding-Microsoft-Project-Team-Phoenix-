import glob from '../components/global.jsx';
import TinyQueue from 'tinyqueue';
import Algorithm from './algorithm.jsx';

class Dijkstra extends Algorithm{
  constructor(graph, neigh, heur, exec=true) {

    super(graph, neigh, heur);

    // setting up additional params and variables
    this.dist = []
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

    // run on creation
    if(exec)
      return this.execute();
  }

  compare(a, b){
    // compare function for queue ordering
    if(a[1] === Infinity && b[1] === Infinity)
      return 0;
    return a[1] - b[1];
  }

  step(){
    // one step of search

    if(this.que.length === 0 || this.f === 1)
      return false;
    let cur = this.que.pop();
    let x = cur[0][0];
    let y = cur[0][1];
    let d = cur[1];
    if(d === Infinity)
      return false;
    if(this.vis[x][y] === 1)
      return true;
    this.dist[x][y] = d;
    this.vis[x][y] = 2;
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

}

export default Dijkstra



