export let constants = {
    API: {
        //User
        userAuthenticate:                   '/api/User/authenticate',
        userRegister:                       '/api/User/register',

        //Transactions
        getTransactionsByAccountId:         '/api/Transaction/getall/:accountId',
        addTransaction:                     '/api/Transaction/add',

        //Account
        getDebtorAccountsByCreditorAccId:   '/api/Account/getall/:accountId',
        getCreditorAccountDataByAccId:      '/api/Account/getbyid/:accountId'
    },
    config: {
        baseUrl: 'https://localhost:44371'
    }
}

function resolvePathParams ( apiEndpoint, pathParams ) {
    if( pathParams && typeof pathParams === 'object' ) {
        Object.keys(pathParams).map((key, index) => {
            var pattern = ':' + key;
            apiEndpoint = apiEndpoint.replace(pattern, pathParams[key]);
            return apiEndpoint;
        })
    }
    return apiEndpoint;
}

export let RESTRESOURCE = function (api, params) {
    return constants.config.baseUrl + resolvePathParams(constants.API[api], params);
}


var resource = {};
function init() {
    Object.keys(constants.API).map((key, index) => 
        resource[key] = function(params) {
            return constants.config.baseUrl + resolvePathParams(constants.API[key], params);
        }
    )
}
init();
// console.log(resource)
export let $resource = resource;