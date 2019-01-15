import React, { Component } from 'react';
import { listPermission, createPermission, deletePermission, updatePermission } from '../../helpers/AdminController';
import { Table, Button, Modal, Form, Input, Spin } from 'antd';
import { checkAccess } from '../../helpers/PermissionController';
import Exception403 from '../../errors/Exception403';

const { Column } = Table;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ManagePermission extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            required: ['admin-tasks'],
            allowed: [],
            permissions: [],
            visible: false,
            clickAdd: false,
            loading: false,
            delete_loading: false,
            page_loading: true
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getPermissions();
        this.showListPermission();
        this.props.toggleSideBar(true);
        this.props.pageTitle('Permissions');
        this.props.pageDescription('Create a new permission and modify the existing permissions.');
        this.props.pageBreadCrumb1('User Management');
        this.props.pageHelmet('Manage User - Permissions');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        const { required } = this.state;

        checkAccess(required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }, () => this.setState({ page_loading: false })) : null);
    }

    showListPermission() {
        var access_token = sessionStorage.getItem('access_token');

        listPermission(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ permissions: result.data });
                }
            })
    }

    showAddModal = () => {
        if(this._isMounted) this.setState({ visible: true, clickAdd: true });
    }

    showEditModal = () => {
        if(this._isMounted) this.setState({ visible: true });
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        if(this._isMounted) this.setState({ visible: false }, () => this.setState({ clickAdd: false }));
    }

    handleCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            if(this._isMounted) this.setState({ loading: true });
            createPermission(values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.showListPermission();
                        if(this._isMounted) this.setState({ visible: false, clickAdd: false, loading: false });
                        form.resetFields();
                    }
                })
        });
    }

    handleEdit = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        const { permission_id } = this.state;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            updatePermission(permission_id, values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.showListPermission();
                        if(this._isMounted) this.setState({ visible: false, clickAdd: false, loading: false });
                        form.resetFields();
                    }
                })
        });
    }

    handleDelete = (permission_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Role',
            content: 'Are you sure you want to delete this role?',
            onOk: () => {
                if(this._isMounted) this.setState({ delete_loading: true });
                deletePermission(permission_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            if(this._isMounted) this.setState({ delete_loading: false });
                            this.handleCancel();
                            this.showListPermission();
                        }
                    })
            }
        })
    }

    onChangeNewPermission = () => {
        if(this._isMounted) this.setState({
            permission: {
                name: ''
            }
        }, () => this.showAddModal());
    }

    render() {
        const { visible, clickAdd, permissions, permission, permission_id, loading, delete_loading, allowed, page_loading } = this.state;
        const { getFieldDecorator } = this.props.form;

        let addModalFooter =
            <div>
                <Button loading={loading} type="primary" onClick={this.handleCreate}>Create</Button>
            </div>

        let editModalFooter =
            <div>
                <Button loading={delete_loading} type="danger" onClick={() => this.handleDelete(permission_id)}>Delete</Button>
                <Button loading={loading} type="primary" onClick={this.handleEdit}>Save</Button>
            </div>

        if (allowed.includes('admin-tasks') || page_loading) {
            return (
                <Spin spinning={page_loading} size="large">
                    <div className="padding-30">
                        <Button
                            className="margin-bottom-15"
                            onClick={this.onChangeNewPermission}
                            type="primary"
                            icon="file-protect">
                            New Permission
                        </Button>

                        <Table
                            bordered
                            className="trigger"
                            dataSource={permissions}
                            rowKey={permissions => permissions.id}
                            pagination={{ hideOnSinglePage: true, pageSize: 30 }}
                            onRow={(record) => {
                                return {
                                    onClick: () => {this.setState({ permission: Object.assign({}, record), permission_id: record.id }, this.showEditModal)}
                                };
                            }}>
                            <Column title="Permission Name" dataIndex="name" key="name" />
                            <Column title="value" dataIndex="value" key="value" />
                        </Table>

                        <Modal
                            visible={visible}
                            title={clickAdd ? "Create New Permission" : "Edit Permission"}
                            onCancel={this.handleCancel}
                            footer={clickAdd ? addModalFooter : editModalFooter}>
                            {permission && <Form layout="vertical">
                                <FormItem label="Name">
                                    {getFieldDecorator('name', {
                                        initialValue: permission.name,
                                        rules: [{ required: true, message: 'Please input the permission name!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Form>}
                        </Modal>
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

export default Form.create()(ManagePermission);