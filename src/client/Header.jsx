import React, {Fragment} from "react";
import {Link, withRouter } from "react-router-dom";

export class Header extends React.Component {
    constructor(props) {
        super(props);

    };


    doLogout = async () => {
        const url = "/api/logout";

        let response;

        try {
            response = await fetch(url, {method: "post"});
        } catch (err) {
            alert("Failed to connect to server: " + err);
            return;
        }

        if (response.status !== 204) {
            alert("Error when connecting to server: status code " + response.status);
            return
        }
        this.props.history.push("/");
        this.props.updateLoggedInUser(null);
    };

    renderLoggedIn() {
        return (
            <React.Fragment>
                <div className={"header"}>
                    <div>
                        <Link className={"header-text"} to={"/"}>
                            All cards
                        </Link>
                        <Link className={"header-text"} to={"/collection"}>
                            Collection
                        </Link>
                        <Link className={"header-text"} to={"/packs"}>
                            Packs
                        </Link>
                        <button id="logout-btn" onClick={this.doLogout}>
                            Logout
                        </button>
                    </div>
                    {this.props.packNotification > 1 && <p>You've received {this.props.packNotification} new packs from airdrops!</p>}
                    {this.props.packNotification === 1 && <p>You've received {this.props.packNotification} new pack from airdrops!</p>}
                    <div className={"header-user-info-container"}>
                        <p className={"header-user-info"}>Welcome {this.props.user.id}!</p>
                        <p className={"header-user-info"}>Gold: {this.props.userDetails.gold !== null ? this.props.userDetails.gold : "Error"}</p>
                        <p className={"header-user-info"}>Card count: {this.props.userDetails.totalCards !== null ? this.props.userDetails.totalCards : "Error"}</p>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    renderNotLoggedIn() {
        return (
            <React.Fragment>
                <Link className={"header-text"} to={"/"}>
                    All cards
                </Link>
                <Link className={"header-text"} to={"/login"}>
                    Log in
                </Link>
                <Link className={"header-text"} to={"/register"}>
                    Register
                </Link>
            </React.Fragment>
        )
    }

    render() {

        let content;

        if(!this.props.user) {
            content = this.renderNotLoggedIn();
        } else content = this.renderLoggedIn(this.props.user.id);

        return (
            <div className="header-wrapper">
                Hearthstone Pack Simulator
                <br/>
                {content}
            </div>
        )
    }
}

export default withRouter(Header);