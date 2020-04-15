import React from 'react';
import './Options.css';


function Options(props) {

    const style = props.isVisible ? { display: "block" } : { display: "none" };

    return (
        <ul className="Options" style={style}>
            <li>Notifiy me about this post</li>
            <li>Edit</li>
            <li>Delete</li>
        </ul>
    );
}



export default Options;