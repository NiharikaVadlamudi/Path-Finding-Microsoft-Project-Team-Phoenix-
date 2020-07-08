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

function euclideanMetric(a, b)
{
    const dist = Math.pow((a[0]-b[0]),2) + Math.pow((a[1]-b[1]),2)
    return(dist)
}



// Manhattan Distance
function manhattanMetric(x1,y1,x2,y2,D=1)
{
    const dist=Math.abs(x1-x2) + Math.abs(y1-y2)
    return(D*dist)
}

// Chebychev Distance 

function chebychevMetric(x1,y1,x2,y2,D1=1,D2=1)
{
    const dx=Math.abs(x1-x2)
    const dy=Math.abs(y1-y2)
    return ( D1*(dx+dy) + (D2-2*D1)*(Math.min(dx,dy)) )
}


// Octile Distance 

function octileMetric(x1,y1,x2,y2,D1=1,D2=Math.sqrt(2))
{
    const dx=Math.abs(x1-x2)
    const dy=Math.abs(y1-y2)
    return ( D1*(dx+dy) + (D2-2*D1)*(Math.min(dx,dy)) )
}

// Vancouver Distance 
function vancouver(x1,y1,x2,y2)
{
    const x = Math.abs(x1,x2)
    const y = Math.abs(y1,y2)
    const correction=0;

    if(x%2!=0)
    {
        correction=(y1<y2)?(x1%2):(x2%2)
    }
    else
    {
        correction=0;
    }
    return ( Math.max(0,y-Math.floor(x/2)) + x - correction )

}

// EOD (More metrics will be added )

export default euclideanMetric