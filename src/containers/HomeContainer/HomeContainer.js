import React from 'react';
import axios from 'axios';
import Core from '../../ysp-core/Core';


class HomeContainer extends React.Component {

    // let token = ProfileEditContainer.token;
    // static url = "http://myg.test:8000/api/user?api_token=" + token;
    static url = "http://myg.test:8000/api/test";

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            isLoggedIn: localStorage.getItem('token') ? true : false,
            token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
        };


        //
        this.handleSubmitBtnClicked = this.handleSubmitBtnClicked.bind(this);
        this.handleOnInputChange = this.handleOnInputChange.bind(this);
        this.handleTestApiBtnClicked = this.handleTestApiBtnClicked.bind(this);
        this.handleSignoutBtnClicked = this.handleSignoutBtnClicked.bind(this);       

    }



    handleSubmitBtnClicked() {
        console.log("\n\n\nin METHOD:: handleSubmitBtnClicked()");

        Core.yspCrud({
            method: 'post',
            url: '/api-signin',
            params: {
                email: this.state.email,
                password: this.state.password
            },
            neededResponseParams: [
                'doesPasswordMatch',
                'token'
            ],
            callBackFunc: (requestData, json) => {
                console.log("\n\n\njson.doesPasswordMatch ==> " + json.doesPasswordMatch);

                if (json.doesPasswordMatch) {
                    localStorage.setItem('token', json.token);
                    this.setState({ token: json.token });
                    this.setState({ isLoggedIn: true });
                    console.log("token set!");
                }
            }
        });
    }


    handleTestApiBtnClicked() {

        Core.yspCrud({
            url: '/test2',
            params: {
                api_token: this.state.token
            },
            callBackFunc: (requestData, json) => {

            }
        });
    }



    handleSignoutBtnClicked() {
        localStorage.clear();
        this.setState({ isLoggedIn: false });
    }



    handleOnInputChange(e) {
        const value = e.target.value;
        const name = e.target.name;

        this.setState({
            [name]: value
        });
    }



    render() {

        let signInComponent = (
            <div>
                <h1>You're signed-in!</h1>
                <button onClick={this.handleTestApiBtnClicked}>test api token</button>
                <button onClick={this.handleSignoutBtnClicked}>signout</button>
            </div>

        );

        if (!this.state.isLoggedIn) {
            signInComponent = (
                <div>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" name="email" onChange={(e) => this.handleOnInputChange(e)} aria-describedby="emailHelp" placeholder="Enter email" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" name="password" onChange={(e) => this.handleOnInputChange(e)} id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label">Check me out</label>
                    </div>
                    <button className="btn btn-primary" onClick={this.handleSubmitBtnClicked}>Submit</button>
                </div>
            );
        }

        return signInComponent;
    }



    componentDidMount() {
        console.log("CLASS:: HomeContainer, METHOD:: componentDidMount()");


        Core.yspCrud({
            url: '/test',
            callBackFunc: (requestData, json) => {

            }
        });
    }
}

export default HomeContainer;