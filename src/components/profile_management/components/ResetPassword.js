import React, { Component } from 'react';
import { Form, Input, Button, Card, Modal } from 'antd';
import { resetPasswordUser } from '../../../helpers/AdminController';

const success = Modal.success;
const FormItem = Form.Item;

class ResetPassword extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
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

    handleSubmit() {
        const form = this.props.form;
        var access_token = sessionStorage.getItem('access_token');

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            this.setState({ loading: true });
            resetPasswordUser(values.current_password, values.password, values.password_confirmation, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        this.setState({ loading: false });
                        success({
                            title: 'Success',
                            content: 'You have sucessfully reset you password.'
                        });
                        form.resetFields();
                    }
                })
        });
    }

    render() {
        const { loading } = this.state;
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <h1>Reset Password</h1>

                <Form>
                    <FormItem label="Current Password">
                        {getFieldDecorator('current_password', {
                            rules: [{
                                required: true,
                                message: 'Please input the current password!'
                            }]
                        })(
                            <Input type="password" placeholder="Input your current password" />
                        )}
                    </FormItem>

                    <FormItem label="New Password">
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: 'Please input the new password!'
                            }, {
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input type="password" placeholder="Input your new password" />
                        )}
                    </FormItem>

                    <FormItem label="Confirm Password">
                        {getFieldDecorator('password_confirmation', {
                            rules: [{
                                required: true,
                                message: 'Please confirm your new password!'
                            }, {
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input type="password" placeholder="Confirm your new password" onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>

                    <FormItem className="margin-bottom-0">
                        <Button loading={loading} type="primary" onClick={() => this.handleSubmit()}>
                            Save
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(ResetPassword);