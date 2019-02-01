import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';

import ResetPassword from './components/ResetPassword';
import UserDetail from './components/UserDetail';

const { Content, Sider } = Layout;

class Account extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            menu_click: '1'
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
    }

    handleMenuClick(value) {
        this.setState({ menu_click: value.key });
    }

    menuSelected() {
        const { menu_click } = this.state;

        if (menu_click === '1') {
            return (
                <UserDetail />
            );
        }
        else if (menu_click === '2') {
            return (
                <ResetPassword />
            );
        }
    }

    render() {
        return (
            <div className="padding-30 padding-left-50 padding-right-50 padding-bottom-20">
                <Layout className="menu-layout">
                    <Sider width={250}>
                        <Menu
                            className="menu-height"
                            mode="inline"
                            defaultSelectedKeys={['1']}>
                            <Menu.Item
                                key="1"
                                onClick={this.handleMenuClick.bind(this)}>
                                <Icon type="user" />User Information
                            </Menu.Item>

                            <Menu.Item
                                key="2"
                                onClick={this.handleMenuClick.bind(this)}>
                                <Icon type="key" />Reset Password
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