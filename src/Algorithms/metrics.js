import React from 'react'
import ReactDOM from 'react-dom'

/*
 * Implementation of all distance metrics that will be useful for alogorithms.
 1.Euclidien Distance
 2.Manhattan Distance
 3.Vancuver Distance (Hexagonal)
 4.Octile Distance
 5.Chebychev Distance
*/


// Euclidean Distance

export function euclideanMetric(a, b)
{
    const dist = Math.pow((a[0]-b[0]),2) + Math.pow((a[1]-b[1]),2)
    return(dist)
}



// Manhattan Distance
export function manhattanMetric(a, b, D=1)
{
    const dist=Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1])
    return(D*dist)
}

// Chebychev Distance

export function chebychevMetric(a, b,D1=1,D2=1)
{
    const dx=Math.abs(a[0]-b[0])
    const dy=Math.abs(a[1]-b[1])
    return ( D1*(dx+dy) + (D2-2*D1)*(Math.min(dx,dy)) )
}


// Octile Distance

export function octileMetric(x1,y1,x2,y2,D1=1,D2=Math.sqrt(2))
{
    const dx=Math.abs(x1-x2)
    const dy=Math.abs(y1-y2)
    return ( D1*(dx+dy) + (D2-2*D1)*(Math.min(dx,dy)) )
}

// Vancouver Distance
export function vancouverMetric(x1,y1,x2,y2)
{
    var x = Math.abs(x1-x2)
    var y = Math.abs(y1-y2)
    var correction=0;

    if(x%2!=0)
    {
        if(y1<y2)
        {
        correction=x1%2
        }
        else
        {
            correction=x2%2
        }
    }
    else{
        correction=0
    }
    var vdistance= Math.max(0,y-Math.floor(x/2)+x-correction)
    return(vdistance)
}

// EOD (More metrics will be added )
