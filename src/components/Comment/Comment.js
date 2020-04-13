import React from 'react';
import Core from '../../ysp-core/Core';
import './Comment.css';

function Comment(props) {

    const c = props.comment;
    const posterProfilePhotoUrl = Core.appUrl + '/' + (c.posterProfilePhotoUrl ? c.posterProfilePhotoUrl : Core.defaultProfilePicUrl);

    return (
        <div className="Comment">
            {/* profile-pic */}
            <div className="profilePicContainer">
                <img className="" src={posterProfilePhotoUrl} />
            </div>

            {/* post-details */}
            <div className="metaDetails">
                <h4 className="posterUsername">{c.posterUsername}</h4>
                <h5 className="creationDate">{c.creationDate}</h5>
            </div>

            <p>{c.message}</p>
        </div>
    );
}

export default Comment;