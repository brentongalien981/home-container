
import axios from 'axios';


class Core {


    static appUrl = "http://myg.test:8000";

    static yspCrud(data = {}) {

        let defaultCrudData = {
            method: "get",
            url: data.url,
            params: {},
            callBackFunc: Core.defaultCallBackFunc,
            neededResponseParams: [],
            errorCallBackFunc: Core.defaultErrorCallBackFunc,
            ...data
        };


        // 
        let json = {
            is_result_ok: false,
            isResultOk: false,
            objs: [],
            isViewingOwnAccount: false,
            is_viewing_own_account: false,
            errors: {}
        };


        axios({
            method: defaultCrudData.method,
            url: 'http://myg.test:8000/api' + defaultCrudData.url,
            params: defaultCrudData.params,
        })
            .then(function (response) {
                //
                console.log("\n\n\n\nGood results from YSP-AJAX request...");
                console.log("for request URL ==> " + defaultCrudData.url);

                Core.displayObjects(response, "response");
                Core.displayObjects(response.data, "response.data");
                // displayObjects(response.data.validatedData, "response.data.validatedData");

                const jsonData = response.data;

                json.is_result_ok = jsonData["isResultOk"];
                json.isResultOk = jsonData["isResultOk"];
                json.objs = jsonData["objs"];
                json.isViewingOwnAccount = jsonData["isViewingOwnAccount"];
                json.is_viewing_own_account = jsonData["isViewingOwnAccount"];


                const neededResponseParams = defaultCrudData.neededResponseParams;
                for (const param of neededResponseParams) {
                    json[param] = jsonData[param];
                }

            })
            .catch(function (error) {
                Core.displayErrors(error);
                json.errors = Core.tryGetErrors(error);

                defaultCrudData.errorCallBackFunc(json.errors);
            })
            .then(function () {
                console.log("\nalways executed");

                try {
                    defaultCrudData.callBackFunc(defaultCrudData, json);
                } catch (error) {
                    console.log("error in method:: callBackFunc() bruh..");
                    console.log("e ==> " + error);
                }

            });
    }



    static tryGetErrors(error) {
        let actualErrors = null;

        try {
            actualErrors = error.response.data.errors;
        } catch (error) {
            console.log("\n\n\n#####!!!!!#####");
            console.log("error in method:: tryGetErrors()..");
            console.log("error ==> " + error);
        }

        return actualErrors;
    }


    static defaultCallBackFunc(data, json) {
        console.log("\n\n\n###########@@@@@@@@@@@#########");
        console.log("AJAX-REQUEST:: " + data.ur);
        console.log("in method:: defaultCallBackFunc()");
    }


    static defaultErrorCallBackFunc(errors) {
        console.log("\n\n\n#####!!!!!#####");
        console.log("in method:: defaultErrorCallBackFunc()");
        console.log("Override this callback.");
    }




    static displayErrors(error) {

        if (error === null) { return; }
        console.log("\n\n\n#########################");
        console.log("in method:: displayErrors()");
        console.log("error ==> " + error);


        console.log("tangina shit");


        console.log("looping through object:: error...");
        for (const property in error) {
            if (error.hasOwnProperty(property)) {
                console.log(`${property}: ${error[property]}`);

            }

        }

        try {
            console.log(error.response);
        } catch (e) {
            console.log("error bruh ==> " + e);
        }

        try {
            console.log(error.response.data.message);
        } catch (e) {
            console.log("error bruh ==> " + e);
        }

        try {
            console.log(error.response.data.errors);
        } catch (e) {
            console.log("error bruh ==> " + e);
        }
    }


    static displayObjects(obj, objName) {

        console.log("\n\n\n#########################");
        console.log("in method:: displayObjects()");
        console.log("obj ==> " + objName);
        console.log(obj);
        console.log("looping through object:: " + objName);


        for (const property in obj) {
            console.log(`${property}: ${obj[property]}`);
        }
    }
}

export default Core;