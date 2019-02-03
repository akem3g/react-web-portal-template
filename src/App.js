import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Layout, Icon, Breadcrumb, Tooltip, Modal, Card } from 'antd';
import { Helmet } from 'react-helmet';

import { showSideBarMenu } from './helpers/AdminController';
import { PrivateRoute } from './helpers/PrivateRoute';

import Login from './components/Login';
import ManageUser from './components/user_management/ManageUser';
import ManageMenu from './components/menu_management/ManageMenu';
import ManageRole from './components/user_management/ManageRole';
import ManagePermission from './components/user_management/ManagePermission';
import Account from './components/account_management/Account';

import './App.css';
import SideBar from './components/layouts/SideBar';

const { Content, Footer, Header } = Layout;
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
            helmet: '',
            header_info: ''
        };

        this.child = React.createRef();
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

    doLogin = () => {
        this.fetchSideBarMenu();
    }

    onCollapse = () => {
        if (this._isMounted) this.child.current.onCollapse();
    }

    logout = () => {
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

    toggleSideBar(val) {
        const { is_sidebar } = this.state;

        if (val !== is_sidebar) {
            if (this._isMounted) this.setState({ is_sidebar: val });
        }
    }

    pageTitle(val) {
        const { page_title } = this.state;

        if (val !== page_title) {
            if (this._isMounted) this.setState({ page_title: val });
        }
    }

    pageDescription(val) {
        const { page_description } = this.state;

        if (val !== page_description) {
            if (this._isMounted) this.setState({ page_description: val });
        }
    }

    pageBreadCrumb1(val) {
        const { page_breadcrumb_1 } = this.state;

        if (val !== page_breadcrumb_1) {
            if (this._isMounted) this.setState({ page_breadcrumb_1: val });
        }
    }

    pageHelmet(val) {
        const { helmet } = this.state;

        if (val !== helmet) {
            if (this._isMounted) this.setState({ helmet: val });
        }
    }

    toggleHeaderInfo(val) {
        const { header_info } = this.state;

        if (val !== header_info) {
            if (this._isMounted) this.setState({ header_info: val });
        }
    }

    openGithub() {
        window.open('https://github.com/akem3g', '_blank');
    }

    openTwitter() {
        window.open('https://twitter.com/hakiimmislam', '_blank');
    }

    openFacebook() {
        window.open('https://facebook.com/hakiimmislam', '_blank');
    }

    pageRoute() {
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
                            path="/account"
                            component={(props) =>
                                <Account
                                    {...props}
                                    toggleSideBar={this.toggleSideBar.bind(this)}
                                    pageTitle={this.pageTitle.bind(this)}
                                    pageDescription={this.pageDescription.bind(this)}
                                    pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                    pageHelmet={this.pageHelmet.bind(this)}
                                    toggleHeaderInfo={this.toggleHeaderInfo.bind(this)} />
                            } />
                        <PrivateRoute
                            path="/user-management/users"
                            component={(props) =>
                                <ManageUser
                                    {...props}
                                    toggleSideBar={this.toggleSideBar.bind(this)}
                                    pageTitle={this.pageTitle.bind(this)}
                                    pageDescription={this.pageDescription.bind(this)}
                                    pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                    pageHelmet={this.pageHelmet.bind(this)}
                                    toggleHeaderInfo={this.toggleHeaderInfo.bind(this)} />
                            } />
                        <PrivateRoute
                            path="/user-management/roles"
                            component={(props) =>
                                <ManageRole
                                    {...props}
                                    toggleSideBar={this.toggleSideBar.bind(this)}
                                    pageTitle={this.pageTitle.bind(this)}
                                    pageDescription={this.pageDescription.bind(this)}
                                    pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                    pageHelmet={this.pageHelmet.bind(this)}
                                    toggleHeaderInfo={this.toggleHeaderInfo.bind(this)} />
                            } />
                        <PrivateRoute
                            path="/user-management/permissions"
                            component={(props) =>
                                <ManagePermission
                                    {...props}
                                    toggleSideBar={this.toggleSideBar.bind(this)}
                                    pageTitle={this.pageTitle.bind(this)}
                                    pageDescription={this.pageDescription.bind(this)}
                                    pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                    pageHelmet={this.pageHelmet.bind(this)}
                                    toggleHeaderInfo={this.toggleHeaderInfo.bind(this)} />

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
                                    pageHelmet={this.pageHelmet.bind(this)}
                                    toggleHeaderInfo={this.toggleHeaderInfo.bind(this)} />
                            } />
                    </Switch>
                </Content>

                <Footer className="footer">
                    <Tooltip title="github">
                        <Icon
                            type="github"
                            className="padding-right-10 icon-header-16 trigger"
                            onClick={this.openGithub.bind(this)} />
                    </Tooltip>

                    <Tooltip title="twitter">
                        <Icon
                            type="twitter"
                            className="padding-right-10 icon-header-16 trigger"
                            onClick={this.openTwitter.bind(this)} />
                    </Tooltip>

                    <Tooltip title="facebook">
                        <Icon
                            type="facebook"
                            className="padding-right-10 icon-header-16 trigger"
                            onClick={this.openFacebook.bind(this)} />
                    </Tooltip>
                    akem3g ©2019
                </Footer>
            </Layout>
        );
    }

    render() {
        const { is_sidebar, page_title, page_description, page_breadcrumb_1, helmet, header_info, sidebar } = this.state;
        var user_name = sessionStorage.getItem('name');

        const resetPassword = {
            pathname: "/account", 
            param: "reset-password" 
        };

        return (
            <Router>
                <Layout className="sidebar-height">
                    <Helmet>
                        <title>{helmet}</title>
                    </Helmet>
                    {is_sidebar ?
                        <SideBar ref={this.child} sidebar={sidebar} />
                        : null}
                    <Layout>
                        {is_sidebar ? <div>
                            <Header className="header-white">
                                <div className="header-width">
                                    <div className="float-left">
                                        <Icon
                                            className="trigger icon-header-20"
                                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                            onClick={this.onCollapse} />
                                    </div>
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
                            </Header>

                            {header_info ?
                                <Card className="content-header">
                                    <Breadcrumb className="padding-bottom-20">
                                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                                        {page_breadcrumb_1 ? <Breadcrumb.Item>{page_breadcrumb_1}</Breadcrumb.Item> : null}
                                        <Breadcrumb.Item>{page_title}</Breadcrumb.Item>
                                    </Breadcrumb>
                                    <h2 className="title-bold">{page_title}</h2>
                                    <span>{page_description}</span>
                                </Card>
                            : null}

                        </div> : null}
                        {this.pageRoute()}
                    </Layout>
                </Layout>
            </Router>
        );
    }
}

export default App;