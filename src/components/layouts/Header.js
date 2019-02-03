import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Tooltip, Layout, Modal } from 'antd';

const confirm = Modal.confirm;

class Header extends Component {
    logout() {
        confirm({
            title: 'Confirm',
            content: 'Are you sure you want to log out?',
            onOk: () => {
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('name');
                this.forceUpdate();
            }
        });
    }

    render() {
        var user_name = sessionStorage.getItem('name');

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

                        <Tooltip title="Log Out">
                            <Icon
                                type="unlock"
                                twoToneColor="#eb2f96"
                                theme="twoTone"
                                className="padding-right-10 icon-header-16"
                                onClick={this.logout.bind(this)} />
                        </Tooltip>

                        <span className="text-bold">{user_name}</span>
                    </div>
                </div>
            </Layout.Header>
        );
    }
}

export default Header;