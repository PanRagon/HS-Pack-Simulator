//Login and Register components are  derived from Andrea's exercise solutions:
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/client/signup.jsx

import React from "react";
import {withRouter} from "react-router-dom";

export class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            password: "",
            confirmPassword: "",
            error: null,
        };
    }

    handleUpdateField = (e) => {
        const {value, name} = e.target;
        this.setState({ [name]: value })
    };

    handleUpdateName = (e) => {
        /*
        I was having some issues making certain API calls when using the user's ID in the URI. URIs are semantically not
        supposed to be case sensitive because URLs are not, and as such it can be unexpected for them to matter in the URIs.
        When I tried to remove them from the URIs I realized during testing that multiple users can share similar names that
        will conflict when turned to lowercase, I.E the user ANdrea was free to request Andrea's information from the server,
        because they matched if I made them to lower case. I didn't really have time to fix all of this as I detected it
        very late, but forcing usernames to be in lower cap is small sacrifice that's worth keeping the URIs in line with
        the naming convention, and not allowing users to have the same name with different capitalization, which is a recipe
        for disaster if the users later are allowed to interact with each other.

        TL;DR: I have finally realized why some services force users to use a specific casing in their names, and have
        a newfound respect for the developers that implemented this.
        */

        let value = e.target.value.toLowerCase();
        this.setState({id: value})
    };

    enforceLowerCase = (e) => {

        e.value = ("" + e.value).toLowerCase();
    };

    doRegister = async () => {
        const {id, password, confirm} = this.state;

        if (confirm !== password) {
            this.setState({error: "Passwords do not match"});
            return;
        }

        const url = "/api/register";

        const payload = {id, password};

        console.log("Got url");
        let response;

        try {
            console.log("In try");
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

        if (response.status === 400) {
            this.setState({ error: "Invalid username or password" });
            return;
        }

        if (response.status !== 201) {
            this.setState({
                error:
                    "Error when connecting to server: status code " + response.status
            });
            return;
        }
        console.log("Finish call");

        this.setState({error: null});
        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push("/");
    };

    render() {

        let error;
        if (this.state.error) {
            error = (
                <div className="errorMsg">
                    <p>{this.state.error}</p>
                </div>
            );
        }

        let confirmMsg = "Passwords match";
        if (this.state.confirm !== this.state.password) {
            confirmMsg = "Passwords not matching";
        }

        return (
            <div className="center">
                <div>
                    <p>Username:</p>
                    <input
                        type="text"
                        id={"username-input"}
                        value={this.state.id}
                        onInput={this.enforceLowerCase}
                        name="id"
                        onChange={this.handleUpdateName}
                    />
                </div>
                <div>
                    <p>Password:</p>
                    <input
                        id={"password-input"}
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleUpdateField}
                    />
                </div>
                <div>
                    <p>Confirm:</p>
                    <input
                        id={"confirm-input"}
                        type="password"
                        name="confirm"
                        value={this.state.confirm}
                        onChange={this.handleUpdateField}
                    />
                    <div>{confirmMsg}</div>
                </div>
                {error}
                <button id="register-btn" className="button" onClick={this.doRegister}>
                    Sign Up
                </button>
            </div>
        )}
}

export default withRouter(Register);