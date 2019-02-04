import React, { Component } from 'react';
import { Modal, Form, Input, Button } from 'antd';

import { createPermission, updatePermission, deletePermission } from '../../../helpers/AdminController';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class PermissionModal extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            delete_loading: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleCreate() {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            if (this._isMounted) this.setState({ loading: true });
            createPermission(values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.handleCloseModel();
                        this.props.reloadshowListPermission();
                        this.setState({ loading: false });
                    }
                })
        });
    }

    handleEdit(permission_id) {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if (this._isMounted) this.setState({ loading: true });
            updatePermission(permission_id, values.name, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.handleCloseModel();
                        this.props.reloadshowListPermission();
                        this.setState({ loading: false });
                    }
                })
        });
    }

    handleDelete(permission_id) {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Role',
            content: 'Are you sure you want to delete this role?',
            onOk: () => {
                if (this._isMounted) this.setState({ delete_loading: true });
                deletePermission(permission_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            this.handleCloseModel();
                            this.props.reloadshowListPermission();
                            this.setState({ delete_loading: false });
                        }
                    })
            }
        })
    }

    handleCloseModel() {
        const form = this.props.form;
        this.props.handleCloseModel();
        form.resetFields();
    }

    render() {
        const { loading, delete_loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { visible, clickAdd, permission } = this.props;

        let addModalFooter =
            <div>
                <Button
                    loading={loading}
                    type="primary"
                    onClick={this.handleCreate.bind(this)}>
                    Create
                </Button>
            </div>

        let editModalFooter =
            <div>
                <Button
                    loading={delete_loading}
                    type="danger"
                    onClick={this.handleDelete.bind(this, permission.id)}>
                    Delete
                </Button>

                <Button
                    loading={loading}
                    type="primary"
                    onClick={this.handleEdit.bind(this, permission.id)}>
                    Save
                </Button>
            </div>

        return (
            <Modal
                visible={visible}
                title={clickAdd ? "Create New Permission" : "Edit Permission"}
                onCancel={this.handleCloseModel.bind(this)}
                footer={clickAdd ? addModalFooter : editModalFooter}>
                <Form layout="vertical">
                    <FormItem label="Name">
                        {getFieldDecorator('name', {
                            initialValue: permission.name,
                            rules: [{ required: true, message: 'Please input the permission name!' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PermissionModal);