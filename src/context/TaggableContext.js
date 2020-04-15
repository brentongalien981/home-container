import React from "react";

const TaggableContext = React.createContext({
    rateOptionTriggerHovered: () => {},
    rateOptionTriggerUnhovered: () => {}
});

export default TaggableContext;
