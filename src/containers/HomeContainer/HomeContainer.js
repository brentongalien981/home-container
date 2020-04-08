import React from 'react';
import Core from '../../ysp-core/Core';
import './HomeContainer.css';
import Post from '../../components/Taggables/Post/Post';


class HomeContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            taggables: [],
            friendSuggestions: []
        };


        //
        // this.handleSubmitBtnClicked = this.handleSubmitBtnClicked.bind(this);      

    }



    componentDidMount() {

        Core.yspCrud({
            url: '/test2',
            params: {
                api_token: this.state.token
            },
            callBackFunc: (requestData, json) => {

            }
        });
    }


    render() {

        let taggablesComponent = (
            <div className="col-md-8">
                <h4>Taggables</h4>

                <Post />
                
            
            </div>
        );


        let friendSuggestionsComponent = (
            <div className="col-md-4">
                <h4>Friend Suggestions</h4>
            </div>
        );

        return (
            <div className="container">
                <div className="row">
                    {taggablesComponent}
                    {friendSuggestionsComponent}
                </div>
            </div>
        );
    }
}

export default HomeContainer;