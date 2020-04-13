import React from 'react';
import './RateBar.css';
import Core from '../../../ysp-core/Core';
import RateOptions from './RateOptions/RateOptions';

function RateBar(props) {

    const r = props.rateable;
    const defaultRate = {
        photo_url: Core.appUrl + '/img/cn/rate-bar/SosoFace.png',
        alt: "Photo Rate",
        title: "n/a",
        value: 0,
        name: "n/a"
    };

    const rateByUser = r.rateByUser ? r.rateByUser : defaultRate;
    const rateAverage = r.rateAverage ? r.rateAverage : defaultRate;


    return (
        <div className="RateBar container-fluid row">

            <div className="rate-status-holder col-12 justify-content-left">

                <div className="rate-status-item-container rate-options-pop-up-trigger-elelements"
                    id="two-cents-status-item-container"
                    title={"You rated this " + rateByUser.value + ": " + rateByUser.name}>

                    <span className="rate-status-item-symbol rate-options-pop-up-trigger-elelements">2&#162;</span>

                    <img className="rate-status-item-img-value rate-options-pop-up-trigger-elelements" src={rateByUser.photo_url} alt={rateByUser.alt} />

                    {/*  */}
                    <RateOptions />
                </div>


                <div className="rate-status-item-container"
                    id="sum-status-item-container"
                    title="Number of people who gave their 2 cents.">

                    <span className="rate-status-item-symbol">&#931;</span>

                    <span className="rate-status-item-value">{r.ratesCount}</span>
                </div>


                <div className="rate-status-item-container"
                    id="average-status-item-container"
                    title={"Average rating is " + rateAverage.value + ": " + rateAverage.name}>

                    <span className="rate-status-item-symbol">&#8776;</span>

                    <img className="rate-status-item-img-value" src={rateAverage.photo_url} alt={rateAverage.alt} />
                </div>
            </div>
        </div>
    );
}


export default RateBar;