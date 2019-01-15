import React, { Component } from 'react';
import { listRole, createRole, deleteRole, updateRole, listPermission } from '../../helpers/AdminController';
import { Table, Button, Modal, Form, Input, Checkbox, Spin } from 'antd';
import { checkAccess } from '../../helpers/PermissionController';
import Exception403 from '../../errors/Exception403';

const { Column } = Table;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

class ManageRole extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            required: ['admin-tasks'],
            allowed: [],
            roles: [],
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
        this.showListRole();
        this.showListPermission();
        this.props.toggleSideBar(true);
        this.props.pageTitle('Roles');
        this.props.pageDescription('Assign the roles on each user here.');
        this.props.pageBreadCrumb1('User Management');
        this.props.pageHelmet('Manage User - Roles');
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

    showListRole() {
        var access_token = sessionStorage.getItem('access_token');

        listRole(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ roles: result.permission_role });
                }
            })
    }

    showListPermission() {
        var access_token = sessionStorage.getItem('access_token');

        listPermission(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({
                        permissions: result.data,
                    });
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
            createRole(values.name, values.permission, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.showListRole();
                        if(this._isMounted) this.setState({ visible: false, clickAdd: false, loading: false });
                        form.resetFields();
                    }
                })
        });
    }

    handleEdit = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        const { role_id } = this.state;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            updateRole(role_id, values.name, values.permission, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.showListRole();
                        if(this._isMounted) this.setState({ visible: false, clickAdd: false, loading: false });
                        form.resetFields();
                    }
                })
        });
    }

    handleDelete = (role_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Role',
            content: 'Are you sure you want to delete this role?',
            onOk: () => {
                if(this._isMounted) this.setState({ delete_loading: true });
                deleteRole(role_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            if(this._isMounted) this.setState({ delete_loading: false });
                            this.handleCancel();
                            this.showListRole();
                        }
                    })
            }
        })
    }

    onChangeNewRole = () => {
        if(this._isMounted) this.setState({
            role: {
                name: ''
            }
        }, () => this.showAddModal());
    }

    render() {
        const { visible, clickAdd, roles, role, role_id, permissions, loading, delete_loading, allowed, page_loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        
        let addModalFooter =
            <div>
                <Button loading={loading} type="primary" onClick={this.handleCreate}>Create</Button>
            </div>

        let editModalFooter =
            <div>
                <Button loading={delete_loading} type="danger" onClick={() => this.handleDelete(role_id)}>Delete</Button>
                <Button loading={loading} type="primary" onClick={this.handleEdit}>Save</Button>
            </div>

        if (allowed.includes('admin-tasks') || page_loading) {
            return (
                <Spin spinning={page_loading} size="large">
                    <div className="padding-30 padding-left-50 padding-right-50 padding-bottom-20">
                        <Button
                            className="margin-bottom-15"
                            onClick={this.onChangeNewRole}
                            type="primary"
                            icon="crown">
                            New Role
                        </Button>

                        <Table
                            bordered
                            className="trigger"
                            dataSource={roles}
                            rowKey={roles => roles.role_id}
                            pagination={{ hideOnSinglePage: true, pageSize: 30 }}
                            onRow={(record) => {
                                return {
                                    onClick: () => {if(this._isMounted) this.setState({ role: Object.assign({}, record), role_id: record.role_id }, this.showEditModal)}
                                };
                            }}>
                            <Column title="Role" dataIndex="role_name" key="role_name" />
                            <Column
                                title="Permissions"
                                key="permissions_name"
                                render={(record =>
                                    <span>{record.permissions_name.join(', ')}</span>
                                )} />
                        </Table>

                        <Modal
                            visible={visible}
                            title={clickAdd ? "Create New Role" : "Edit Role"}
                            onCancel={this.handleCancel}
                            footer={clickAdd ? addModalFooter : editModalFooter}>
                            {role && <Form layout="vertical">
                                <FormItem label="Name">
                                    {getFieldDecorator('name', {
                                        initialValue: role.role_name,
                                        rules: [{ required: true, message: 'Please input the role name!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                                <FormItem label="Permissions">
                                    {getFieldDecorator('permission', {
                                        initialValue: role.permissions_id,
                                        rules: [{ required: true, message: 'Please check the permissions!' }]
                                    })(
                                        <CheckboxGroup name="permission">
                                            {permissions.map((permission) =>
                                                <Checkbox className="ant-checkbox-group-item" key={permission.id} value={permission.id}>{permission.name}</Checkbox>
                                            )}
                                        </CheckboxGroup>
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

export default Form.create()(ManageRole);