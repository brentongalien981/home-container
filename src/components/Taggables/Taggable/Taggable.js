import React from 'react';
import RateBar from '../../Rateables/RateBar/RateBar';
import './Taggable.css';

function Post(props) {


    let taggableMainContent = null;

    switch (props.taggable.type) {
        case 'Post':
            taggableMainContent = (<p>{props.taggable.message}</p>);
            break;
        case 'Video':
            const youtubeEmbedExtras = "?rel=0&amp;controls=0&amp;showinfo=0";
            taggableMainContent = (<iframe src={props.taggable.url + youtubeEmbedExtras}></iframe>);
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
                            <img className="" src="http://myg.test:8000/storage/avatars/nv8GU1TFX6Id4iHY8yhAjneLS7FFHEgQUytP6NrR.jpeg" />
                        </div>

                        {/* post-details */}
                        <div className="postMetaDetails">
                            <h4 className="">bren</h4>
                            <h5 className="">2 weeks ago</h5>
                        </div>
                    </div>


                    {/* post-settings-icon */}
                    <div className="settings-icon-container"><i className="fa fa-sliders settings-icon"></i></div>
                </div>




                {/* post-message */}
                <div className="taggableMainContentHolder justify-content-left">{taggableMainContent}</div>


                {/* response-bar */}
                <RateBar />





                {/* replies-container */}
                <div className="repliesContainer justify-content-left"></div>

                {/* view-more-replies-btn */}
                <div className="viewMoreCommentsBtnHolder justify-content-left">
                    <button className="">view more comments</button>
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