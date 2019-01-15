import React, { Component } from 'react';
import { Form, Input, Button, Card, Spin, Modal } from 'antd';
import { getUser, resetPasswordUser } from '../helpers/AdminController'

const confirm = Modal.confirm;
const FormItem = Form.Item;

class ResetPassword extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            loading: false,
            page_loading: true
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.showUser();
        this.props.toggleSideBar(true);
        this.props.pageTitle('Reset Password');
        this.props.pageDescription('You can reset your password here.');
        this.props.pageBreadCrumb1(null);
        this.props.pageHelmet('Reset Password');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showUser() {
        var access_token = sessionStorage.getItem('access_token');
        getUser(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ user: result.data, page_loading: false });   
                }
            })
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
                        confirm({
                            title: 'Success',
                            content: 'You have sucessfully reset you password.'
                        });
                        form.resetFields();
                    }
                })
        });
    }

    render() {
        const { loading, user, page_loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 10 },
            },
        };
      
        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 7 },
            },
        };

        return (
            <Card className="margin-20">
                <Spin spinning={page_loading} size="large">
                    <Form>
                        <FormItem label="Name" {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: user.name,
                            })(
                                <Input disabled />
                            )}
                        </FormItem>

                        <FormItem label="Username" {...formItemLayout}>
                            {getFieldDecorator('username', {
                                initialValue: user.username,
                            })(
                                <Input disabled />
                            )}
                        </FormItem>

                        <FormItem label="Current Password" {...formItemLayout}>
                            {getFieldDecorator('current_password', {
                                rules: [{
                                    required: true,
                                    message: 'Please input the current password!'
                                }]
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>

                        <FormItem label="Password" {...formItemLayout}>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true,
                                    message: 'Please input the new password!'
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>

                        <FormItem label="Confirm Password" {...formItemLayout}>
                            {getFieldDecorator('password_confirmation', {
                                rules: [{
                                    required: true,
                                    message: 'Please confirm your new password!'
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>

                        <FormItem {...submitFormLayout} className="margin-bottom-0">
                            <Button loading={loading} type="primary" onClick={() => this.handleSubmit()}>
                                Save
                            </Button>
                        </FormItem>
                    </Form>
                </Spin>
            </Card>
        );
    }
}

export default Form.create()(ResetPassword);