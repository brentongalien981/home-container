import React, { useContext } from "react";
import './Options.css';
import TaggableContext from "../../../../context/TaggableContext";


function Options(props) {

    // React thing.
    const taggableContext = useContext(TaggableContext);

    const style = props.isVisible ? { display: "block" } : { display: "none" };

    let subscriptionOption = (<li onClick={() => taggableContext.subscribeToTaggableClicked(props.taggable, props.taggableIndex)}>Notifiy me about this post</li>);
    if (props.taggable.subscriptionDetails.isUserSubscribed) {
        subscriptionOption = (<li onClick={() => taggableContext.unsubscribeToTaggableClicked(props.taggable, props.taggableIndex)}>Unsubscribe to this post</li>);
    }

    return (
        <ul className="Options" style={style}>
            {subscriptionOption}
            <li>Edit</li>
            <li>Delete</li>
        </ul>
    );
}



export default Options;