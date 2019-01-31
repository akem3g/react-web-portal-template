import React, { Component } from 'react';
import { Layout, Menu } from 'antd';

class UserDetail extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            required: ['admin-tasks'],
            allowed: [],
            permissions: [],
            menu_click: 1
        }
    }

    componentDidMount() {
        // this.props.pageTitle('User Details');
        // this.props.pageDescription('Update your details here.');
        // this.props.pageBreadCrumb1(null);
        // this.props.pageHelmet('Profile - User Details');
    }

    render() {
        return (
            <div>test</div>
        );
    }
}

export default UserDetail;