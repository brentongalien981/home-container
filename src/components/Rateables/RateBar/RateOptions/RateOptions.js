import React, { useContext } from 'react';
import HomeContainer from '../../../../containers/HomeContainer/HomeContainer';
import './RateOptions.css';
import TaggableContext from '../../../../context/TaggableContext';


function RateOptions(props) {

    // React thing.
    const taggableContext = useContext(TaggableContext);

    const style = props.isVisible ? { display: "block" } : { display: "none" };

    const rateOptions = HomeContainer.rates.map((rate, i) => {
        return (
            <div key={rate.id}
                className="rate-option rate-options-pop-up-trigger-elelements orange-hovered-shadow"
                rate-value={rate.value}
                onClick={() => taggableContext.rateOptionClicked(props.taggable, props.taggableIndex, rate.value)}>
                <img className="rate-option-img rate-options-pop-up-trigger-elelements" src={rate.photo_url} />
                <h6 className="rate-option-label rate-options-pop-up-trigger-elelements">{rate.name}</h6>
            </div>
        );
    });


    return (
        <div id="rate-options-pop-up" style={style} className="rate-options-pop-up-trigger-elelements">
            <div className="rate-options-pop-up-trigger-elelements">{rateOptions}</div>
        </div>
    );
}



export default RateOptions;