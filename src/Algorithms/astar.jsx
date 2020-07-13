import React, { Component } from 'react';
import glob from '../components/global.jsx';
import PQ from './PQ.jsx';
import { euclideanMetric, manhattanMetric, vancouverMetric } from './metrics.js';


class Astar {

  constructor(graph, neigh, heur, exec=true) {
    this.status = graph.gridState.status
    this.beg = graph.gridState.startLoc
    this.end = graph.gridState.targetLoc
    this.rows = this.status.length
    this.cols = this.status[0].length
    this.vis = []
    this.par = []
    this.metric = this.chooseHeuristic(heur)

    for (let i = 0; i < this.rows; i++) {
      this.par[i] = []
      this.vis[i] = []
      for (let j = 0; j < this.cols; j++) {
        this.vis[i][j] = 0;
        this.par[i][j] = [i, j];
      }
    }
    this.f = 0;
    this.que = new PQ(
      [[this.beg, [0, this.getHeuristic(this.beg)]]],
      this.compare
    )
    this.neigh = neigh
    this.orderVisited = []

    if(exec)
      return this.execute();
  }

  chooseHeuristic(heur) {
    switch (heur) {
      case glob.ManhattanId: return manhattanMetric;
      case glob.EuclideanId: return euclideanMetric;
      case glob.VancouverId: return vancouverMetric;
      default: break;
    }
  }

  getActualDist(par, neigh) {
    // return manhattanMetric(par, neigh);
    return 1;
  }

  getHeuristic = (a) => {
    return this.metric(a, this.end);
  }

  getG(a) {
    return a[1][0] + a[1][1];
  }

  compare = (a, b) => {
    a = this.getG(a)
    b = this.getG(b)
    return a < b ? -1 : a > b ? 1 : 0;
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

  step() {
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

  execute() {

    while (true) {
      if (!this.step())
        break;
    }
    this.orderVisited.pop()
    this.orderVisited = this.orderVisited.reverse()
    this.orderVisited.pop()
    return this
  }

}

export default Astar;
