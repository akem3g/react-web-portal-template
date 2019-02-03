import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { showSideBarMenu } from '../../helpers/AdminController';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: []
        }
    }

    componentDidMount() {
        this._isMounted = true;
        var access_token = sessionStorage.getItem('access_token');

        if (access_token) {
            this.fetchSideBarMenu();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchSideBarMenu() {
        var access_token = sessionStorage.getItem('access_token');

        showSideBarMenu(access_token)
            .then(result => {
                if (this._isMounted) this.setState({ sidebar: result.data });
            })
    }

    render() {
        const { sidebar } = this.state;
        var selected_path = window.location.pathname;

        const sidebar_menus = sidebar.map((item) => {
            let url = "/" + item.url;

            if (item.sub_menus) {
                return (
                    <SubMenu
                        title={<span>
                            <Icon type={item.menu_icon} />
                            <span>
                                {item.parent_menu}
                            </span>
                        </span>}
                        key={url}>

                        {item.sub_menus.map((sub_menu) => {
                            let url = "/" + sub_menu.url;

                            return (
                                <Menu.Item key={url}>
                                    <Link to={url}>
                                        <Icon type={sub_menu.submenu_icon} />
                                        <span>
                                            {sub_menu.name}
                                        </span>
                                    </Link>
                                </Menu.Item>
                            );
                        })}
                    </SubMenu>
                );
            }
            else {
                return (
                    <Menu.Item key={url}>
                        <Link to={url}>
                            <Icon type={item.menu_icon} />
                            <span>
                                {item.parent_menu}
                            </span>
                        </Link>
                    </Menu.Item>
                );
            }
        });

        return (
            <Sider width={260}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" selectedKeys={[selected_path]}>
                    {sidebar_menus}
                </Menu>
            </Sider>
        );
    }
}

export default SideBar;