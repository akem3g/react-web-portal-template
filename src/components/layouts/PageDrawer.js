import React, { Component } from 'react';
import { Drawer, Row, Col, Divider } from 'antd';

class PageDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ visible: nextProps.openDrawer });
    }

    onClose() {
        this.setState({ visible: false });
        this.props.closeDrawer();
    };

    render() {
        const pStyle = {
            fontSize: 16,
            color: 'rgba(0,0,0,0.85)',
            lineHeight: '24px',
            display: 'block',
            marginBottom: 16,
        };
          
        const DescriptionItem = ({ title, content }) => (
            <div
                style={{
                fontSize: 14,
                lineHeight: '22px',
                marginBottom: 7,
                color: 'rgba(0,0,0,0.65)',
                }}>
                <p
                    style={{
                    marginRight: 8,
                    display: 'inline-block',
                    color: 'rgba(0,0,0,0.85)',
                    }}>
                {title}:
                </p>
                {content}
            </div>
        );

        return (
            <Drawer
                width={460}
                placement="right"
                closable={false}
                onClose={this.onClose.bind(this)}
                visible={this.state.visible}>
                <h2>Account Overview</h2>
                <p style={pStyle}>Personal</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Name" content="Admin" />
                    </Col>
                </Row>
                <Divider />
                <p style={pStyle}>Address</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Street" content="No 42 Jalan 4/3" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="City" content="Bandar Baru Bangi" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Postcode" content="43650" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="State" content="Selangor" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Country" content="Malaysia" />
                    </Col>
                </Row>
                <Divider />
                <p style={pStyle}>Contacts</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Email" content="admin@gmail.com" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Phone Number" content="+60136722231" />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem
                            title="Github"
                            content={(
                            <a href="http://github.com/ant-design/ant-design/">
                                github.com/ant-design/ant-design/
                            </a>
                            )} />
                    </Col>
                </Row>
            </Drawer>
        );
    }
}

export default PageDrawer;