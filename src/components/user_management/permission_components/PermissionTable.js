import React, { Component } from 'react';
import { Table } from 'antd';

import { listPermission } from '../../../helpers/AdminController';

const { Column } = Table;

class PermissionTable extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            required: ['admin-tasks'],
            allowed: [],
            permissions: []
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.showListPermission();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showListPermission() {
        var access_token = sessionStorage.getItem('access_token');

        listPermission(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if (this._isMounted) this.setState({ permissions: result.data });
                }
            })
    }
    
    render() {
        const { permissions } = this.state;

        return (
            <Table
                bordered
                className="trigger"
                dataSource={permissions}
                rowKey={permissions => permissions.id}
                pagination={{ hideOnSinglePage: true, pageSize: 30 }}
                onRow={(record) => {
                    return {
                        onClick: () => {this.props.onClickExistingPermission(record)}
                    };
                }}>
                <Column title="Permission Name" dataIndex="name" key="name" />
                <Column title="value" dataIndex="value" key="value" />
            </Table>
        );
    }
}

export default PermissionTable;