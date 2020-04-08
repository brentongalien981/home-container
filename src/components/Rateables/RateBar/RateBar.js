import React from 'react';
import './RateBar.css';
import Core from '../../../ysp-core/Core';

function RateBar() {
    return (
        <div className="RateBar container-fluid row">

            <div className="rate-status-holder col-12 justify-content-left">

                <div className="rate-status-item-container rate-options-pop-up-trigger-elelements"
                    id="two-cents-status-item-container">

                    <span className="rate-status-item-symbol rate-options-pop-up-trigger-elelements">2&#162;</span>

                    <img className="rate-status-item-img-value rate-options-pop-up-trigger-elelements" src={Core.appUrl + '/img/cn/rate-bar/SosoFace.png'} alt="00 PokerFace" />

                </div>


                <div className="rate-status-item-container"
                    id="sum-status-item-container"
                    title="Number of people who gave their 2 cents.">

                    <span className="rate-status-item-symbol">&#931;</span>

                    <span className="rate-status-item-value">n/a</span>
                </div>


                <div className="rate-status-item-container"
                    id="average-status-item-container"
                    title="Average rating.">

                    <span className="rate-status-item-symbol">&#8776;</span>

                    <img className="rate-status-item-img-value" src={Core.appUrl + '/img/cn/rate-bar/SosoFace.png'} alt="00 Pokerface" />
                </div>
            </div>
        </div>
    );
}


export default RateBar;