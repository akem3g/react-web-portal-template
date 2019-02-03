import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Tooltip, Layout } from 'antd';
import { getAccount } from '../../helpers/AccountController';
import PageDrawer from './PageDrawer';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            drawer: false
        };
    }

    componentDidMount() {
        var access_token = sessionStorage.getItem('access_token');

        if (access_token) {
            this.account();
        }
    }

    account() {
        var access_token = sessionStorage.getItem('access_token');
        getAccount(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    this.setState({ user: result.data });
                }
            })
    }
    
    logout() {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('name');
    }

    openDrawer() {
        this.setState({ drawer: true });
    }
    
    closeDrawer() {
        this.setState({ drawer: false });

    }

    render() {
        const { user, drawer } = this.state;

        const resetPassword = {
            pathname: "/account", 
            param: "reset-password" 
        };
        
        return (
            <Layout.Header className="header-white">
                <div className="header-width">
                    <div className="float-right">
                        <Tooltip title="Reset Password">
                            <Link to={resetPassword}>
                                <Icon
                                    type="safety-certificate"
                                    twoToneColor="#eb2f96"
                                    theme="twoTone"
                                    className="padding-right-10 icon-header-16" />
                            </Link>
                        </Tooltip>

                        <Tooltip title="Account">
                            <Link to="/account">
                                <Icon
                                    type="smile"
                                    twoToneColor="#eb2f96"
                                    theme="twoTone"
                                    className="padding-right-10 icon-header-16" />
                            </Link>
                        </Tooltip>

                        <Tooltip title="Account Overview">
                            <Icon
                                type="idcard"
                                twoToneColor="#eb2f96"
                                theme="twoTone"
                                className="padding-right-10 icon-header-16 trigger"
                                onClick={this.openDrawer.bind(this)} />
                        </Tooltip>

                        <Tooltip title="Log Out">
                            <Link to="/">
                                <Icon
                                    type="unlock"
                                    twoToneColor="#eb2f96"
                                    theme="twoTone"
                                    className="padding-right-10 icon-header-16"
                                    onClick={this.logout.bind(this)} />
                            </Link>
                        </Tooltip>

                        <span className="text-bold">{user.name}</span>
                    </div>
                </div>

                <PageDrawer openDrawer={drawer} closeDrawer={this.closeDrawer.bind(this)} />
            </Layout.Header>
        );
    }
}

export default Header;