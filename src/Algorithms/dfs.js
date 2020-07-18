import glob from '../components/global.jsx'
import Algorithm from './algorithm.jsx'


class DFS extends Algorithm
{
    constructor(graph,neigh,heur,exec=true)
    {
        super(graph,neigh,heur);  //Fetching from parent class.

        //Intialisation of Parent , Visit.
        for(let i = 0 ; i < this.rows;i++)
        {
            this.par[i]=[]
            this.vis[i]=[]
            for(let j=0;j<this.cols;j++)
            {
                this.par[i][j]=[i,j]
                this.vis[i][j]=0
            }
        }
        this.stack=[]
        this.stack.unshift([this.beg, 0])
        //alert(this.stack[0])


        // In Iterative DFS , we use Stack - Pop & Push on top.
        this.vis[this.beg[0]][this.beg[1]]=1

        if(exec)
            return(this.execute());
    }

    // Returns a boolean function to the while loop.
    step()
    {
        if(this.stack.length===0 || this.f===1)
        {
            return(false)
        }

        let cur = this.stack.shift()
        this.orderVisited.push(cur[0])

        let x = cur[0][0]
        let y = cur[0][1]
        let d = cur[1]

        this.vis[x][y]=1

        if(x===this.end[0] && y===this.end[1])
        {
            this.f=1
            return(false)
        }

        let ngh = this.neighbours(x, y);
        for(let i = 0 ;i<ngh.length;i++)
        {
            let a = ngh[i][0]
            let b = ngh[i][1]
            if(this.isValid(a,b) && this.vis[a][b]===0 && this.status[a][b] !== glob.wallId)
            {
                this.par[a][b]=[x,y]
                this.stack.unshift([[a,b],d+1])
                this.vis[x][y]=2
            }
        }
        return(true)
    }
}


export default DFS;