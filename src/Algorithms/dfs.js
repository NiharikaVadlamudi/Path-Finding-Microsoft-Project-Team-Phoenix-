
// Depth First Search Implementation
// Source - https://www.geeksforgeeks.org/iterative-depth-first-traversal/

/*
    Pseudo-Code of DFS
    
    procedure DFS_iterative(G, v) is
    let S be a stack
    S.push(v)
    while S is not empty do
        v = S.pop()
        if v is not labeled as discovered then
            label v as discovered
            for all edges from v to w in G.adjacentEdges(v) do 
                S.push(w)
*/


/*
Stack in JS --> Array 
 * Insert : push()
 * Delete : pop()
 * Length : arr.length
*/

// Imports
import React, { Component } from 'react';
import glob from '../components/global.jsx';
import TinyQueue from 'tinyqueue';
import {euclideanMetric, manhattanMetric, vancouverMetric} from './metrics.js';



class DFS{

    constructor(graph,neigh,heur)
    {
      this.status = graph.gridState.status
      this.beg = graph.gridState.startLoc
      this.end = graph.gridState.targetLoc
      this.rows = this.status.length
      this.cols = this.status[0].length
      this.vis = []
      this.orderVisited=[]
      this.stack=[]
      this.flag=false
      this.metric=this.heur
      this.neigh=neigh

      // Stack definations
      this.stack=[]

      //Visited Status.

      for(let i = 0; i < this.rows; i++)
      {
        this.vis[i] = []
        for(let j = 0; j < this.cols; j++){
          this.vis[i][j] = 0;
        }
      }

      // Start Node , the values will change .
      this.stack.push([this.beg,0])
      //this.vis[this.beg[0]][this.beg[1]] = 1;

      return this.execute();
      
    }

    // Helper Functions
    isValid(x,y)
    {
    return x<this.rows && x>=0 && y<this.cols && y>=0
    }

    isWall(x,y)
    {
        return(this.status[x][y]==glob.wallId)
    }

    myNeighbours(x,y)
    {
        if(this.neigh==4)
        {
            return([ [x+1,y],[x-1,y],[x,y-1],[x,y+1]])
        
        }
        else
        {
            return([[x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y],[x-1,y+1],[x+1,y+1]])
        }
    }


    execute()
    {
        while(this.stack.length!==0 && this.flag==false)
        {
            let cur=this.stack.pop()
            console.log('CURR->',cur)
            let x=cur[0][0]
            let y=cur[0][1]
            let d=cur[1]

            this.orderVisited.push(cur[0])

            let ngh=this.myNeighbours(x,y)
            for(var i=0;i<ngh.length;i++)
            {
                let xc=ngh[i][0]
                let yc=ngh[i][1]
                if( this.vis[xc][yc]===0 && this.isValid(x,y) && !(this.isWall(x,y)))       
                {       
                   
                    if(xc==this.end[0] && yc==this.end[1])
                    {   
                        this.flag=true
                        break
                    }
                    else{
                        this.vis[xc][yc]=1
                        this.stack.push([[xc,yc],d+1])
                        this.orderVisited.push([xc,yc])
                    }
                }
            }
        }
        return(this)
    }
}
export default DFS;