import React, { Component } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { updateAccount } from '../../../helpers/AccountController';

const success = Modal.success;
const FormItem = Form.Item;

class UserInformation extends Component {
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

    handleSubmit() {
        const form = this.props.form;
        var access_token = sessionStorage.getItem('access_token');

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            if (this._isMounted) this.setState({ loading: true });

            updateAccount(values.name, values.username, values.email, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        if (this._isMounted) this.setState({ loading: false });
                        success({
                            title: 'Success',
                            content: 'You have sucessfully updated your account.'
                        });

                        this.props.reloadUser();
                        sessionStorage.setItem('name', values.name);
                    }
                })
        });
    }

    render() {
        const { loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { user } = this.props;

        return (
            <div className="margin-left-20 margin-right-20">
                <h1>User Information</h1>

                <Form>
                    <FormItem label="Name">
                        {getFieldDecorator('name', {
                            initialValue: user.name,
                            rules: [{ required: true, message: 'Please input the name!'}]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem label="Username">
                        {getFieldDecorator('username', {
                            initialValue: user.username,
                            rules: [{ required: true, message: 'Please input the username!' }]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem label="Email">
                        {getFieldDecorator('email', {
                            initialValue: user.email,
                            rules: [{ required: true, message: 'Please input the email!' }]
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem className="margin-bottom-0">
                        <Button loading={loading} type="primary" onClick={this.handleSubmit.bind(this)}>
                            Update Information
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(UserInformation);