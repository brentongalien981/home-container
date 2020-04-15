import React, { useContext } from "react";
import RateBar from '../../Rateables/RateBar/RateBar';
import './Taggable.css';
import Core from '../../../ysp-core/Core';
import Comment from '../../Comment/Comment';
import Options from './Options/Options';
import TaggableContext from "../../../context/TaggableContext";


function Post(props) {

    // React thing.
    const taggableContext = useContext(TaggableContext);

    let taggableMainContent = null;

    const posterProfilePhotoUrl = Core.appUrl + '/' + (props.taggable.posterProfilePhotoUrl ? props.taggable.posterProfilePhotoUrl : Core.defaultProfilePicUrl);


    let comments = props.taggable.comments.map((c, i) => {
        return (<Comment key={c.id} index={i} comment={c} />);
    });



    switch (props.taggable.type) {
        case 'TimelinePost':
            taggableMainContent = (<p>{props.taggable.message}</p>);
            break;
        case 'Video':
            const youtubeEmbedExtras = "?rel=0&amp;controls=0&amp;showinfo=0";
            taggableMainContent = (
                <>
                    <iframe src={props.taggable.url + youtubeEmbedExtras}></iframe>
                    <p>{props.taggable.description}</p>
                </>
            );
            break;
    }



    //
    return (
        <div className="Taggable">

            <div id="" className="">

                {/* post-details */}
                <div className="d-flex justify-content-between">

                    <div>
                        {/* profile-pic */}
                        <div className="profilePicContainer">
                            <img className="" src={posterProfilePhotoUrl} />
                        </div>

                        {/* post-details */}
                        <div className="postMetaDetails">
                            <h4 className="">{props.taggable.posterUsername}</h4>
                            <h5 className="">{props.taggable.creationDate}</h5>
                        </div>
                    </div>


                    {/* post-settings-icon */}
                    <div className="settings-icon-container"
                        onMouseOverCapture={() => taggableContext.settingsOptionsTriggerHovered(props.taggable.id, props.index)}
                        onMouseOutCapture={() => taggableContext.settingsOptionsTriggerUnhovered(props.taggable.id, props.index)}>
                        <i className="fa fa-sliders settings-icon"></i>
                        <Options isVisible={props.taggable.isSettingsOptionsVisible} />
                    </div>
                </div>




                {/* taggable main-content */}
                <div className="taggableMainContentHolder justify-content-left">{taggableMainContent}</div>


                {/* response-bar */}
                <RateBar rateable={props.taggable.rateable}
                    taggableId={props.taggable.id}
                    taggableIndex={props.index}
                    isRateOptionsVisible={props.taggable.isRateOptionsVisible} />


                {/* replies-container */}
                <div className="repliesContainer justify-content-left">{comments}</div>

                {/* view-more-replies-btn */}
                <div className="viewMoreCommentsBtnHolder justify-content-left">
                    <button className="" onClick={props.viewMoreCommentsClicked}>view more comments</button>
                </div>



                {/* new-reply-form */}
                <div id="" className="replyForm justify-content-left">
                    <textarea placeholder="Comment here..." rows="4" cols="70"></textarea>
                    <br />
                    <button className="btn btn-info btn-sm">submit</button>
                </div>

            </div>
        </div>
    );
}



export default Post;