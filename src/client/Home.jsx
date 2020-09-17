import React from "react";
import {Link, withRouter} from "react-router-dom";
import CardList from "./CardList";

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            cards: [],
            modalOpen: false,
            modalCardId: "",
        };
    }

    componentDidMount() {
        console.log(this.props.sets);
    }



    render() {
        return (
            <div className="main">
                <div>
                    <h1>Welcome to the Hearthstone Pack Simulator</h1>
                    <h4>Here are all the cards available to collect in this simulator</h4>
                    <br />
                </div>
                <div>
                    <select name={"set"} className={"selecters"} id={"sets"} onChange={this.props.handleChange} value={this.props.set}>
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

                <CardList user={this.props.user} userDetails={this.props.userDetails} cards={this.props.cards} set={this.props.set} class={this.props.class}/>
                    {/*<CardList cards={this.props.cards} set={this.state.set} class={"PALADIN"}/>
                    <CardList cards={this.props.cards} set={this.state.set} class={"WARRIOR"}/>
                    <CardList cards={this.props.cards} set={this.state.set} class={"PRIEST"}/>
                    <CardList cards={this.props.cards} set={this.state.set} class={"ROGUE"}/>
                    <CardList cards={this.props.cards} set={this.state.set} class={"HUNTER"}/>
                    <CardList cards={this.props.cards} set={this.state.set} class={"SHAMAN"}/>
                    <CardList cards={this.props.cards} set={this.state.set} class={"DRUID"}/>
                    <CardList cards={this.props.cards} set={this.state.set} class={"NEUTRAL"}/>*/}
            </div>
        )
    }
}

export default withRouter(Home);
