import React, { Component } from 'react';
import glob from '../components/global.jsx'

// import Grid from '../components/Grid.jsx'
class BFS {

  constructor(graph){
    this.status = graph.status
    this.beg = graph.beg
    this.end = graph.end
    this.rows = this.status.length
    this.cols = this.status[0].length
    this.vis = []

    for(let i = 0; i < this.rows; i++){
      this.vis[i] = []
      for(let j = 0; j < this.cols; j++){
        this.vis[i][j] = 0;
      }
    }
    this.f = 0;
    this.que = [[this.beg, 0]]
    this.orderVisted = [this.beg]
    this.vis[this.beg[0]][this.beg[1]] = 1;
    // this.prevd = -1
    // console.log(this.end);
    // this.execute();

    // return this.f, this.vis, this.orderVisted;
    return this.execute();
  }

  isValid(x, y){
    return x < this.rows && x >= 0 && y < this.cols && y >= 0;
  }

  execute(){


    while(this.que.length!== 0 && this.f !== 1)
    {
      let cur = this.que.shift()

      let x = cur[0][0]
      let y = cur[0][1]
      let d = cur[1]
      if(this.isValid(x+1, y) && this.vis[x+1][y] === 0 && this.status[x+1][y] !== glob.wallId){
        if((x+1) === this.end[0] && y === this.end[1])
        {
          this.f = 1
        }
        else{
          this.que.push([[x+1, y], d+1])
          this.orderVisted.push([x+1, y])
          this.vis[x+1][y] = 1;
        }

      }
      if(this.isValid(x-1, y) && this.vis[x-1][y] === 0 && this.status[x-1][y] !== glob.wallId){
        if((x-1) === this.end[0] && y === this.end[1])
        {
          this.f=1
        }
        else {
          this.que.push([[x-1, y], d+1])
          this.orderVisted.push([x-1, y])
          this.vis[x-1][y] = 1;

        }
      }
      if(this.isValid(x, y+1) && this.vis[x][y+1] === 0 && this.status[x][y+1] !== glob.wallId){
        if(x === this.end[0] && (y+1) === this.end[1])
        {
          this.f=1
        }
        else {

          this.que.push([[x, y+1], d+1])
          this.orderVisted.push([x, y+1])
          this.vis[x][y+1] = 1;
        }
      }
      if(this.isValid(x, y-1) && this.vis[x][y-1] === 0 && this.status[x][y-1] !== glob.wallId){
        if(x === this.end[0] && (y-1) === this.end[1])
        {
          this.f=1
        }
        else {
          this.que.push([[x, y-1], d+1])
          this.orderVisted.push([x, y-1])
          this.vis[x][y-1] = 1;

        }
      }

    }
    return this
  }

}

export default BFS;
