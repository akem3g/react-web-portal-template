import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Layout, Menu, Icon, Breadcrumb, Tooltip, Modal, Card } from 'antd';
import { Helmet } from 'react-helmet';

import { showSideBarMenu } from './helpers/AdminController';
import { PrivateRoute } from './helpers/PrivateRoute';

import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import ManageUser from './components/user_management/ManageUser';
import ManageMenu from './components/menu_management/ManageMenu';
import ManageRole from './components/user_management/ManageRole';
import ManagePermission from './components/user_management/ManagePermission';

import './App.css';

const { Content, Footer, Sider, Header } = Layout;
const SubMenu = Menu.SubMenu;
const confirm = Modal.confirm;

class App extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            sidebar: [],
            is_sidebar: false,
            page_title: '',
            page_description: '',
            page_breadcrumb_1: null,
            helmet: ''
        };
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
                if(this._isMounted) this.setState({ sidebar: result.data });
            })
    }

    doLogin = () => {
        this.fetchSideBarMenu();
    }

    onCollapse = () => {
        if(this._isMounted) this.setState({ collapsed: !this.state.collapsed });
    }

    logout = () => {
        confirm({
            title: 'Confirm',
            content: 'Are you sure you want to log out?',
            onOk: () => {
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('name');
                // return <Link to="/" />;
                this.forceUpdate();
            }
        });
    }

    sidebar() {
        const { sidebar } = this.state;
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
                        key={item.key}>

                        {item.sub_menus.map((sub_menu) => {
                            let url = "/" + sub_menu.url;

                            return (
                                <Menu.Item key={"sub_menu" + sub_menu.key}>
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
                    <Menu.Item key={"menu" + item.key}>
                        <Link to={url}>
                            <Icon type={item.menu_icon} />
                            <span>
                                {item.parent_menu}
                            </span>
                        </Link>
                    </Menu.Item>
                );
            }
        })

        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                trigger={null}>
                <div className="logo" />
                <Menu theme="dark" mode="inline">
                    {sidebar_menus}
                </Menu>
            </Sider>
        );
    }

    toggleSideBar(val) {
        const { is_sidebar } = this.state;

        if (val !== is_sidebar) {
            if(this._isMounted) this.setState({ is_sidebar: val });
        }
    }

    pageTitle(val) {
        const { page_title } = this.state;

        if (val !== page_title) {
            if(this._isMounted) this.setState({ page_title: val });
        }
    }

    pageDescription(val) {
        const { page_description } = this.state;

        if (val !== page_description) {
            if(this._isMounted) this.setState({ page_description: val });
        }
    }

    pageBreadCrumb1(val) {
        const { page_breadcrumb_1 } = this.state;

        if (val !== page_breadcrumb_1) {
            if(this._isMounted) this.setState({ page_breadcrumb_1: val });
        }
    }

    pageHelmet(val) {
        const { helmet } = this.state;

        if (val !== helmet) {
            if(this._isMounted) this.setState({ helmet: val });
        }
    }

    layout() {
        return (
            <Layout>
                <Content>
                    <Switch>
                    <Route
                        exact
                        path="/"
                        component={() =>
                            <Login
                                doLogin={this.doLogin}
                                toggleSideBar={this.toggleSideBar.bind(this)}
                                pageHelmet={this.pageHelmet.bind(this)} />
                        } />
                    <PrivateRoute
                        path="/reset-password"
                        component={(props) =>
                            <ResetPassword
                                {...props}
                                reloadMenu={this.fetchSideBarMenu.bind(this)}
                                toggleSideBar={this.toggleSideBar.bind(this)}
                                pageTitle={this.pageTitle.bind(this)}
                                pageDescription={this.pageDescription.bind(this)}
                                pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                pageHelmet={this.pageHelmet.bind(this)} />
                        } />
                    <PrivateRoute
                        path="/users"
                        component={(props) =>
                            <ManageUser
                                {...props}
                                reloadMenu={this.fetchSideBarMenu.bind(this)}
                                toggleSideBar={this.toggleSideBar.bind(this)}
                                pageTitle={this.pageTitle.bind(this)}
                                pageDescription={this.pageDescription.bind(this)}
                                pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                pageHelmet={this.pageHelmet.bind(this)} />
                        } />
                    <PrivateRoute
                        path="/roles"
                        component={(props) =>
                            <ManageRole
                                {...props}
                                reloadMenu={this.fetchSideBarMenu.bind(this)}
                                toggleSideBar={this.toggleSideBar.bind(this)}
                                pageTitle={this.pageTitle.bind(this)}
                                pageDescription={this.pageDescription.bind(this)}
                                pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                pageHelmet={this.pageHelmet.bind(this)} />
                        } />
                    <PrivateRoute
                        path="/permissions"
                        component={(props) =>
                            <ManagePermission
                                {...props}
                                reloadMenu={this.fetchSideBarMenu.bind(this)}
                                toggleSideBar={this.toggleSideBar.bind(this)}
                                pageTitle={this.pageTitle.bind(this)}
                                pageDescription={this.pageDescription.bind(this)}
                                pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                pageHelmet={this.pageHelmet.bind(this)} />
                        } />
                    <PrivateRoute
                        path="/menu-management"
                        component={(props) =>
                            <ManageMenu
                                {...props}
                                reloadMenu={this.fetchSideBarMenu.bind(this)}
                                toggleSideBar={this.toggleSideBar.bind(this)}
                                pageTitle={this.pageTitle.bind(this)}
                                pageDescription={this.pageDescription.bind(this)}
                                pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                pageHelmet={this.pageHelmet.bind(this)} />
                        } />
                    </Switch>
                </Content>

                <Footer className="footer">
                    backofficewebtemplate ©2018
                </Footer>
            </Layout>
        );
    }

    render() {
        const { is_sidebar, page_title, page_description, page_breadcrumb_1, helmet } = this.state;
        var user_name = sessionStorage.getItem('name');

        return (
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Helmet>
                        <title>{helmet}</title>
                    </Helmet>
                    {is_sidebar ? this.sidebar() : null}
                    <Layout>
                        {is_sidebar ? <div>
                            <Header style={{ background: '#fff', padding: 0 }}>
                            <div className="header-width">
                                <div className="float-left">
                                    <Icon
                                        className="trigger icon-header-20"
                                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                        onClick={this.onCollapse} />
                                </div>
                                <div className="float-right">
                                    <Tooltip title="Nothing to do here">
                                        <Icon type="info-circle" className="padding-right-10 icon-header-16 trigger" />
                                    </Tooltip>
                                    <Tooltip title="Reset Password">
                                        <Link to="/reset-password" style={{ color: '#606060' }}>
                                            <Icon type="lock" className="padding-right-10 icon-header-16 trigger" />
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title="Log Out">
                                        <Icon type="logout" className="padding-right-10 icon-header-16 trigger" onClick={() => this.logout()} />
                                    </Tooltip>
                                    <Icon type="user" className="padding-right-10 icon-header-16" /><span className="text-bold">{user_name}</span>
                                </div>
                            </div>
                            </Header>
                            <Card className="content-header">
                                <Breadcrumb className="padding-bottom-20">
                                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                                    {page_breadcrumb_1 ? <Breadcrumb.Item>{page_breadcrumb_1}</Breadcrumb.Item> : null}
                                    <Breadcrumb.Item>{page_title}</Breadcrumb.Item>
                                </Breadcrumb>
                                <h2 className="title-bold">{page_title}</h2>
                                <span>{page_description}</span>
                            </Card>
                        </div> : null}
                        {this.layout()}
                    </Layout>
                </Layout>
            </Router>
        );
    }
}

export default App;

/**
 * NO PRIVATE ROUTE
 * 
 * App.js
 * change <PrivateRoute> to <Route> and component={} to render={}
 * add isLoggedIn state, do a setState in doLogin() = true and logout() = false
 * add a condition in render() to show login page when isLoggedIn is false
 * remove <Switch>
 * 
 * Login.js
 * remove <Redirect> condition in render()
 */

 /**
  * LOGOUT BUTTON
  * <div style={{ paddingTop: '40px', textAlign: 'center' }}>
        <Button type="primary" onClick={() => this.logout()}>Logout</Button>
    </div>
  */