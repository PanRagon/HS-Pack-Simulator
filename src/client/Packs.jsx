import React from "react";
import {PropTypes} from "react";
import {Link, withRouter} from "react-router-dom";

export class Packs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            newCards: []
        };
    }

    componentDidMount() {
        this.props.getUserDetails();
        if(this.props.packNotification > 0) {
            this.props.silencePackNotification()
        }
    }

    componentDidUpdate() {
        if(this.props.packNotification > 0) {
            this.props.silencePackNotification()
        }
    }

    openPack = async () => {
        const url = `/api/packs/${this.props.user.id}/open`;
        let response;

        try {
            response = await fetch(url, {
                method: "put",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (err) {
            this.setState({error: "Failed to connect to server: " + err});
            return;
        }
        if (response.status === 404) {
            this.setState({
                error: "User not found"
            });
            return;
        }
        if (response.status === 400) {
            this.setState({
                error: "You have no packs to open"
            });
            return;
        }

        if (response.status !== 200) {
            this.setState({
                error: "Error when connecting to server: status code " + response.status
            });
            return;
        }

        let stream = await response.json();
        this.props.getUserDetails();
        this.setState({error: null, newCards: stream});
    };

    buyPack = async () => {
        const url = `/api/packs/${this.props.user.id}/buy`;
        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        } catch (err) {
            this.setState({error: "Failed to connect to server: " + err});
            return;
        }
        if (response.status === 404) {
            this.setState({
                error: "User not found"
            });
            return;
        }

        if (response.status !== 200) {
            this.setState({
                error: "Error when connecting to server: status code " + response.status
            });
            return;
        }
        this.props.getUserDetails();
        this.setState({error: null});
    };

    render() {
        if(!this.props.user) {
            return(<p>You need to login to see your packs!</p>)
        }

        let error = this.state.error ? this.state.error : null;

        return (
            <div>
                <div className={"packs-containers"}>
                    <div>
                        <h4>Your packs: {this.props.userDetails.packs}</h4>
                        <button id="open-btn" disabled={this.props.userDetails.packs === 0} onClick={this.openPack}>Open one!</button>
                    </div>
                    <div>
                        <h4>Buy additional packs</h4>
                        <button disabled={this.props.userDetails.gold < 100} onClick={this.buyPack}>100 Gold</button>
                    </div>
                </div>
                <div className={"packs-containers"}>
                    {this.state.newCards.length !== 0 &&
                    <h4>New Cards:</h4>}
                    {this.state.newCards.map((value, index) => {
                        return <img key={index} src={`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${value.dbfId}.png`}/>
                    })}
                    {error}
                </div>
            </div>

        );
    }
}

export default withRouter(Packs);