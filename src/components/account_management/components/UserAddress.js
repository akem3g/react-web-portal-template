import React, { Component } from 'react';

class UserAddress extends Component {
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
            <div></div>
        );
    }
}

export default UserAddress;