import React, {Component} from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch, Redirect
} from 'react-router-dom';

import {getCurrentUser} from '../util/APIUtils';
import {ACCESS_TOKEN} from '../constants';

import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import Bucket from '../user/bucket/Bucket';
import NotFound from '../common/NotFound';
import Catalogue from '../catalogue/Catalogue';
import LoadingIndicator from '../common/LoadingIndicator';

import {Layout, notification} from 'antd';
import Offers from "../offers/Offers";
import Good from "../catalogue/Good";
import OfferPage from "../offers/OfferPage";

const {Content} = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    componentDidMount() {
        this.loadCurrentUser();
    }

    handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        notification[notificationType]({
            message: 'AskLion',
            description: description,
        });
    }

    handleLogin() {
        notification.success({
            message: 'AskLion',
            description: "You're successfully logged in.",
        });
        this.loadCurrentUser();
        this.props.history.push("/");
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                           currentUser={this.state.currentUser}
                           onLogout={this.handleLogout}/>
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route path="/login"
                                   render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                            <Route path="/signup" component={Signup}/>
                            <Route path="/users/:username/profile"
                                   render={(props) => <Profile isAuthenticated={this.state.isAuthenticated}
                                                               currentUser={this.state.currentUser} {...props}  />}>
                            </Route>
                            <Route path="/users/:username"
                                   render={(props) => <Profile {...props}  />}>
                            </Route>
                            <Route path="/shopBucket"
                                   render={(props) => <Bucket currentUser={this.state.currentUser} {...props}    />}>
                            </Route>
                            <Route path="/catalogue"
                                   render={(props) => <Catalogue currentUser={this.state.currentUser} {...props}    />}>
                            </Route>
                            <Route path="/offers"
                                   render={(props) => <Offers  {...props} />}>
                            </Route>
                            <Route path="/good/:goodId"
                                   render={(props) => <Good currentUser={this.state.currentUser} {...props} />}>
                            </Route>
                            <Route path="/offer/:offerId"
                                   render={(props) => <OfferPage currentUser={this.state.currentUser} {...props} />}/>
                            <Route exact path="/"
                                   component={() => (<Redirect to="/catalogue"/>)}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);
