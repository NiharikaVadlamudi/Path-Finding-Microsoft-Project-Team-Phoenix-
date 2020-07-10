// A*-Implementation - Niharika 
// Resource : https://en.wikipedia.org/wiki/A*_search_algorithm


// Imports s
import React, { Component } from 'react';
import glob from '../components/global.jsx';
import TinyQueue from 'tinyqueue';
import * from './metrics.js'

// Global Declarations
const inf=Infinity
class Astar{
    // Basic Constructor (Properties from graph class
    constructor(graph, neigh, heur)
    {
        this.status=graph.gridState.status
        this.beg=grid.gridState.startLoc
        this.end=grid.gridState.targetLoc
        this.rows = this.status.length
        this.cols = this.status[0].length
        this.vis = []
        this.metric = this.chooseHeuristic(heur)
        console.log(heur, this.metric)
        

        // Additional Params.
        this.score=[]
        this.parent=[]

        // Intiaisation of Visited Status.
        for(var i=0;i<this.rows;i++)
        {   
            this.vis[i]=[]
            for(var j=0;j<this.cols;j++)
            {
                this.vis[i][j]=0;
            }
        }

        //Initialisation of Score Maps( f & h)
        for(var i = 0 ; i < this.rows;i++)
        {
            this.val[i]=[]
            for(var j=0;j<this.cols;j++)
            {
                this.score[i][j]=[inf,this.metric(i,j,this.end[0],this.end[1])]
            }
        }

        // Start Node specifics
        this.score[this.beg[0]][this.beg[1]][0]=0
        this.vis[this.beg[0]][this.beg[1]]=1

        // Other params.
        this.flag=false //Detects if the goal is reached.
        
        // Prioty Queue (TinyQueue Module)
        this.que= new TinyQueue (
            [[this.beg,[this.score[this.beg[0]][this.beg[1]]]]],
            this.compare
        )
        // Stores the entire set of visited arrays.
        this.orderVisited=[]

        return this.execute();
    }
    
    // All helper functions .
    chooseHeuristic(heur){
    switch(heur){
      case glob.ManhattanId: return manhattanMetric;
      case glob.EuclideanId: return euclideanMetric;
      case glob.VancouverId: return vancouverMetric;
      default: break;
    }
  }


    compare(a,b)
    {
        let aSum=a[1][0] + a[1][1]
        let bSum=b[1][0]+b[1][1]
        return (asum < bsum) ? -1 : (asum > bsum)? 1 : 0;
    }

    isWall(x,y)
    {
        return(this.status[x][y]==glob.wallId)
    }

    isValid(x,y)
    {
        return x < this.rows && x >= 0 && y < this.cols && y >= 0 ;
    }

    myNeighbours(x,y,type='four')
    {
        if(type=='four')
            return([ [x+1,y],[x-1,y],[x,y-1],[x,y+1] ])
        else
            return([ [x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y],[x-1,y+1],[x+1,y+1]])
    }

    execute()
    {
        while(this.que.length!=0 && !this.flag)
        {
            let curr=this.que.pop()
            this.orderVisited.push(cur[0])

            // Co-ordinates 
            let x = cur[0][0]
            let y = cur[0][1]

            // Scores
            let gcur=cur[1][0]
            let hcur=cur[1][1]
            let fcur=gcur+hcur

            //Neighbours
            let neigh=this.myNeighbours(x,y)

            // Iterating through the nghs

            for(let i=0;i<neigh.length;i++)
            {   
                //Parameters of neighbours
                let a =neigh[i][0][0]
                let b =neigh[i][0][1]
                let gScore=this.score[a][b][0]
                let hScore=this.score[a][b][1]

                // Check for validity of node & its status .
                if( this.isValid(a,b) && this.vis[a][b]==0 && !(this.isWall(a,b)))
                {
                    if(a==this.end[0] && b==this.end[1])
                    {
                        this.flag=true
                        break
                    }
                }

                else
                {
                    var gscoreTent=gcur + this.metric(x,y,a,b)
                    if(gscoreTent<gScore)
                    {
                        this.orderVisited.push([a,b])
                        this.vis[a][b]=1
                        this.parent.push([x,y])
                        this.score[a][b][0]=gscoreTent
                        this.score[a][b][1]=this.metric(a,b,this.end[0],this.end[1])

                        if(this.orderVisited.includes([a,b])==false)
                        {
                            this.orderVisited.push([a,b])
                        }
                    }

                }
            }
        }
        return(this);
    }
}

export default Astar;


