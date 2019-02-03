import React, { Component } from 'react';
import { Breadcrumb, Card } from 'antd';

class BreadCrumb extends Component {
    render() {
        const props = this.props;

        return (
            <Card className="content-header">
                <Breadcrumb className="padding-bottom-20">
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    {props.page_breadcrumb_1 ? <Breadcrumb.Item>{props.page_breadcrumb_1}</Breadcrumb.Item> : null}
                    <Breadcrumb.Item>{props.page_title}</Breadcrumb.Item>
                </Breadcrumb>
                <h2 className="title-bold">{props.page_title}</h2>
                <span>{props.page_description}</span>
            </Card>
        );
    }
}

export default BreadCrumb;