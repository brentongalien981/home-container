import React from "react";

const TaggableContext = React.createContext({
    rateOptionTriggerHovered: () => {},
    rateOptionTriggerUnhovered: () => {},
    settingsOptionsTriggerHovered: () => {},
    settingsOptionsTriggerUnhovered: () => {},
});

export default TaggableContext;
