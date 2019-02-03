import React, { Component } from 'react';
import { Upload, Button, Icon, message, Avatar } from 'antd';

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
        const { user } = this.props;
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
                    currentComponent.props.reloadUser();
                }
                else if (info.file.status === 'error') {
                    currentComponent.setState({ loading: false });
                    message.error('Image upload failed.');
                }
            },
        };

        return (
            <div className="margin-left-20 margin-right-20">
                <div className="padding-bottom-30">
                    <h1 className="margin-bottom-0">Profile Image</h1>
                    <span>To ensure the image is fit correctly, please upload an image with 1 by 1 size.</span>
                </div>

                <div className="padding-bottom-30">
                    {user.image ?
                        <Avatar shape="square" size={250} src={global.URL + "storage/" + user.id + "/" + user.image} />
                    :
                        <Avatar shape="square" size={250} icon="user" />
                    }
                </div>
                
                <Upload {...props}>
                    <Button type="primary" disabled={loading ? true : false}>
                        <Icon type="upload" /> Click to Upload
                    </Button>
                </Upload>
            </div>
        )
    }
}

export default ProfileImage;