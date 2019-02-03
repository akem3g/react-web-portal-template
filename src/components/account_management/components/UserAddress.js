import React, { Component } from 'react';
import { Card, Icon, Tooltip } from 'antd';

class UserAddress extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="margin-left-20 margin-right-20">
                <h1>User Address</h1>

                <Card
                    title="Home"
                    style={{ width: 400 }}
                    actions={[
                        <Tooltip title="Delete">
                            <Icon type="delete" />
                        </Tooltip>,
                        <Tooltip title="Edit">
                            <Icon type="edit" />
                        </Tooltip>]}>
                    <p>Muhammad Hakiim bin Muhammad Mislam</p>
                    <p>No 42 Jalan 4/3</p>
                    <p>Seksyen 4</p>
                    <p>43650 Bandar Baru Bangi</p>
                    <p>Selangor</p>
                    <p>Malaysia</p>
                </Card>
          </div>
        );
    }
}

export default UserAddress;