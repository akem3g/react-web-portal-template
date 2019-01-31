import React, { Component } from 'react';

class UserDetail extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div>
                <h1>User Details</h1>
            </div>
        );
    }
}

export default UserDetail;