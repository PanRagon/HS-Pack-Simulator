import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom';


import Home from "./Home";
import Header from "./Header";
import Login from "./Login";
import {Register} from "./Register";
import Collection from "./Collection";
import Packs from "./Packs";


class App extends React.Component {

    constructor(props) {
        super(props);

        this.silencePackNotification = this.silencePackNotification.bind(this);

        this.state = {
            user: null,
            cards: [],
            sets: [],
            userDetails: {
                id: null,
                gold: 0,
                packs: 0,
                totalCards: 0,
                collection: []
            },
            set: "Basic",
            class: "NEUTRAL",
            packNotification: 0
        };
    }

    componentDidMount() {
        this.getCards();
        this.fetchAndUpdateUserInfo();
        this.getSets();

        let protocol = "ws:";
        if (window.location.protocol.toLowerCase() === "https:") {
            protocol = "wss";
        }

        this.socket = new WebSocket(protocol + "//" + window.location.host);

        this.socket.onmessage = (event) => {
            if(!this.state.user) {
                return;
            }
            console.log(event.data);

            if(!event.data) {
                return;
            }

            this.receiveAirdrop();
            this.setState({packNotification: this.state.packNotification + 1});
        }
    }

    componentWillUnmount() {
        this.socket.close();
    }

    silencePackNotification(event) {
        console.log("Killing pack notifications");
        this.setState({packNotification: 0})
    }


    //The user authentication system is based on Andrea Arcuri's code from the exercise solutions of this subject
    //https://github.com/arcuri82/web_development_and_api_design/tree/master/exercise-solutions/quiz-game/part-10/src/client
    fetchAndUpdateUserInfo = async () => {

        const url = "/api/user";

        let response;

        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {
            this.setState({error: "Can't fetch User - Failed to connect to server: " + err});
            return;
        }

        if (response.status === 401) {
            this.updateLoggedInUser(null);
            return;
        }

        if (response.status !== 200) {
            this.setState({error: "Can't fetch user - Server responded with status code " + response.status})
        } else {
            const payload = await response.json();
            this.updateLoggedInUser(payload);
        }
    };

    updateLoggedInUser = (user) => {
        this.setState({user: user});
        this.getUserDetails();
    };

    receiveAirdrop = async () => {
        const url = `/api/packs/${this.state.user.id}/airdrop`;
        let response;
        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (err) {
            this.setState({error: "Can't post new packs - Failed to connect to server: " + err});
            return;
        }

        if (response.status !== 201) {
            this.setState({
                error:
                    "Can't post new packs - Server responded with status code " + response.status
            });
            return;
        }

        this.setState({error: null});
        this.getUserDetails();
    };

    getCards = async () => {
        const url = "/api/cards";
        let response;
        try {
            response = await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (err) {
            this.setState({error: "Can't fetch cards - Failed to connect to server: " + err});
            return;
        }

        if (response.status !== 200) {
            this.setState({
                error:
                    "Can't fetch cards - Server responded with status code " + response.status
            });
            return;
        }

        let stream = await response.json();

        this.setState({error: null, cards: stream});
    };


    getSets = async () => {
        const url = "/api/sets";
        let response;
        try {
            response = await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        } catch (err) {
            this.setState({error: "Can't fetch sets - Failed to connect to server: " + err});
            return;
        }

        let stream = await response.json();

        this.setState({error: null, sets: stream});
    };


    getUserDetails = async () => {
        const url = `/api/users/${this.state.user.id}`;
        let response;
        try {
            response = await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (err) {
            this.setState({error: "Can't get user - Failed to connect to server: " + err});
            return
        }
        if(response.status !== 200) {
            this.setState({error: "Can't get user - Server responded with status code " + response.status})
        }

        let stream = await response.json();

        this.setState({error: null, userDetails: stream});
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    notFound() {
        return (
            <div>
                <h2>404 - Not Found</h2>
                <p>The page you requested is in another castle.</p>
            </div>
        );
    }

    render() {

        return (
            <BrowserRouter>
                <div>
                    <Header user={this.state.user}
                            userDetails={this.state.userDetails}
                            updateLoggedInUser={this.updateLoggedInUser}
                            packNotification={this.state.packNotification}/>
                    <Switch>
                        <Route exact path="/login" render={props => <Login user={this.state.user}
                                                                                   {...props}
                                                                                    error={this.state.error}
                                                                                   fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                                                                                   getUserDetails={this.getUserDetails}/>}/>
                        <Route exact path="/register" render={props => <Register user={this.state.user}
                                                                                    {...props}
                                                                                    error={this.state.error}
                                                                                    fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo} />}/>
                        <Route exact path="/packs" render={props => <Packs user={this.state.user}
                                                                                     userDetails={this.state.userDetails}
                                                                                     {...props}
                                                                                     error={this.state.error}
                                                                                     getUserDetails={this.getUserDetails}
                                                                                     packNotification={this.state.packNotification}
                                                                                     silencePackNotification={() => this.silencePackNotification()}
                                                                                     cards={this.state.cards}/>}/>
                        <Route exact path="/collection" render={props => <Collection user={this.state.user}
                                                                                     userDetails={this.state.userDetails}
                                                                                     {...props}
                                                                                     handleChange={this.handleChange}
                                                                                     set={this.state.set}
                                                                                     class={this.state.class}
                                                                                     sets={this.state.sets}
                                                                                     error={this.state.error}
                                                                                     getUserDetails={this.getUserDetails}
                                                                                     cards={this.state.cards}/>}/>

                        <Route exact path="/" render={props => <Home user={this.state.user}
                                                                     userDetails={this.state.userDetails}
                                                                     {...props}
                                                                     set={this.state.set}
                                                                     class={this.state.class}
                                                                     handleChange={this.handleChange}
                                                                     error={this.state.error}
                                                                     sets={this.state.sets}
                                                                     fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                                                                     cards={this.state.cards}/>}/>
                        <Route component={this.notFound} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root") || document.createElement("div"));

export default getUserDetails