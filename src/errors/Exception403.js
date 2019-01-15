import React, { Component } from 'react';

class Exception403 extends Component {
    render() {
        return (
            <div className="exception">
                <div className="img-block">
                    <div className="img-element img-error-403" />
                </div>
                <div className="content-error">
                    <h1 className="content-error-h1">403</h1>
                    <div className="content-error-desc">Sorry, you don't have access to this page!</div>
                </div>
            </div>
        );
    }
}

export default Exception403;