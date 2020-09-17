import React from "react";

function CardList(props) {

    return (<div className={"classes"}>
                {props.cards.map((value, index) => {
                        if((value.cardClass === props.class || props.class === "ALL") && (value.set === props.set || props.set === "All")) {
                        if(props.user != null) {
                            for(var i = 0; i < props.userDetails.collection.length; i++) {
                                if(props.userDetails.collection[i].id === value.id) {
                                    return <img src={`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${value.dbfId}.png`}/>
                                }
                            }
                            return <img className={"unowned"} src={`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${value.dbfId}.png`}/>
                        }
                        return <img src={`https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${value.dbfId}.png`}/>
                        }
                })}
            </div>)
}

export default CardList;