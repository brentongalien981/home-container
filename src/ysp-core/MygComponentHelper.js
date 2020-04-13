class MygComponentHelper {

    static canReadMoreObjs(data = { ref: null, heightGap: 1000 }) {

        //
        if (data.ref == null) { return false; }
        const ref = data.ref;

        // Boundaries of the sides of the reference.
        var referenceForLoadingMoreObjs = ref.getBoundingClientRect();


        if (referenceForLoadingMoreObjs == null) { return false; }


        var triggerYPositionForAjaxReadingMoreObjs = data.heightGap ? data.heightGap : 1000;

        // // // lOG:
        // console.log("ref POS: " + referenceForLoadingMoreObjs.top);

        if (referenceForLoadingMoreObjs.top <= triggerYPositionForAjaxReadingMoreObjs) {
            return true
        }


        return false;
    }
}

export default MygComponentHelper;