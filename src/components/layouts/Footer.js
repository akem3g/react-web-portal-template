import React, { Component } from 'react';
import { Layout, Icon, Tooltip } from 'antd';

class Footer extends Component {
    openGithub() {
        window.open('https://github.com/akem3g', '_blank');
    }

    openTwitter() {
        window.open('https://twitter.com/hakiimmislam', '_blank');
    }

    openFacebook() {
        window.open('https://facebook.com/hakiimmislam', '_blank');
    }

    render() {
        return (
            <Layout.Footer className="footer">
                <Tooltip title="github">
                    <Icon
                        type="github"
                        className="padding-right-10 icon-header-16 trigger"
                        onClick={this.openGithub.bind(this)} />
                </Tooltip>

                <Tooltip title="twitter">
                    <Icon
                        type="twitter"
                        className="padding-right-10 icon-header-16 trigger"
                        onClick={this.openTwitter.bind(this)} />
                </Tooltip>

                <Tooltip title="facebook">
                    <Icon
                        type="facebook"
                        className="padding-right-10 icon-header-16 trigger"
                        onClick={this.openFacebook.bind(this)} />
                </Tooltip>
                akem3g ©2019
            </Layout.Footer>  
        );
    }
}

export default Footer;