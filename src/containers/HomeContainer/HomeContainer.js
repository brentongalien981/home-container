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
            url: '/test2',
            params: {
                api_token: this.state.token
            },
            callBackFunc: (requestData, json) => {

            }
        });
    }


    render() {

        let taggables = this.state.taggables.map((taggable, i) => {
            return (<Taggable key={i} taggable={taggable} />);
        });

        let taggablesHolder = (
            <div className="col-md-8">
                <h4>Taggables</h4>
                {taggables}
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
                    {taggablesHolder}
                    {friendSuggestionsComponent}
                </div>
            </div>
        );
    }
}

export default HomeContainer;