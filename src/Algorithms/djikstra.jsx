import React, { Component } from 'react';
import glob from '../components/global.jsx';

class Dijkstra{
    constructor(graph, neigh, heur){
        this.status = graph.gridState.status
        this.beg = graph.gridState.startLoc
        this.end = graph.gridState.targetLoc
        this.rows = this.status.length
        this.cols = this.status[0].length
        this.vis = []

        this.status[this.beg[0]][this.beg[1]] = 0;

        for(let i = 0; i < this.rows; i++){
            this.vis[i] = [];
            for(let j = 0; j < this.cols; j++){
                this.vis[i][j] = 0;
                if(i !== this.beg[0] && j !== this.beg[1] && this.status[i][j] !== glob.wallId && this.status[i][j] !== glob.weightId){
                    return this.status[i][j] = Infinity;
                }

            }
        }
        this.neigh = neigh;
        this.f = 0;
        this.que = [[this.beg, 0]];
        this.orderVisited = [];
        

        return this.execute();
    }


    isValid(x, y){
    return x < this.rows && x >= 0 && y < this.cols && y >= 0;
  }

    neighbours(x, y){
        if(this.neigh === 4)
            return [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
        else
            return [[x+1, y], [x-1, y], [x, y+1], [x, y-1], [x+1, y+1], [x+1, y-1], [x-1, y+1], [x-1, y-1]];
        }
   

        
  execute(){

    while (this.que.length!== 0 && this.f !== 1) {
        let cur = this.que.pop()
        this.orderVisited.push(cur[0])
        let x = cur[0][0]
        let y = cur[0][1]
        let d = cur[1]
        let w = glob.weightId;
        let neigh = this.neighbours(x, y);
        let a = neigh[0][0];
        let b = neigh[0][1];
        let count =0;
        for (let i = 0; i < neigh.length; i++) {
            let a = neigh[i][0];
            let b = neigh[i][1];
            
          if (this.isValid(a, b) && this.status[a][b] !== glob.wallId ) {
              if(a === this.end[0] && b === this.end[1])
                {
                  this.f = 1
                  break;}
              else{
                  if(this.status[a][b] !== Infinity){
                    
                    this.que.push([[a, b], d + w]);
                    this.vis[a][b] = 1;
                    this.status[a][b] = d + w;
                    break;
              }
              else{
                    count = count + 1;
                    if(count === neigh.length -1){
                        this.que.push([[a,b], d+1]);
                        this.vis[a][b] = 1;
                        this.status[a][b] = d+1;
                    }
                    
              }
            }
        }
    }
    
}
  return this;
}
}
