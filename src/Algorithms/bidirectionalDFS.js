// Bidirectional BFS 
// Source : GFG

import React, { Component } from 'react';
import glob from '../components/global.jsx'
import TinyQueue from 'tinyqueue';
//import {euclideanMetric, manhattanMetric, vancouverMetric} from './metrics.js';

class BidirectionalDFS{

  constructor(graph, neigh, heur){
    this.status = graph.gridState.status
    this.beg = graph.gridState.startLoc
    this.end = graph.gridState.targetLoc
    this.rows = this.status.length
    this.cols = this.status[0].length
    this.neigh = neigh
    this.flag=false
    // Important params.

    this.interNode=[]
    this.orderVisited = []

    //Seperate ordered list for now .
    this.startOrdered=[]
    this.endOrdered=[]

    // Two Queues for beg,end nodes 
    // We dont'need PQ here..we just need a queue .
    this.startQ=[[this.beg, 0]]
    
    this.endQ=[[this.end, 0]]
    

    // Initialising Visited Grid for each seperately.
    this.startVis=[]
    this.endVis=[]

    for(let i = 0; i < this.rows; i++){
      this.startVis[i] = []
      for(let j = 0; j < this.cols; j++){
        this.startVis[i][j] = 0;
      }
    }


    for(let i = 0; i < this.rows; i++){
        this.endVis[i] = []
        for(let j = 0; j < this.cols; j++){
          this.endVis[i][j] = 0;
        }
    }

    this.startVis[this.beg[0]][this.beg[1]]=1
    this.endVis[this.end[0]][this.end[1]]=1

    return this.execute();
  }

  // Regular Functions 

  isWall(x,y)
  {
      return(this.status[x][y]!== glob.wallId)
  }

  isValid(x, y){
    return x < this.rows && x >= 0 && y < this.cols && y >= 0;
  }

  neighbours(x, y)
  {
    if(this.neigh === 4)
      return [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
    else
      return [[x+1, y], [x-1, y], [x, y+1], [x, y-1], [x+1, y+1], [x+1, y-1], [x-1, y+1], [x-1, y-1]];
  }

  checkIntersectionNode()
  {    
      // Traverse both the lis ts
    for(let i = 0 ; i < this.rows ;i++)
    {
        for(let j=0;j<this.cols;j++)
        {
            if(this.startVis[i][j]==1 && this.endVis[i][j]==1  && this.isValid(i,j) && this.isWall(i,j))
            {
                this.interNode[0]=i
                this.interNode[1]=j
            }
        }
    }
  }


dfs(stack,vis,path)
{   
    let cur = stack.shift() // On front deletion
    
    let x = cur[0][0]
    let y = cur[0][1]
    let d = cur[1]

    path.push([x,y])
    
    let ngh=this.neighbours(x,y)

    for(var i=0;i<ngh.length;i++)
    {
        var xn=ngh[i][0]
        var yn=ngh[i][1]
        if(this.isValid(xn,yn) && this.isWall(xn,yn) && vis[xn][yn]==0)
        {
            vis[xn][yn]=1
            path.push([xn,yn])
            stack.unshift([[xn,yn],d+1])
        }
    }
    // Umm,I need  not returning this.
}

// Main Bidrectional function..
execute()
{
    while( this.startQ.length!==0 &&  this.endQ.length!==0 && this.flag===false)
    {   
        // Apply for start Path
        this.dfs(this.startQ,this.startVis,this.startOrdered)
        // Apply for end Path
        this.dfs(this.endQ,this.endVis,this.endOrdered)

        // Keep checking for intersection node .
        this.checkIntersectionNode()
        //console.log('INTERNODE:',this.interNode)

        //this.orderVisited=this.endOrdered

        if(this.interNode[0]>=0 && this.interNode[1]>=0 && this.isValid(this.interNode[0],this.interNode[1])) // Then node is found.
        {
            //console.log('End Point!',this.interNode)
            this.endOrdered.shift()
            this.orderVisited=this.startOrdered.concat(this.endOrdered)
            this.flag=true
            break // break the damn while loop
        }
    }
    return(this);
}
}
export default BidirectionalDFS;