import TinyQueue from 'tinyqueue';

class PQ extends TinyQueue {
    find(key){
        for(let i = 0; i < this.data.length; i++){
            if(this.data[i][0][0] == key[0] && this.data[i][0][1] == key[1])
                return i;
        }
        return -1;
    }
}

export default PQ;