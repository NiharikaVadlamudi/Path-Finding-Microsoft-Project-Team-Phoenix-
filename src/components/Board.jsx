import React, { Component } from 'react';

class Board extends Component {

    getBoard = (rows, cols, status, clickFunc) => {
        const tr = [];
        console.log(status[0][0])
        for (let r = 0; r < rows; r++) {
            const td = [];
            for (let c = 0; c < cols; c++) {
                td.push(
                    <td
                        key={`${r}, ${c}`}
                        className={status[r][c]? "wallOn" : "empty"}
                        onMouseOver={() => clickFunc(r, c, true)}
                        onMouseDown={() => clickFunc(r, c, false)}
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