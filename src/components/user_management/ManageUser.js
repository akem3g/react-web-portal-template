import React, { Component } from 'react';
import { listUser, createUser, updateUser, listRole, deleteUser } from '../../helpers/AdminController';
import { Table, Button, Modal, Form, Input, Checkbox, Spin } from 'antd';
import { checkAccess } from '../../helpers/PermissionController';
import Exception403 from '../../errors/Exception403';

const { Column } = Table;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

class ManageUser extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            required: ['admin-tasks'],
            allowed: [],
            data: [],
            roles: [],
            visible: false,
            clickAdd: false,
            confirmDirty: false,
            loading: false,
            delete_loading: false,
            page_loading: true
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getPermissions();
        this.showListUser();
        this.showListRole();
        this.props.toggleSideBar(true);
        this.props.pageTitle('Users');
        this.props.pageDescription('Create and configure the user.');
        this.props.pageBreadCrumb1('User Management');
        this.props.pageHelmet('Manage User - Users');
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

    showListUser() {
        var access_token = sessionStorage.getItem('access_token');

        listUser(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ data: result.data });
                }
            })
    }

    showListRole() {
        var access_token = sessionStorage.getItem('access_token');

        listRole(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ roles: result.data });
                }
            })
    }

    showAddModal = () => {
        this.setState({ visible: true, clickAdd: true });
    }

    showEditModal = () => {
        this.setState({ visible: true });
    }

    handleCancel = () => {
        const form = this.props.form;
        form.resetFields();
        if(this._isMounted) this.setState({ visible: false }, () => this.setState({ clickAdd: false }));
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;

        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        }
        else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;

        if (value && this.state.confirmDirty) {
            form.validateFieldsAndScroll(['confirm_password'], { force: true });
        }

        callback();
    }

    handleCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            if(this._isMounted) this.setState({ loading: true });
            createUser(values.name, values.username, values.email, values.password, values.confirm_password, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        this.showListUser();
                        if(this._isMounted) this.setState({ visible: false, clickAdd: false, loading: false });
                    }
                })
        });
    }

    handleEdit = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        const { user_id } = this.state;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            updateUser(user_id, values.name, values.username, values.email, values.password, values.confirm_password, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        this.showListUser();
                        if(this._isMounted) this.setState({ visible: false, clickAdd: false, loading: false });
                    }
                })
        });
    }

    handleDelete = (user_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete User',
            content: 'Are you sure you want to delete this user?',
            onOk: () => {
                if(this._isMounted) this.setState({ delete_loading: true });
                deleteUser(user_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            if(this._isMounted) this.setState({ delete_loading: true });
                            this.handleCancel();
                            this.showListUser();
                        }
                    })
            }
        })
    }

    onChangeNewUser = () => {
        this.setState({
            user: {
                name: '',
                username: '',
                email: '',
                password: '',
                confirm_password: ''
            }
        }, () => this.showAddModal());
    }

    render() {
        const { data, visible, clickAdd, user, roles, user_id, loading, delete_loading, allowed, page_loading } = this.state;
        const { getFieldDecorator } = this.props.form;

        let addModalFooter =
            <div>
                <Button loading={loading} type="primary" onClick={this.handleCreate}>Create</Button>
            </div>

        let editModalFooter =
            <div>
                <Button loading={delete_loading} type="danger" onClick={() => this.handleDelete(user_id)}>Delete</Button>
                <Button loading={loading} type="primary" onClick={this.handleEdit}>Save</Button>
            </div>

        if (allowed.includes('admin-tasks') || page_loading) {
            return (
                <Spin spinning={page_loading} size="large">
                    <div className="padding-30">
                        <Button
                            className="margin-bottom-15"
                            onClick={this.onChangeNewUser}
                            type="primary"
                            icon="user">
                            New User
                        </Button>
    
                        <Table
                            bordered
                            className="trigger"
                            dataSource={data}
                            rowKey={data => data.id}
                            pagination={{ hideOnSinglePage: true, pageSize: 30 }}
                            onRow={(record) => {
                                return {
                                    onClick: () => {if(this._isMounted) this.setState({ user: Object.assign({}, record), user_id: record.id }, this.showEditModal)}
                                };
                            }}>
                            <Column title="Name" dataIndex="name" key="name" />
                            <Column title="Username" dataIndex="username" key="username" />
                            <Column title="Email" dataIndex="email" key="email" />
                            <Column title="Roles" dataIndex="roles_name" key="roles_name" render={(text => text.join(', '))} />
                            <Column
                                title="Status"
                                key="status"
                                render={(record =>
                                    <span className="status-active">{record.status}</span>
                                )} />
                        </Table>
                        
                        <Modal
                            visible={visible}
                            title={clickAdd ? "Create New User" : "Edit User"}
                            onCancel={this.handleCancel}
                            footer={clickAdd ? addModalFooter : editModalFooter}>
                            {user && <Form layout="vertical">
                                <FormItem label="Name">
                                    {getFieldDecorator('name', {
                                        initialValue: user.name,
                                        rules: [{ required: true, message: 'Please input the name!' }]
                                    })(
                                        <Input name="name" />
                                    )}
                                </FormItem>
    
                                <FormItem label="Username">
                                    {getFieldDecorator('username', {
                                        initialValue: user.username,
                                        rules: [{ required: true, message: 'Please input the username!' }]
                                    })(
                                        <Input name="username" onBlur={this.handleConfirmBlur} />
                                    )}
                                </FormItem>
    
                                <FormItem label="Email">
                                    {getFieldDecorator(user.email ? user.email : 'email', {
                                        initialValue: user.email,
                                        rules: [{ message: 'Please input the E-mail!' }],
                                    })(
                                        <Input name="email" />
                                    )}
                                </FormItem>
    
                                <FormItem label="Password">
                                    {getFieldDecorator('password', {
                                        initialValue: user.password,
                                        rules: [{
                                            required: clickAdd ? true : false,
                                            message: 'Please input the password!'
                                        }, {
                                            validator: this.validateToNextPassword,
                                        }],
                                    })(
                                        <Input name="password" type="password" />
                                    )}
                                </FormItem>
    
                                <FormItem label="Confirm Password">
                                    {getFieldDecorator('confirm_password', {
                                        initialValue: user.confirm_password,
                                        rules: [{
                                            required: clickAdd ? true : false,
                                            message: 'Please confirm your password!'
                                        }, {
                                            validator: this.compareToFirstPassword,
                                        }],
                                    })(
                                        <Input name="confirm_password" type="password" onBlur={this.handleConfirmBlur} />
                                    )}
                                </FormItem>
    
                                <FormItem label="Role">
                                    {getFieldDecorator('role', {
                                        initialValue: user.roles_id,
                                        rules: [{ required: true, message: 'Please check the roles!' }]
                                    })(
                                        <CheckboxGroup name="role">
                                            {roles.map((role) =>
                                                <Checkbox className="ant-checkbox-group-item" key={role.id} value={role.id}>{role.name}</Checkbox>
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

export default Form.create()(ManageUser);