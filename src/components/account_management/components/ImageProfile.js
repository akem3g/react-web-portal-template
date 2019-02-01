import React, { Component } from 'react';
import { Form, Modal } from 'antd';

class ImageProfile extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loading: false
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
        )
    }
}

export default ImageProfile;