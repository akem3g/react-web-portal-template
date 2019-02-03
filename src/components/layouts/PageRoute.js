import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import { PrivateRoute } from '../../helpers/PrivateRoute';

import Login from '../Login';
import ManageUser from '../user_management/ManageUser';
import ManageMenu from '../menu_management/ManageMenu';
import ManageRole from '../user_management/ManageRole';
import ManagePermission from '../user_management/ManagePermission';
import Account from '../account_management/Account';

const { Content } = Layout;

class PageRoute extends Component {
    reloadMenu() {
        this.props.reloadMenu();
    }

    doLogin() {
        this.props.reloadMenu();
    }

    toggleSideBar(val) {
        this.props.toggleSideBar(val);
    }

    pageTitle(val) {
        this.props.pageTitle(val);
    }

    pageDescription(val) {
        this.props.pageDescription(val);
    }

    pageBreadCrumb1(val) {
        this.props.pageBreadCrumb1(val);
    }

    pageHelmet(val) {
        this.props.pageHelmet(val);
    }

    reloadUserName() {
        this.props.reloadUserName();
    }

    render() {
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
            </Layout>
        );
    }
}

export default PageRoute;