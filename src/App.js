import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import { Helmet } from 'react-helmet';

import { PrivateRoute } from './helpers/PrivateRoute';

import Login from './components/Login';
import ManageUser from './components/user_management/ManageUser';
import ManageMenu from './components/menu_management/ManageMenu';
import ManageRole from './components/user_management/ManageRole';
import ManagePermission from './components/user_management/ManagePermission';
import Account from './components/account_management/Account';

import './App.css';
import SideBar from './components/layouts/SideBar';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import BreadCrumb from './components/layouts/BreadCrumb';
// import PageRoute from './components/layouts/PageRoute';

const { Content } = Layout;

class App extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            is_sidebar: true,
            page_title: '',
            page_description: '',
            page_breadcrumb_1: null,
            helmet: ''
        };

        this.SideBar = React.createRef();
        this.Header = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    reloadMenu() {
        this.child.current.fetchSideBarMenu();
    }

    doLogin() {
        this.child.current.fetchSideBarMenu();
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

    reloadUserName() {
        this.Header.current.account();
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
                                    doLogin={this.doLogin.bind(this)}
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
                                    reloadUserName={this.reloadUserName.bind(this)} />
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
                                    pageHelmet={this.pageHelmet.bind(this)} />
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
                                    pageHelmet={this.pageHelmet.bind(this)} />
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
                                    pageHelmet={this.pageHelmet.bind(this)} />

                            } />
                        <PrivateRoute
                            path="/menu-management"
                            component={(props) =>
                                <ManageMenu
                                    {...props}
                                    reloadMenu={this.reloadMenu.bind(this)}
                                    toggleSideBar={this.toggleSideBar.bind(this)}
                                    pageTitle={this.pageTitle.bind(this)}
                                    pageDescription={this.pageDescription.bind(this)}
                                    pageBreadCrumb1={this.pageBreadCrumb1.bind(this)}
                                    pageHelmet={this.pageHelmet.bind(this)} />
                            } />
                    </Switch>
                </Content>

                <Footer />
            </Layout>
        );
    }

    render() {
        const { is_sidebar, page_title, page_description, page_breadcrumb_1, helmet } = this.state;

        return (
            <Router>
                <Layout className="sidebar-height">
                    <Helmet>
                        <title>{helmet}</title>
                    </Helmet>
                    {is_sidebar ?
                        <SideBar ref={this.SideBar} />
                    : null}
                    <Layout>
                        {is_sidebar ?
                            <div>
                                <Header ref={this.Header} />
                                <BreadCrumb
                                    page_breadcrumb_1={page_breadcrumb_1}
                                    page_title={page_title}
                                    page_description={page_description} />
                            </div>
                        : null}
                        {/* <PageRoute /> */}
                        {this.pageRoute()}
                    </Layout>
                </Layout>
            </Router>
        );
    }
}

export default App;