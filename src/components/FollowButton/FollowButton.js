import React from 'react';


const CANT_FOLLOW_SAME_USER_STATUS_ID = -1;
const CURRENTLY_NOT_FOLLOWING_STATUS_ID = 0;
const CURRENTLY_FOLLOWING_STATUS_ID = 1;
const FOLLOW_REQUESTED = 203;
const UNFOLLOW_REQUESTED = 200;


function getBtnValue(relationshipStatusId) {

    switch (relationshipStatusId) {
        case CANT_FOLLOW_SAME_USER_STATUS_ID:
            return "SAME USER";
        case CURRENTLY_NOT_FOLLOWING_STATUS_ID:
            return "Follow";
        case CURRENTLY_FOLLOWING_STATUS_ID:
            return "Unfollow";
        case FOLLOW_REQUESTED:
            return "Follow Requested";
    }
}

function FollowButton(props) {

    let btnValue = getBtnValue(props.relationship);

    let btnStyle = "FollowButton btn btn-primary btn-sm";
    if (props.relationship == CANT_FOLLOW_SAME_USER_STATUS_ID) { btnStyle += " hiddenFollowBtn"; }

    if (props.isProcessing) { return (<button className={btnStyle} disabled onClick={props.click}>{btnValue}</button>); }
    else { return (<button className={btnStyle} onClick={props.click}>{btnValue}</button>); }

}

export { 
    FollowButton as default, 
    CANT_FOLLOW_SAME_USER_STATUS_ID,
    CURRENTLY_NOT_FOLLOWING_STATUS_ID,
    CURRENTLY_FOLLOWING_STATUS_ID,
    FOLLOW_REQUESTED,
    UNFOLLOW_REQUESTED
};
