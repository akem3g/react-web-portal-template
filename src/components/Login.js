import React, { Component } from 'react';
import { Form, Icon, Input, Button, Spin } from 'antd';
import { login, verify } from '../helpers/Auth';
import { Redirect } from 'react-router-dom';

const FormItem = Form.Item;

class Login extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.toggleSideBar(false);
        this.props.pageHelmet('Login');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });
            login(values.username, values.password)
                .then(access_token => {
                    if (access_token) {
                        verify(access_token)
                            .then(result => {
                                if(this._isMounted) this.setState({ loading: false });
                                this.props.doLogin(true);
                            })
                    }
                })
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.state;
        var access_token = sessionStorage.getItem('access_token');

        if (access_token) {
            return (
                <Redirect to={{ pathname: '/menu-management' }} />
            );
        }
        else {
            return (
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem className="margin-bottom-0">
                            <span className="title-bold">Login</span>
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" className="icon-login-color" />} placeholder="Username" />
                            )}
                        </FormItem>
    
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your password!' }],
                            })(
                                <Input prefix={<Icon type="lock" className="icon-login-color" />} type="password" placeholder="Password" />
                            )}
                        </FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form>
                </Spin>
            );
        }
    }
}

export default Form.create()(Login);