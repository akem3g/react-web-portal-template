import React, { Component } from 'react';
import { createMenu, listRole, createSubMenu, listMenu, listSubMenu, updateMenu, deleteMenu, deleteSubMenu, updateSubMenu } from '../../helpers/AdminController';
import { Table, Button, Modal, Form, Input, Checkbox, Select, Icon, Radio, Spin } from 'antd';
import { checkAccess } from '../../helpers/PermissionController';
import Exception403 from '../../errors/Exception403';

const { Column } = Table;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ManageMenu extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            required: ['admin-tasks'],
            allowed: [],
            roles: [],
            menus: [],
            submenus: [],
            visibleMenu: false,
            visibleSubMenu: false,
            clickAdd: false,
            loading: false,
            delete_loading: false,
            page_loading: true
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getPermissions();
        this.loadPage();
        this.props.toggleSideBar(true);
        this.props.pageTitle('Menu Management');
        this.props.pageDescription("You can create and configure the menu and submenu here. You can assign the roles and permissions for the menu and submenu based on the user's authorization.");
        this.props.pageBreadCrumb1(null);
        this.props.pageHelmet('Manage Menu');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getPermissions() {
        var access_token = sessionStorage.getItem('access_token');
        const { required } = this.state;

        checkAccess(required, access_token)
            .then(result => (this._isMounted === true) ? this.setState({ allowed : result }, () => this.setState({ page_loading: false })) : null);
    }

    loadPage() {
        this.showListRole();
        this.showListMenu();
        this.showListSubMenu();
    }

    showListRole() {
        var access_token = sessionStorage.getItem('access_token');

        listRole(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ roles: result.data });
                }
            })
    }

    showListMenu() {
        var access_token = sessionStorage.getItem('access_token');

        listMenu(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ menus: result.data });
                }
            })
    }

    showListSubMenu() {
        var access_token = sessionStorage.getItem('access_token');

        listSubMenu(access_token)
            .then(result => {
                if (result.result === 'GOOD') {
                    if(this._isMounted) this.setState({ submenus: result.data });
                }
            })
    }

    showAddMenuModal = () => {
        if(this._isMounted) this.setState({ visibleMenu: true, clickAdd: true });
    }

    showEditMenuModal = () => {
        if(this._isMounted) this.setState({ visibleMenu: true });
    }

    handleMenuCancel = () => {
        const form = this.props.form;
        form.resetFields();
        if(this._isMounted) this.setState({ visibleMenu: false }, () => this.setState({ clickAdd: false }));
    }

    handleMenuCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            if(this._isMounted) this.setState({ loading: true });

            createMenu(values.name, values.slug, values.icon, values.order, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        if(this._isMounted) this.setState({ visibleMenu: false, clickAdd: false, loading: false });
                        this.loadPage();
                        this.props.reloadMenu();
                    }
                })
        });
    }

    handleMenuEdit = (menu_id) => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });

            updateMenu(menu_id, values.name, values.slug, values.icon, values.order, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        if(this._isMounted) this.setState({ visibleMenu: false, clickAdd: false, loading: false });
                        this.loadPage();
                        this.props.reloadMenu();
                    }
                })
        });
    }

    handleMenuDelete = (menu_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Menu',
            content: 'Are you sure you want to delete this menu?',
            onOk: () => {
                if(this._isMounted) this.setState({ delete_loading: true });
                deleteMenu(menu_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            if(this._isMounted) this.setState({ delete_loading: false });
                            this.handleMenuCancel();
                            this.loadPage();
                            this.props.reloadMenu();
                        }
                    })
            }
        })
    }

    onChangeNewMenu = () => {
        if(this._isMounted) this.setState({
            menu: {
                name: '',
                order: ''
            }
        }, () => this.showAddMenuModal());
    }

    showAddSubMenuModal = () => {
        if(this._isMounted) this.setState({ visibleSubMenu: true, clickAdd: true });
    }

    showEditSubMenuModal = () => {
        if(this._isMounted) this.setState({ visibleSubMenu: true });
    }

    handleSubMenuCancel = () => {
        const form = this.props.form;
        form.resetFields();
        if(this._isMounted) this.setState({ visibleSubMenu: false }, () => this.setState({ clickAdd: false }));
    }

    handleSubMenuCreate = () => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;

        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            
            if(this._isMounted) this.setState({ loading: true });

            createSubMenu(values.select_menu, values.name, values.slug, values.icon, values.order, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        if(this._isMounted) this.setState({ visibleSubMenu: false, clickAdd: false, loading: false });
                        this.loadPage();
                        this.props.reloadMenu();
                    }
                })
        });
    }

    handleSubMenuEdit = (submenu_id) => {
        var access_token = sessionStorage.getItem('access_token');
        const form = this.props.form;
        
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            if(this._isMounted) this.setState({ loading: true });

            updateSubMenu(submenu_id, values.select_menu, values.name, values.slug, values.icon, values.order, values.role, access_token)
                .then(result => {
                    if (result.result === 'GOOD') {
                        form.resetFields();
                        if(this._isMounted) this.setState({ visibleSubMenu: false, clickAdd: false, loading: false });
                        this.loadPage();
                        this.props.reloadMenu();
                    }
                })
        });
    }

    handleSubMenuDelete = (submenu_id) => {
        var access_token = sessionStorage.getItem('access_token');
        
        confirm({
            title: 'Delete Sub Menu',
            content: 'Are you sure you want to delete this sub menu?',
            onOk: () => {
                if(this._isMounted) this.setState({ delete_loading: true });
                deleteSubMenu(submenu_id, access_token)
                    .then(result => {
                        if (result.result === 'GOOD') {
                            if(this._isMounted) this.setState({ delete_loading: false });
                            this.handleSubMenuCancel();
                            this.loadPage();
                            this.props.reloadMenu();
                        }
                    })
            }
        })
    }

    onChangeNewSubMenu = () => {
        if(this._isMounted) this.setState({
            submenu: {
                menu_id: '',
                name: '',
                order: ''
            }
        }, () => this.showAddSubMenuModal());
    }

    render() {
        const { visibleMenu, visibleSubMenu, clickAdd, roles, menus, menu, submenus, submenu, menu_id, submenu_id, footer_role_id, loading, delete_loading, allowed, page_loading } = this.state;
        const { getFieldDecorator } = this.props.form;

        let addMenuModalFooter =
            <div>
                <Button loading={loading} type="primary" onClick={this.handleMenuCreate}>Create</Button>
            </div>

        let editMenuModalFooter =
            <div>
                <Button loading={delete_loading} type="danger" onClick={() => this.handleMenuDelete(menu_id)}>Delete</Button>
                <Button loading={loading} type="primary" onClick={() => this.handleMenuEdit(menu_id)}>Save</Button>
            </div>

        let addSubMenuModalFooter =
            <div>
                <Button loading={loading} type="primary" onClick={this.handleSubMenuCreate}>Create</Button>
            </div>

        let editSubMenuModalFooter =
            <div>
                <Button loading={delete_loading} type="danger" onClick={() => this.handleSubMenuDelete(submenu_id)}>Delete</Button>
                <Button loading={loading} type="primary" onClick={() => this.handleSubMenuEdit(submenu_id)}>Save</Button>
            </div>

        const iconOptions = [
            { label: <Icon className="icon-padding" type="user" />, value: 'user' },
            { label: <Icon className="icon-padding" type="team" />, value: 'team' },
            { label: <Icon className="icon-padding" type="crown" />, value: 'crown' },
            { label: <Icon className="icon-padding" type="menu-unfold" />, value: 'menu-unfold' },
            { label: <Icon className="icon-padding" type="bars" />, value: 'bars' },
            { label: <Icon className="icon-padding" type="form" />, value: 'form' },
            { label: <Icon className="icon-padding" type="copy" />, value: 'copy' },
            { label: <Icon className="icon-padding" type="area-chart" />, value: 'area-chart' },
            { label: <Icon className="icon-padding" type="pie-chart" />, value: 'pie-chart' },
            { label: <Icon className="icon-padding" type="bar-chart" />, value: 'bar-chart' },
            { label: <Icon className="icon-padding" type="line-chart" />, value: 'line-chart' },
            { label: <Icon className="icon-padding" type="stock" />, value: 'stock' },
            { label: <Icon className="icon-padding" type="fund" />, value: 'fund' },
            { label: <Icon className="icon-padding" type="sliders" />, value: 'sliders' },
            { label: <Icon className="icon-padding" type="lock" />, value: 'lock' },
            { label: <Icon className="icon-padding" type="unlock" />, value: 'unlock' },
            { label: <Icon className="icon-padding" type="book" />, value: 'book' },
            { label: <Icon className="icon-padding" type="calendar" />, value: 'calendar' },
            { label: <Icon className="icon-padding" type="code" />, value: 'code' },
            { label: <Icon className="icon-padding" type="desktop" />, value: 'desktop' },
            { label: <Icon className="icon-padding" type="download" />, value: 'download' },
            { label: <Icon className="icon-padding" type="file" />, value: 'file' },
            { label: <Icon className="icon-padding" type="file-pdf" />, value: 'file-pdf' },
            { label: <Icon className="icon-padding" type="file-word" />, value: 'file-word' },
            { label: <Icon className="icon-padding" type="file-excel" />, value: 'file-excel' },
            { label: <Icon className="icon-padding" type="file-jpg" />, value: 'file-jpg' },
            { label: <Icon className="icon-padding" type="folder" />, value: 'folder' },
            { label: <Icon className="icon-padding" type="folder-open" />, value: 'folder-open' },
            { label: <Icon className="icon-padding" type="folder-add" />, value: 'folder-add' },
            { label: <Icon className="icon-padding" type="hdd" />, value: 'hdd' },
            { label: <Icon className="icon-padding" type="smile" />, value: 'smile' },
            { label: <Icon className="icon-padding" type="inbox" />, value: 'inbox' },
            { label: <Icon className="icon-padding" type="mobile" />, value: 'mobile' },
            { label: <Icon className="icon-padding" type="notification" />, value: 'notification' },
            { label: <Icon className="icon-padding" type="search" />, value: 'search' },
            { label: <Icon className="icon-padding" type="setting" />, value: 'setting' },
            { label: <Icon className="icon-padding" type="shopping-cart" />, value: 'shopping-cart' },
            { label: <Icon className="icon-padding" type="tag" />, value: 'tag' },
            { label: <Icon className="icon-padding" type="tags" />, value: 'tags' },
            { label: <Icon className="icon-padding" type="upload" />, value: 'upload' },
            { label: <Icon className="icon-padding" type="home" />, value: 'home' },
            { label: <Icon className="icon-padding" type="environment" />, value: 'environment' },
            { label: <Icon className="icon-padding" type="save" />, value: 'save' },
            { label: <Icon className="icon-padding" type="solution" />, value: 'solution' },
            { label: <Icon className="icon-padding" type="exception" />, value: 'exception' },
            { label: <Icon className="icon-padding" type="customer-service" />, value: 'customer-service' },
            { label: <Icon className="icon-padding" type="database" />, value: 'database' },
            { label: <Icon className="icon-padding" type="layout" />, value: 'layout' },
            { label: <Icon className="icon-padding" type="tool" />, value: 'tool' },
            { label: <Icon className="icon-padding" type="schedule" />, value: 'schedule' },
            { label: <Icon className="icon-padding" type="shop" />, value: 'shop' },
            { label: <Icon className="icon-padding" type="gift" />, value: 'gift' },
            { label: <Icon className="icon-padding" type="idcard" />, value: 'idcard' },
            { label: <Icon className="icon-padding" type="safety" />, value: 'safety' },
            { label: <Icon className="icon-padding" type="shake" />, value: 'shake' },
            { label: <Icon className="icon-padding" type="api" />, value: 'api' },
            { label: <Icon className="icon-padding-last" type="read" />, value: 'read' },
            { label: <Icon className="icon-padding-last" type="reconciliation" />, value: 'reconciliation' },
            { label: <Icon className="icon-padding-last" type="security-scan" />, value: 'security-scan' },
            { label: <Icon className="icon-padding-last" type="safety-certificate" />, value: 'safety-certificate' },
            { label: <Icon className="icon-padding-last" type="file-done" />, value: 'file-done' },
            { label: <Icon className="icon-padding-last" type="file-protect" />, value: 'file-protect' },
            { label: <Icon className="icon-padding-last" type="file-search" />, value: 'file-search' },
            { label: <Icon className="icon-padding-last" type="file-sync" />, value: 'file-sync' }
        ];

        if (allowed.includes('admin-tasks') || page_loading) {
            return (
                <Spin spinning={page_loading} size="large">
                    <div className="padding-30">
                        <Button
                            className="margin-bottom-15"
                            onClick={this.onChangeNewMenu}
                            type="primary"
                            icon="folder">
                            New Menu
                        </Button>

                        <Table
                            bordered
                            className="trigger"
                            dataSource={menus}
                            rowKey={menus => menus.id}
                            pagination={{ hideOnSinglePage: true, pageSize: 30 }}
                            onRow={(record) => {
                                return {
                                    onClick: () => {if(this._isMounted) this.setState({ menu: Object.assign({}, record), menu_id: record.id, footer_role_id: record.roles_id }, this.showEditMenuModal)}
                                };
                            }}>
                            <Column title="Order" dataIndex="order" key="order" />
                            <Column
                                title="Icon"
                                key="icon"
                                render={(record =>
                                    <Icon type={record.icon} />
                                )} />
                            <Column title="Menu" dataIndex="name" key="name" />
                            <Column
                                title="Role"
                                key="roles_name"
                                render={(record =>
                                    <span>{record.roles_name.join(', ')}</span>
                                )} />
                        </Table>

                        <Modal
                            visible={visibleMenu}
                            title={clickAdd ? "Create New Menu" : "Edit Menu"}
                            onCancel={this.handleMenuCancel}
                            footer={clickAdd ? addMenuModalFooter : footer_role_id === 1 ? null : editMenuModalFooter}>
                            {menu && <Form layout="vertical">
                                <FormItem label="Name">
                                    {getFieldDecorator('name', {
                                        initialValue: menu.name,
                                        rules: [{ required: true, message: 'Please input the menu name!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                                <FormItem label="Slug">
                                    {getFieldDecorator('slug', {
                                        initialValue: menu.slug,
                                        rules: [{ required: true, message: 'Please input the slug!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                                <FormItem label="Order">
                                    {getFieldDecorator('order', {
                                        initialValue: menu.order,
                                        rules: [{ required: true, message: 'Please input the order number!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                                <FormItem label="Icon">
                                    {getFieldDecorator('icon', {
                                        initialValue: menu.icon,
                                        rules: [{ required: true, message: 'Please choose the icon!' }]
                                    })(
                                        <RadioGroup options={iconOptions} />
                                    )}
                                </FormItem>

                                <FormItem label="Role">
                                    {getFieldDecorator('role', {
                                        initialValue: menu.roles_id,
                                        rules: [{ required: true, message: 'Please check the roles!' }]
                                    })(
                                        <CheckboxGroup>
                                            {roles.map((role) =>
                                                <Checkbox className="ant-checkbox-group-item" key={role.id} value={role.id}>{role.name}</Checkbox>
                                            )}
                                        </CheckboxGroup>
                                    )}
                                </FormItem>
                            </Form>}
                        </Modal>
                    </div>

                    <div className="padding-30">
                        <Button
                            className="margin-bottom-15"
                            onClick={this.onChangeNewSubMenu}
                            type="primary"
                            icon="folder-open">
                            New Sub Menu
                        </Button>

                        <Table
                            bordered
                            className="trigger"
                            dataSource={submenus}
                            rowKey={submenus => submenus.id}
                            pagination={{ hideOnSinglePage: true, pageSize: 30 }}
                            onRow={(record) => {
                                return {
                                    onClick: () => {if(this._isMounted) this.setState({ submenu: Object.assign({}, record), submenu_id: record.id, footer_role_id: record.roles_id }, this.showEditSubMenuModal)}
                                };
                            }}>
                            <Column title="Order" dataIndex="order" key="order" />
                            <Column
                                title="Icon"
                                key="icon"
                                render={(record =>
                                    <Icon type={record.icon} />
                                )} />
                            <Column title="Sub Menu" dataIndex="name" key="name" />
                            <Column title="Menu" dataIndex="menu" key="menu" />
                            <Column
                                title="Role"
                                key="roles_name"
                                render={(record =>
                                    <span>{record.roles_name.join(', ')}</span>
                                )} />
                        </Table>

                        <Modal
                            visible={visibleSubMenu}
                            title={clickAdd ? "Create New Sub Menu" : "Edit Sub Menu"}
                            onCancel={this.handleSubMenuCancel}
                            footer={clickAdd ? addSubMenuModalFooter : footer_role_id === 1 ? null : editSubMenuModalFooter}>
                            {submenu && <Form layout="vertical">
                                <FormItem label="Select Menu">
                                    {getFieldDecorator('select_menu', {
                                        initialValue: submenu.menu_id,
                                        rules: [{ required: true, message: 'Please select the menu!' }]
                                    })(
                                        <Select>
                                            {menus.map((menu) =>
                                                <Option key={menu.id} value={menu.id}>{menu.name}</Option>
                                            )}
                                        </Select>
                                    )}
                                </FormItem>

                                <FormItem label="Name">
                                    {getFieldDecorator('name', {
                                        initialValue: submenu.name,
                                        rules: [{ required: true, message: 'Please input the menu name!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                                <FormItem label="Slug">
                                    {getFieldDecorator('slug', {
                                        initialValue: submenu.slug,
                                        rules: [{ required: true, message: 'Please input the slug!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                                <FormItem label="Order">
                                    {getFieldDecorator('order', {
                                        initialValue: submenu.order,
                                        rules: [{ required: true, message: 'Please input the order number!' }]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                                <FormItem label="Icon">
                                    {getFieldDecorator('icon', {
                                        initialValue: submenu.icon,
                                        rules: [{ required: true, message: 'Please choose the icon!' }]
                                    })(
                                        <RadioGroup options={iconOptions} />
                                    )}
                                </FormItem>

                                <FormItem label="Role">
                                    {getFieldDecorator('role', {
                                        initialValue: submenu.roles_id,
                                        rules: [{ required: true, message: 'Please check the roles!' }]
                                    })(
                                        <CheckboxGroup>
                                            {roles.map((role) =>
                                                <Checkbox className="ant-checkbox-group-item" key={role.id} value={role.id}>{role.name}</Checkbox>
                                            )}
                                        </CheckboxGroup>
                                    )}
                                </FormItem>
                            </Form>}
                        </Modal>
                    </div>
                </Spin>
            );
        }
        else {
            return (
                <Exception403 />
            );
        }
    }
}

export default Form.create()(ManageMenu);