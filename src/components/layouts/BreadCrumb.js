import React, { Component } from 'react';
import { Breadcrumb, Card } from 'antd';

class BreadCrumb extends Component {
    render() {
        return (
            <Card className="content-header">
                <Breadcrumb className="padding-bottom-20">
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    {this.props.page_breadcrumb_1 ? <Breadcrumb.Item>{this.props.page_breadcrumb_1}</Breadcrumb.Item> : null}
                    <Breadcrumb.Item>{this.props.page_title}</Breadcrumb.Item>
                </Breadcrumb>
                <h2 className="title-bold">{this.props.page_title}</h2>
                <span>{this.props.page_description}</span>
            </Card>
        );
    }
}

export default BreadCrumb;