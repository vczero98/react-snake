import React from 'react';

class Snake extends React.Component {
    render() {
        return (
            <div
                className={`snake ${this.props.direction}`}
                style={{
                    left: (this.props.x * 15),
                    top: (this.props.y * 15)
                }} >
                {this.props.head &&
                    <>
                        <div className="eye left" />
                        <div className="eye right" />
                    </>
                }
            </div>
        );
    }
}

export default Snake;