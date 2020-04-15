import React, { useContext } from "react";
import './Options.css';
import TaggableContext from "../../../../context/TaggableContext";


function Options(props) {

    // React thing.
    const taggableContext = useContext(TaggableContext);

    const style = props.isVisible ? { display: "block" } : { display: "none" };

    return (
        <ul className="Options" style={style}>
            <li onClick={() => taggableContext.subscribeToTaggableClicked(props.taggable, props.taggableIndex)}>Notifiy me about this post</li>
            <li>Edit</li>
            <li>Delete</li>
        </ul>
    );
}



export default Options;