import React from 'react';
import Core from '../../ysp-core/Core';
import './HomeContainer.css';
import Taggable from '../../components/Taggables/Taggable/Taggable';
import FollowButton from '../../components/FollowButton/FollowButton';
import MygComponentHelper from '../../ysp-core/MygComponentHelper';
import TaggableContext from '../../context/TaggableContext';


class HomeContainer extends React.Component {

    //
    static rates = [];
    static rateOptionVisibilityHandler = null;
    static settingsOptionsVisibilityHandler = null;

    // React's context.
    static contextType = TaggableContext;


    constructor(props) {
        super(props);

        this.state = {
            isReadingTaggables: false,
            isReadingComments: false,
            isCreatingComment: false,
            isRating: false,
            hasNoMoreItemsToRecommend: false,
            taggables: [],
            friendSuggestions: [],
            alreadyRecommendedVideoIds: [],
            alreadyRecommendedPhotoIds: [],
            alreadyRecommendedTimelinePostIds: [],
            numOfItemsWantedPerSort: 5,
            lastHoveredTaggableId: 0,
            lastHoveredSettingsOptionsTaggableId: 0
            // rateOptionVisibilityHandler: null
        };


        //
        this.handleFollowBtnClicked = this.handleFollowBtnClicked.bind(this);
        this.handleViewMoreCommentsClicked = this.handleViewMoreCommentsClicked.bind(this);

        this.handleNewCommentChanged = this.handleNewCommentChanged.bind(this);
        this.handleNewCommentBtnClicked = this.handleNewCommentBtnClicked.bind(this);


        this.handleRateOptionTriggerHovered = this.handleRateOptionTriggerHovered.bind(this);
        this.handleRateOptionTriggerUnhovered = this.handleRateOptionTriggerUnhovered.bind(this);

        this.handleSettingsOptionsTriggerHovered = this.handleSettingsOptionsTriggerHovered.bind(this);
        this.handleSettingsOptionsTriggerUnhovered = this.handleSettingsOptionsTriggerUnhovered.bind(this);

        this.handleSubscribeToTaggableClicked = this.handleSubscribeToTaggableClicked.bind(this);
        this.handleUnsubscribeToTaggableClicked = this.handleUnsubscribeToTaggableClicked.bind(this);

        this.handleRateOptionClicked = this.handleRateOptionClicked.bind(this);
    }



    handleRateOptionClicked(rateable, i, rateValue) {

        if (this.state.isRating) { return; }


        //
        let rateableTypeId = 0;
        switch (rateable.type) {
            case "TimelinePost":
                rateableTypeId = 1;
                break;
            case "Video":
                rateableTypeId = 2;
                break;
            case "Photo":
                rateableTypeId = 3;
                break;
        }



        //
        Core.yspCrud({
            method: "patch",
            url: "/rateables",
            params: {
                api_token: this.props.token,
                rateableId: rateable.id,
                rateableTypeId: rateableTypeId,
                rateValue: rateValue
            },
            neededResponseParams: ["rateable"],
            callBackFunc: (requestData, json) => {

                const updatedRateable = json.rateable;
                const updatedTaggable = rateable;
                updatedTaggable.rateable = updatedRateable;

                let updatedTaggables = this.state.taggables;
                updatedTaggables[i] = updatedTaggable;
                
                this.setState({ 
                    taggables: updatedTaggables,
                    isRating: false 
                });
            }
        });
    }



    handleNewCommentChanged(e, i) {

        let updatedTaggables = this.state.taggables;
        let updatedTaggable = updatedTaggables[i];
        updatedTaggable.newComment = e.target.value;

        //
        updatedTaggables[i] = updatedTaggable;

        this.setState({ taggables: updatedTaggables });
    }



    handleNewCommentBtnClicked(taggable) {

        //
        if (taggable.newComment.length <= 2) { return; }
        if (this.state.isCreatingComment) { return; }


        //
        let commentableTypeId = null;
        switch (taggable.type) {
            case "TimelinePost":
                commentableTypeId = 1;
                break;
            case "Video":
                commentableTypeId = 2;
                break;
            case "Photo":
                commentableTypeId = 3;
                break;
        }


        //
        Core.yspCrud({
            method: "post",
            url: "/comments/create",
            params: {
                api_token: this.props.token,
                ownerUserId: taggable.ownerUserId,
                commentableId: taggable.id,
                commentableTypeId: commentableTypeId,
                message: taggable.newComment
            },
            neededResponseParams: ["comment"],
            callBackFunc: (requestData, json) => {

                // Reset the textarea.
                if (json.isResultOk) {
                    const targetTextareaId = "textarea-" + taggable.type + "-" + taggable.id;
                    const textarea = document.querySelector("#" + targetTextareaId);
                    textarea.value = "";
                }

                this.setState({ isCreatingComment: false });
            }
        });
    }



    handleSubscribeToTaggableClicked(taggable, i) {

        const url = "/subscriptions/";

        Core.yspCrud({
            method: 'post',
            url: url,
            params: {
                api_token: this.props.token,
                subscriptionableId: taggable.id,
                subscriptionableType: taggable.type
            },
            neededResponseParams: ["subscription"],
            callBackFunc: (requestData, json) => {

                let updatedTaggables = this.state.taggables;
                let updatedTaggable = updatedTaggables[i];

                //
                const newSubscription = json.subscription;
                updatedTaggable.subscriptionDetails = {
                    isUserSubscribed: true,
                    subscriptionId: newSubscription.id
                };

                //
                updatedTaggables[i] = updatedTaggable;

                this.setState({ taggables: updatedTaggables });

            }
        });
    }



    handleUnsubscribeToTaggableClicked(taggable, i) {

        const url = "/subscriptions";

        Core.yspCrud({
            method: 'delete',
            url: url,
            params: {
                api_token: this.props.token,
                subscriptionId: taggable.subscriptionDetails.subscriptionId
            },
            callBackFunc: (requestData, json) => {

                let updatedTaggables = this.state.taggables;
                let updatedTaggable = updatedTaggables[i];

                //
                updatedTaggable.subscriptionDetails = {
                    isUserSubscribed: false,
                    subscriptionId: null
                };

                //
                updatedTaggables[i] = updatedTaggable;

                this.setState({ taggables: updatedTaggables });

            }
        });
    }



    handleSettingsOptionsTriggerHovered(taggableId, taggableIndex) {

        //
        if (this.state.lastHoveredSettingsOptionsTaggableId === taggableId) {
            // Invalidate the settingsOptionsVisibilityHandler
            clearTimeout(HomeContainer.settingsOptionsVisibilityHandler);
        }

        //
        let updatedTaggables = this.state.taggables;
        let updatedTaggable = updatedTaggables[taggableIndex];

        // Show the rateOption
        updatedTaggable.isSettingsOptionsVisible = true;

        //
        updatedTaggables[taggableIndex] = updatedTaggable;
        this.setState({
            lastHoveredSettingsOptionsTaggableId: taggableId,
            taggables: updatedTaggables
        });
    }



    handleSettingsOptionsTriggerUnhovered(taggableId, taggableIndex) {

        HomeContainer.settingsOptionsVisibilityHandler = setTimeout(() => {

            let updatedTaggables = this.state.taggables;
            let updatedTaggable = updatedTaggables[taggableIndex];
            updatedTaggable.isSettingsOptionsVisible = false;

            updatedTaggables[taggableIndex] = updatedTaggable;

            this.setState({ taggables: updatedTaggables });
        }, 1000);
    }



    handleRateOptionTriggerHovered(taggableId, taggableIndex) {

        //
        if (this.state.lastHoveredTaggableId === taggableId) {
            // Invalidate the rateOptionVisibilityHandler
            clearTimeout(HomeContainer.rateOptionVisibilityHandler);
        }


        //
        let updatedTaggables = this.state.taggables;
        let updatedTaggable = updatedTaggables[taggableIndex];

        // Show the rateOption
        updatedTaggable.isRateOptionsVisible = true;

        //
        updatedTaggables[taggableIndex] = updatedTaggable;
        this.setState({
            lastHoveredTaggableId: taggableId,
            taggables: updatedTaggables
        });
    }



    handleRateOptionTriggerUnhovered(taggableId, taggableIndex) {

        HomeContainer.rateOptionVisibilityHandler = setTimeout(() => {

            let updatedTaggables = this.state.taggables;
            let updatedTaggable = updatedTaggables[taggableIndex];
            updatedTaggable.isRateOptionsVisible = false;

            updatedTaggables[taggableIndex] = updatedTaggable;

            this.setState({ taggables: updatedTaggables });
        }, 1000);

    }



    handleViewMoreCommentsClicked(commentable, i) {
        if (this.state.isReadingComments) { return; }

        console.log("\n\n\nin METHOD:: handleViewMoreCommentsClicked()");

        this.setState({ isReadingComments: true });

        const url = "/comments/readJson";

        Core.yspCrud({
            url: url,
            params: {
                api_token: this.props.token,
                commentableId: commentable.id,
                commentableType: commentable.type,
                numOfDisplayedComments: commentable.comments.length
            },
            callBackFunc: (requestData, json) => {

                // Check if some newComments may be duplicated from the oldComments.
                const oldComments = commentable.comments;
                const newComments = json.objs;
                let actualNewComments = [];

                newComments.forEach(newComment => {

                    let isNewCommentAlreadyDisplayed = false;

                    oldComments.forEach(oldComment => {
                        if (oldComment.id === newComment.id) {
                            isNewCommentAlreadyDisplayed = true;
                        }
                    });

                    if (!isNewCommentAlreadyDisplayed) {
                        actualNewComments.push(newComment);
                    }
                });


                // Update the comments.
                const updatedComments = [...oldComments, ...actualNewComments];
                let updatedTaggables = this.state.taggables;
                updatedTaggables[i].comments = updatedComments;

                this.setState({
                    taggables: updatedTaggables,
                    isReadingComments: false
                });
            }
        });
    }



    handleFollowBtnClicked(e, i) {

        // Disable btn.
        let updatedFriendSuggestions = this.state.friendSuggestions;
        const friendSuggestion = updatedFriendSuggestions[i];
        if (friendSuggestion.isProcessing) { return; }
        updatedFriendSuggestions[i].isProcessing = true;

        this.setState({ friendSuggestions: updatedFriendSuggestions });


        //
        const url = "/user-relationship/requestRelationship/" + friendSuggestion.name;

        Core.yspCrud({
            method: 'post',
            url: url,
            params: {
                api_token: this.props.token,
                userName: friendSuggestion.name,
                relationshipRequestId: friendSuggestion.relationship
            },
            callBackFunc: (requestData, json) => {

                updatedFriendSuggestions[i].relationship = json.originalResultData;
                updatedFriendSuggestions[i].isProcessing = false;
                this.setState({ friendSuggestions: updatedFriendSuggestions });
            }
        });
    }



    // ish
    setTaggables(data) {
        console.log("\n\n\nin method:: setTaggables()");

        let xTaggables = {
            Video: [],
            TimelinePost: [],
            // Photo: []
        };

        // Organize the taggables.
        for (const type in data) {
            const element = data[type];
            console.log("type ==> " + type);

            let recentXTaggables = element.orderByDate.xTaggables;
            let topXTaggables = element.orderByTally.xTaggables;


            // 
            for (let i = 0; i < this.state.numOfItemsWantedPerSort; i++) {
                let recentElement = recentXTaggables[i];
                let topElement = topXTaggables[i];

                if (recentElement != null) {
                    recentElement.type = type;
                    recentElement.isRateOptionsVisible = false;
                    recentElement.isSettingsOptionsVisible = false;
                    recentElement.newComment = "";
                    xTaggables[type].push(recentElement);
                }
                if (topElement != null) {
                    topElement.type = type;
                    topElement.isRateOptionsVisible = false;
                    topElement.isSettingsOptionsVisible = false;
                    topElement.newComment = "";
                    xTaggables[type].push(topElement);
                }
            }
        }



        // Mix the taggables.
        let newTaggables = [];
        for (let i = 0; i < this.state.numOfItemsWantedPerSort * 2; i++) {
            if (xTaggables.TimelinePost[i]) { newTaggables.push(xTaggables.TimelinePost[i]); }
            if (xTaggables.Video[i]) { newTaggables.push(xTaggables.Video[i]); }
            // if (xTaggables.Photo[i]) { newTaggables.push(xTaggables.Photo[i]); }
        }



        // Update state taggables.
        const oldTaggables = this.state.taggables;
        const updatedTaggables = [...oldTaggables, ...newTaggables];

        this.setState({
            taggables: updatedTaggables,
            alreadyRecommendedVideoIds: data.Video.alreadyRecommendedXTaggableIds,
            alreadyRecommendedTimelinePostIds: data.TimelinePost.alreadyRecommendedXTaggableIds,
            // alreadyRecommendedPhotoIds: data.Photo.alreadyRecommendedXTaggableIds            
        });
    }



    setScrollListener() {
        const body = document.querySelector("body");

        body.onscroll = () => {

            const ref = document.querySelector("#HomeContainerRef");
            if (MygComponentHelper.canReadMoreObjs({ ref: ref })) {
                this.readTaggables();
            }
        };
    }



    readTaggables() {
        if (this.state.isReadingTaggables) { return; }
        if (this.state.hasNoMoreItemsToRecommend) {
            console.log("\n\n\nSorry, there hasNoMoreItemsToRecommend...");
            return;
        }

        this.setState({ isReadingTaggables: true });

        // taggables
        Core.yspCrud({
            url: '/taggable/getSuggestions',
            params: {
                api_token: this.props.token,
                numOfItemsWanted: this.state.numOfItemsWantedPerSort,
                alreadyRecommendedPhotoIds: this.state.alreadyRecommendedPhotoIds,
                alreadyRecommendedTimelinePostIds: this.state.alreadyRecommendedTimelinePostIds,
                alreadyRecommendedVideoIds: this.state.alreadyRecommendedVideoIds
            },
            neededResponseParams: ["hasNoMoreItemsToRecommend"],
            callBackFunc: (requestData, json) => {
                this.setTaggables(json.objs);
                this.setState({
                    isReadingTaggables: false,
                    hasNoMoreItemsToRecommend: json.hasNoMoreItemsToRecommend
                });
            }
        });
    }



    initItems() {

        this.readTaggables();

        // friendSuggestions
        Core.yspCrud({
            url: '/user-relationship/getSuggestions',
            params: {
                api_token: this.props.token
            },
            callBackFunc: (requestData, json) => {

                // Modify the objs for the FollowButton component.
                let modifiedFriendSuggestions = [];
                for (const u of json.objs) {
                    u['isProcessing'] = false;
                    u['relationship'] = 0;
                    modifiedFriendSuggestions.push(u);
                }

                this.setState({ friendSuggestions: modifiedFriendSuggestions });
            }
        });
    }



    setMyContext() {
        this.context.rateOptionTriggerHovered = this.handleRateOptionTriggerHovered;
        this.context.rateOptionTriggerUnhovered = this.handleRateOptionTriggerUnhovered;

        this.context.settingsOptionsTriggerHovered = this.handleSettingsOptionsTriggerHovered;
        this.context.settingsOptionsTriggerUnhovered = this.handleSettingsOptionsTriggerUnhovered;

        this.context.subscribeToTaggableClicked = this.handleSubscribeToTaggableClicked;
        this.context.unsubscribeToTaggableClicked = this.handleUnsubscribeToTaggableClicked;

        this.context.rateOptionClicked = this.handleRateOptionClicked;
    }



    componentDidMount() {

        //
        this.setMyContext();
        this.setScrollListener();


        Core.yspCrud({
            url: '/rate/read',
            params: {
                api_token: this.props.token,
            },
            callBackFunc: (requestData, json) => {
                HomeContainer.rates = json.objs;

                this.initItems();
            }
        });
    }


    render() {

        // TODO: Refactor
        let taggables = this.state.taggables.map((taggable, i) => {
            //ish
            return (
                <Taggable key={i}
                    index={i}
                    taggable={taggable}
                    viewMoreCommentsClicked={() => { this.handleViewMoreCommentsClicked(taggable, i) }}
                    newCommentChanged={this.handleNewCommentChanged}
                    newCommentBtnClicked={this.handleNewCommentBtnClicked} />
            );
        });

        let taggablesHolder = (
            <div className="col-md-8">
                <h4>Taggables</h4>
                {taggables}
            </div>
        );



        // TODO: Refactor
        let friendSuggestions = this.state.friendSuggestions.map((user, i) => {
            let profilePicUrl = Core.appUrl + Core.defaultProfilePicUrl;
            profilePicUrl = user.profile.photo_url ? Core.appUrl + user.profile.photo_url : profilePicUrl;

            let fullName = user.profile.first_name ? user.profile.first_name : '';
            fullName += user.profile.last_name ? ' ' + user.profile.last_name : '';

            return (
                <li key={user.id} className='SearchedUserItem'>
                    <div>
                        <a href={'/' + user.name}>
                            <img id="userPhoto" src={profilePicUrl} className="img-fluid d-block rounded" alt="profile-picture" />
                        </a>
                    </div>

                    <div>
                        <h6 className='username'><a href={'/' + user.name}>{'@' + user.name}</a></h6>
                        <label className='fullName'>{fullName}</label>

                        <FollowButton
                            click={(e) => this.handleFollowBtnClicked(e, i)}
                            isProcessing={user.isProcessing}
                            relationship={user.relationship} />
                    </div>
                </li>
            );
        });


        let friendSuggestionsComponent = (
            <div className="SearchedResult col-md-4">
                <h4>Friend Suggestions</h4>
                <ul>{friendSuggestions}</ul>
            </div>
        );

        return (
            <div className="container">
                <div className="row">
                    {taggablesHolder}
                    {friendSuggestionsComponent}
                </div>
                <div id="HomeContainerRef"></div>
            </div>
        );
    }
}

export default HomeContainer;