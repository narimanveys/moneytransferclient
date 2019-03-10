export function postData(url, data) {
// Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    // .then(response => (response ? response.json() : Promise.resolve("OK"))); // parses response to JSON
    .then(response => {
        // console.log(response)
        // console.log('response.json()', response.json())
        return response
    }); // parses response to JSON
}

var month = [];
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getTimeByDate(date) {
    if( typeof date === 'string' ) date = new Date(date)
    return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + 
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
}

export function getDateInUSFormat(date) {
    if( typeof date === 'string' ) date = new Date(date)
    return (date.getMonth() + 1) + '/' + 
        date.getDate() + '/' +
        date.getFullYear() +  
        ' ' + 
        getTimeByDate(date);
}

export function getDateInEUFullFormat(date) {
    if( typeof date === 'string' ) date = new Date(date)
    return days[(date.getDay())] + ', ' +
        month[date.getMonth()] + ' ' + 
        date.getDate() + ' ' +
        date.getFullYear();
}

