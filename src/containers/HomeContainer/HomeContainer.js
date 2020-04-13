import React from 'react';
import Core from '../../ysp-core/Core';
import './HomeContainer.css';
import Taggable from '../../components/Taggables/Taggable/Taggable';
import FollowButton from '../../components/FollowButton/FollowButton';


class HomeContainer extends React.Component {

    //
    static rates = [];

    constructor(props) {
        super(props);

        this.state = {
            taggables: [],
            friendSuggestions: [],
            alreadyRecommendedVideoIds: [],
            alreadyRecommendedPhotoIds: [],
            alreadyRecommendedTimelinePostIds: [],
            numOfItemsWantedPerSort: 10
        };


        //
        this.handleFollowBtnClicked = this.handleFollowBtnClicked.bind(this);

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


            for (let i = 0; i < this.state.numOfItemsWantedPerSort; i++) {
                let recentElement = recentXTaggables[i];
                let topElement = topXTaggables[i];

                if (recentElement != null) {
                    recentElement.type = type;
                    xTaggables[type].push(recentElement);
                }
                if (topElement != null) {
                    topElement.type = type;
                    xTaggables[type].push(topElement);
                }
            }
        }



        // Mix the taggables.
        let newTaggables = [];
        for (let i = 0; i < this.state.numOfItemsWantedPerSort; i++) {
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



    initItems() {

        // taggables
        Core.yspCrud({
            url: '/taggable/getSuggestions',
            params: {
                api_token: this.props.token,
                numOfItemsWanted: this.state.numOfItemsWantedPerSort
            },
            callBackFunc: (requestData, json) => {
                this.setTaggables(json.objs);
            }
        });



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



    componentDidMount() {

        // ish
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
            return (<Taggable key={i} taggable={taggable} />);
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
            </div>
        );
    }
}

export default HomeContainer;