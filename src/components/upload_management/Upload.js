import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
// import { checkAccess } from '../../helpers/PermissionController';
// import Exception403 from '../../errors/Exception403';

import Photo from './components/Photo';
import Excel from './components/Excel';

const { Content, Sider } = Layout;

class Upload extends Component {
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
        this._isMounted = true;
        this.props.toggleSideBar(true);
        this.props.pageTitle('Upload');
        this.props.pageDescription('Here is the example of upload photos and excel files using Ant Design.');
        this.props.pageBreadCrumb1(null);
        this.props.pageHelmet('Manage Upload');
        this.props.toggleHeaderInfo(true);
    }

    menuSelected() {
        const { menu_click } = this.state;
        
        if (menu_click === 1) {
            return (
                <Photo />
            );
        }
        else if (menu_click === 2) {
            return (
                <Excel />
            );
        }
    }

    render() {
        return (
            <div className="padding-30 padding-left-50 padding-right-50 padding-bottom-20">
                <Layout className="menu-layout">
                    <Sider width={200}>
                        <Menu
                            className="menu-height"
                            mode="inline"
                            defaultSelectedKeys={['1']}>
                            <Menu.Item key="1" onClick={() => this.setState({ menu_click: 1 })}>Photos</Menu.Item>
                            <Menu.Item key="2" onClick={() => this.setState({ menu_click: 2 })}>Excel Files</Menu.Item>
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

export default Upload;