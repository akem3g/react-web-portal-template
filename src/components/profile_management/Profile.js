import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';

import ResetPassword from './components/ResetPassword';
import UserDetail from './components/UserDetail';

const { Content, Sider } = Layout;

class Profile extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            required: ['admin-tasks'],
            allowed: [],
            permissions: [],
            menu_click: 1,
            page_title: '',
            page_description: '',
            page_breadcrumb_1: null,
            helmet: ''
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.toggleSideBar(true);
        this.props.toggleHeaderInfo(false);
    }

    menuSelected() {
        const { menu_click } = this.state;

        if (menu_click === 1) {
            return (
                <UserDetail />
            );
        }
        else if (menu_click === 2) {
            return (
                <ResetPassword />
            );
        }
    }

    render() {
        return (
            <div className="padding-30 padding-left-50 padding-right-50 padding-bottom-20">
                <Layout className="menu-layout">
                    <Sider width={260}>
                        <Menu
                            className="menu-height"
                            mode="inline"
                            defaultSelectedKeys={['1']}>
                            <Menu.Item key="1" onClick={() => this.setState({ menu_click: 1 })}><Icon type="user" />User Information</Menu.Item>
                            <Menu.Item key="2" onClick={() => this.setState({ menu_click: 2 })}><Icon type="key" />Reset Password</Menu.Item>
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

export default Profile;