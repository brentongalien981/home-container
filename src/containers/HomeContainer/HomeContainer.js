import React from 'react';
import Core from '../../ysp-core/Core';
import './HomeContainer.css';
import Taggable from '../../components/Taggables/Taggable/Taggable';
import FollowButton from '../../components/FollowButton/FollowButton';


class HomeContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            taggables: [
                { id: 1, type: 'post', message: 'shit boi' },
                { id: 2, type: 'video', url: 'https://www.youtube.com/embed/oyEuk8j8imI?rel=0&amp;controls=0&amp;showinfo=0' },
            ],
            friendSuggestions: [],
            alreadyRecommendedVideoIds: [],
            alreadyRecommendedPhotoIds: [],
            alreadyRecommendedPostIds: [],
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

        let xTaggables = [];

        // ish
        for (const type in data) {
            const element = data[type];

            let recentXTaggables = element.orderByDate.xTaggables;
            let topXTaggables = element.orderByTally.xTaggables;


            for (let i = 0; i < this.state.numOfItemsWantedPerSort; i++) {
                let recentElement = recentXTaggables[i];
                let topElement = topXTaggables[i];
    
                console.log("recentElement ==> " + recentElement?.title);
                console.log("topElement ==> " + topElement?.title);
    
                if (recentElement != null) {
                    recentElement.type = type;
                    xTaggables.push(recentElement);
                }
                if (topElement != null) {
                    topElement.type = type;
                    xTaggables.push(topElement);
                }
            }
        }


        // TODO:
        this.setState({ 
            taggables: xTaggables,
            alreadyRecommendedVideoIds: data.Video.alreadyRecommendedXTaggableIds,
            // alreadyRecommendedPostIds: data.Post.alreadyRecommendedXTaggableIds,
            // alreadyRecommendedPhotoIds: data.Photo.alreadyRecommendedXTaggableIds
        });
    }



    componentDidMount() {

        // taggables
        Core.yspCrud({
            url: '/taggable/getSuggestions',
            params: {
                api_token: this.props.token
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


    render() {

        //
        let taggables = this.state.taggables.map((taggable, i) => {
            return (<Taggable key={i} taggable={taggable} />);
        });

        let taggablesHolder = (
            <div className="col-md-8">
                <h4>Taggables</h4>
                {taggables}
            </div>
        );



        //
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