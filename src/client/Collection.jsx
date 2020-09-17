import React from "react";
import {Link, withRouter} from "react-router-dom";

class Collection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            collection: [],
        };
    }

    componentDidMount() {
        this.getCollection();
    }

    millCard = async (card) => {
        const url = `/api/collection/${this.props.user.id}/mill`;
        let response;
        let payload = {cardId: card.id};

        try {
            response = await fetch(url, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify(payload)
            })
        } catch (err) {
            this.setState({error: "Error when milling card - Failed to connect to server: " + err});
            return;
        }

        if(response.status !== 200) {
            this.setState({error: "Error when milling card - Server responded with status code " + response.status});
            return;
        }

        this.setState({error: null});
        await this.props.getUserDetails();
        await this.getCollection();
    };

    buyCard = async (card) => {
        const url = `/api/collection/${this.props.user.id}/buy`;
        let response;
        let payload = {cardId: card.id};

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify(payload)
            })
        } catch (err) {
            this.setState({error: "Error when buying card - Failed to connect to server: " + err});
            return;
        }

        if(response.status !== 201) {
            this.setState({error: "Error when buying card - Server responded with status code " + response.status});
            return;
        }

        this.setState({error: null});
        await this.props.getUserDetails();
        await this.getCollection();
    };

    getCollection = async () => {
        const url = `/api/collection/${this.props.user.id}`;
        let response;

        console.log("Getting my cards...");
        try {
            response = await fetch(url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        } catch (err) {
            this.setState({error: "Error when getting users collection - Server responded with status code " + response.status})
            return;
        }

        let stream = await response.json();
        console.log(stream);
        this.setState({error: null, collection: stream});
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };


    render() {
        if(!this.props.user) {
            return(<p>You need to login to see your collection!</p>)
        }
        return (
            <div className={"main"}>
                <div>
                    <h5>Here you can view your collection, see how many of each card you have, and if you want, mill them for gold</h5>
                    <p>The going rate is 10 gold for commons, 25 for rares, 50 for rares and a whopping 100 for legendaries! Purchasing is twice the price of milling</p>
                </div>
                <div>
                    <select className={"selecters"} name={"set"} id={"sets"} onChange={this.props.handleChange} value={this.props.set}>
                        {this.props.sets.map((set) => {
                            return <option key={set} value={set}>{set}</option>
                        })
                        }
                        <option value={"All"}>All Sets</option>
                    </select>
                    <select className={"selecters"} name={"class"} id={"classes"} onChange={this.props.handleChange} value={this.props.class}>
                        <option value={"NEUTRAL"}>Neutral</option>
                        <option value={"PALADIN"}>Paladin</option>
                        <option value={"WARRIOR"}>Warrior</option>
                        <option value={"MAGE"}>Mage</option>
                        <option value={"PRIEST"}>Priest</option>
                        <option value={"ROGUE"}>Rogue</option>
                        <option value={"HUNTER"}>Hunter</option>
                        <option value={"SHAMAN"}>Shaman</option>
                        <option value={"DRUID"}>Druid</option>
                        <option value={"ALL"}>All heroes</option>
                    </select>
                </div>

                <div className={"collection-container-left"}>
                    <h4>Your collection:</h4>
                    {this.state.collection.map((value, index) => {
                        if((this.props.set === value.set || this.props.set === "All") && (this.props.class === value.cardClass || this.props.class === "ALL")) {
                            return<div className={"owned-card-holder"} key={index}>
                                <p id={"owned-card-text"}>{value.count}x {value.name}</p>
                                <p id={"owned-card-text"}>{value.rarity} {value.cardClass} CARD</p>
                                <p id={"owned-card-text"}>{value.set}</p>
                                {value.set !== "Basic" && <div>
                                    <button className={"mill-btn"} onClick={() => this.millCard(value)}>Mill for gold!</button>
                                    <button className={"mill-btn"} onClick={() => this.buyCard(value)}>Buy for gold!</button>
                                </div>}
                            </div>
                        }

                    })}
                </div>
                <div  className={"collection-container-right"}>
                    <h4>Uncollected cards:</h4>
                    {this.props.cards.map((value, index) => {
                        let display = this.state.collection.find(myCard => myCard.id === value.id);
                        if((this.props.set === value.set || this.props.set === "All") && (this.props.class === value.cardClass || this.props.class === "ALL")) {
                            return !display &&  <div className={"unowned-card-holder"} key={index}>
                                <p>{value.name}</p>
                                <p>{value.rarity} {value.cardClass} CARD</p>
                                <p>{value.set}</p>
                                {value.set !== "Basic" && <button className={"mill-btn"} onClick={() => this.buyCard(value)}>Buy for gold!</button>}
                            </div>
                        }

                    })}
                </div>
                {this.state.error}
                </div>
        );
    }
}

export default withRouter(Collection);