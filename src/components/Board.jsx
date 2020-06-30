import React, { Component } from 'react';

class Board extends Component {

    getTdClassName = (status) => {
        switch(status){
            case 0: return "empty";
            case 1: return "wall";
            case 2: return "start";
            case 3: return "target";
            default: break;
        }
    }

    getBoard = (rows, cols, status, clickFunc) => {
        const tr = [];
        // console.log(status[0][0])
        for (let r = 0; r < rows; r++) {
            const td = [];
            for (let c = 0; c < cols; c++) {
                td.push(
                    <td
                        key={`${r}, ${c}`}
                        className={this.getTdClassName(status[r][c])}
                        onMouseOver={() => {return this.props.isMouseDown ? clickFunc(r, c) : false}}
                        onMouseDown={() => {clickFunc(r, c)}}
                    />
                )
            }
            tr.push(<tr key={r}>{td}</tr>);
        }
        return (
            <div className="container shadow-lg p-3 mb-5 rounded">
                <div className="row justify-content-md-cente">
                    <div className="col-sm-12">
                        <table className="table table-bordered table-dark" width="100%">
                            <tbody>{tr}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    render() {

        const { rows, cols, status, clickFunc } = this.props;

        return (
            this.getBoard(rows, cols, status, clickFunc)
        );
    }
}

export default Board;
