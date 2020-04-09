import React from 'react';
import Core from '../../ysp-core/Core';
import './HomeContainer.css';
import Taggable from '../../components/Taggables/Taggable/Taggable';


class HomeContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            taggables: [
                { id: 1, taggable_type: 'post', message: 'shit boi' },
                { id: 2, taggable_type: 'video', url: 'https://www.youtube.com/embed/oyEuk8j8imI?rel=0&amp;controls=0&amp;showinfo=0' },
            ],
            friendSuggestions: []
        };


        //
        // this.handleSubmitBtnClicked = this.handleSubmitBtnClicked.bind(this);      

    }



    componentDidMount() {

        Core.yspCrud({
            url: '/user-relationship/getSuggestions',
            params: {
                api_token: this.props.token
            },
            callBackFunc: (requestData, json) => {
                this.setState({ friendSuggestions: json.objs });
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