import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';

class ProfileImage extends Component {
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

    render() {
        var access_token = sessionStorage.getItem('access_token');
        const { loading } = this.state;
        const currentComponent = this;

        const props = {
            name: 'image',
            action: global.URL + 'api/account/upload/image',
            headers: {
                authorization: 'Bearer ' + access_token,
            },
            onChange(info) {
                currentComponent.setState({ loading: true });

                if (info.file.status === 'done') {
                    currentComponent.setState({ loading: false });
                    message.success('Image uploaded successfully.');
                }
                else if (info.file.status === 'error') {
                    currentComponent.setState({ loading: false });
                    message.error('Image upload failed.');
                }
            },
        };

        return (
            <div className="margin-left-20 margin-right-20">
                <h1>Profile Image</h1>

                <Upload {...props}>
                    <Button disabled={loading ? true : false}>
                        <Icon type="upload" /> Click to Upload
                    </Button>
                </Upload>
            </div>
        )
    }
}

export default ProfileImage;