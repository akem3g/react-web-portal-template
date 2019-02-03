import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { getAccount } from '../../helpers/AccountController';

import ResetPassword from './components/ResetPassword';
import UserInformation from './components/UserInformation';
import ProfileImage from './components/ProfileImage';

const { Content, Sider } = Layout;

class Account extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            menu_click: '1',
            page_loading: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.toggleSideBar(true);
        this.props.pageTitle('Manage Account');
        this.props.pageDescription('You can update your details, upload a profile picture and reset your password here.');
        this.props.pageBreadCrumb1(null);
        this.props.pageHelmet('Manage Account');
        this.props.toggleHeaderInfo(true);

        this.account();
        this.resetPasswordParameter();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    account() {
        var access_token = sessionStorage.getItem('access_token');

        getAccount(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if (this._isMounted) this.setState({ user: result.data });
                }
            })
    }

    reloadUser() {
        this.account();
    }

    reloadUsername() {
        this.props.reloadUsername();
    }

    handleMenuClick(value) {
        if (this._isMounted) this.setState({ menu_click: value.key });
    }

    resetPasswordParameter() {
        const param = this.props.location.param;

        if (param === 'reset-password') {
            this.setState({ menu_click: '2' });
        }
    }

    menuSelected() {
        const { menu_click, user } = this.state;

        if (menu_click === '1') {
            return (
                <UserInformation user={user} reloadUser={this.reloadUser.bind(this)} reloadUsername={this.reloadUsername.bind(this)} />
            );
        }
        else if (menu_click === '2') {
            return (
                <ResetPassword />
            );
        }
        else if (menu_click === '3') {
            return (
                <ProfileImage user={user} reloadUser={this.reloadUser.bind(this)} />
            );
        }
    }

    render() {
        const param = this.props.location.param;

        return (
            <div className="padding-30 padding-left-50 padding-right-50 padding-bottom-20">
                <Layout className="menu-layout">
                    <Sider width={250}>
                        <Menu
                            className="menu-height"
                            mode="inline"
                            defaultSelectedKeys={param ? ['2'] : ['1']}>
                            <Menu.Item
                                key="1"
                                onClick={this.handleMenuClick.bind(this)}>
                                <Icon type="user" />User Information
                            </Menu.Item>

                            <Menu.Item
                                key="2"
                                onClick={this.handleMenuClick.bind(this)}>
                                <Icon type="tool" />Reset Password
                            </Menu.Item>

                            <Menu.Item
                                key="3"
                                onClick={this.handleMenuClick.bind(this)}>
                                <Icon type="picture" />Profile Image
                            </Menu.Item>
                        </Menu>
                    </Sider>

                    <Content className="menu-content">
                        {this.menuSelected()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default Account;