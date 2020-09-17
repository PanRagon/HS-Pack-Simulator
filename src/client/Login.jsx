//Login and Register components are  derived from Andrea's exercise solutions:
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/client/login.jsx

import React, {Fragment} from "react";
import {Link, withRouter } from "react-router-dom";

export class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            password: "",
            error: null
        };
    }

    onUsernameChange = event => {
        this.setState({id: event.target.value})
    };

    onPasswordChange = event => {
        this.setState({password: event.target.value});
    };



    doLogin = async () => {
        const {id, password} = this.state;

        const url = "/api/login";

        const payload = {id, password};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            this.setState({error: "Failed to connect to server: " + err});
            return;
        }

        if (response.status === 401) {
            this.setState({error: "Invalid username or password"});
            return;
        }

        if (response.status !== 204) {
            this.setState({ error: "Error when connecting to server: Status code " + response.status});
            return;
        }

        this.setState({error: null});
        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push("/");
    };

    render() {

        return (
            <div>
                <div>
                    <p>Username:</p>
                    <input
                        type="text"
                        id="username-input"
                        value={this.state.id}
                        onChange={this.onUsernameChange}
                    />
                </div>
                <div>
                    <p>Password:</p>
                    <input
                        id="password-input"
                        type="password"
                        value={this.state.password}
                        onChange={this.onPasswordChange}
                    />
                </div>

                {this.state.error}

                <button id="login-btn" className="button" onClick={this.doLogin}>
                    Log In
                </button>
            </div>
        )
    }
}

export default withRouter(Login);
