import React from "react";

const TaggableContext = React.createContext({
    rateOptionTriggerHovered: () => {},
    rateOptionTriggerUnhovered: () => {},
    settingsOptionsTriggerHovered: () => {},
    settingsOptionsTriggerUnhovered: () => {},
    subscribeToTaggableClicked: () => {},
    unsubscribeToTaggableClicked: () => {},
});

export default TaggableContext;
