import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            sidebar: []
        }
    }

    onCollapse = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const { sidebar } = this.props;
        const { collapsed } = this.state;
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
            <Sider
                width={260}
                collapsed={collapsed}
                trigger={null}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" selectedKeys={[selected_path]}>
                    {sidebar_menus}
                </Menu>
            </Sider>
        );
    }
}

export default SideBar;