import React, { Component } from 'react';
import { Button, Spin } from 'antd';

import { checkAccess } from '../../helpers/PermissionController';

import PermissionTable from './permission_components/PermissionTable';
import PermissionModal from './permission_components/PermissionModal';

import Exception403 from '../../errors/Exception403';

class ManagePermission extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            required: ['admin-tasks'],
            allowed: [],
            visible: false,
            clickAdd: false,
            page_loading: true,
            permission: ''
        }

        this.PermissionTable = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        this.getCheckAccess();
        this.props.toggleSideBar(true);
        this.props.pageTitle('Permissions');
        this.props.pageDescription('Create a new permission and modify the existing permissions.');
        this.props.pageBreadCrumb1('User Management');
        this.props.pageHelmet('Manage User - Permissions');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getCheckAccess() {
        var access_token = sessionStorage.getItem('access_token');
        const { required } = this.state;

        checkAccess(required, access_token)
            .then(result => {
                if (this._isMounted) {
                    this.setState({ allowed: result }, () => this.setState({ page_loading: false }));
                }
            })
    }

    onClickNewPermission() {
        if (this._isMounted) {
            this.setState({
                permission: '',
                visible: true,
                clickAdd: true
            });
        }
    }

    onClickExistingPermission(record) {
        if (this._isMounted) {
            this.setState({
                permission: record,
                visible: true,
                clickAdd: false
            });
        }
    }

    handleCloseModel() {
        if (this._isMounted) {
            this.setState({ visible: false }, () => this.setState({ clickAdd: false }));
        }
    }

    reloadshowListPermission() {
        this.PermissionTable.current.showListPermission();
    }

    render() {
        const { visible, clickAdd, permission, allowed, page_loading } = this.state;

        if (allowed.includes('admin-tasks') || page_loading) {
            return (
                <Spin spinning={page_loading} size="large">
                    <div className="padding-30 padding-left-50 padding-right-50 padding-bottom-20">
                        <Button
                            className="margin-bottom-15"
                            onClick={this.onClickNewPermission.bind(this)}
                            type="primary"
                            icon="file-protect">
                            New Permission
                        </Button>

                        <PermissionTable
                            ref={this.PermissionTable}
                            onClickExistingPermission={this.onClickExistingPermission.bind(this)} />

                        <PermissionModal
                            visible={visible}
                            clickAdd={clickAdd}
                            permission={permission}
                            handleCloseModel={this.handleCloseModel.bind(this)}
                            reloadshowListPermission={this.reloadshowListPermission.bind(this)} />
                    </div>
                </Spin>
            );
        }
        else {
            return (
                <Exception403 />
            );
        }
    }
}

export default ManagePermission;