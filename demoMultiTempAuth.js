//Project ID
// This gets the current Record ID from the URL
var url_string = window.location.href;
var url = new URL(url_string);
var rid = url.searchParams.get("rid");

// Assign Table IDs to variables for later use 
const TABLE_1_ID = "*****YOUR TABLE ID*****" // Example: "bp2ryku2u"
const TABLE_2_ID = "*****YOUR TABLE ID*****"
const TABLE_3_ID = "*****YOUR TABLE ID*****"
const TABLE_4_ID = "*****YOUR TABLE ID*****"

// Assign Field IDs for later use
const FIELD_1_ID = "*****YOUR FIELD ID*****" // Example: 3
const FIELD_2_ID = "*****YOUR FIELD ID*****" 
const FIELD_3_ID = "*****YOUR FIELD ID*****" 
const FIELD_4_ID = "*****YOUR FIELD ID*****"

// An asynchronous function which gets 4 Temp-Auth tokens. 
const getAuthCodes = async () => {
    try {
        const headers = {
            'QB-Realm-Hostname': '*****YOUR COMPANY*****.quickbase.com', // Put your company QuickBase domain here. 
            'User-Agent': 'temp_auth_refactor',
            'QB-App-Token': '*****YOUR APP TOKEN*****', // Put your company App token here. You'll need to create one first. 
            'Content-Type': 'application/json'
        }
        // This creates 4 fetch requests for Temp Auth Tokens, one for each table 
        const results = await Promise.all ([
            fetch(`https://api.quickbase.com/v1/auth/temporary/${TABLE_1_ID}`, {method: 'GET', headers: headers, credentials: 'include'}),
            fetch(`https://api.quickbase.com/v1/auth/temporary/${TABLE_2_ID}`, {method: 'GET', headers: headers, credentials: 'include'}),
            fetch(`https://api.quickbase.com/v1/auth/temporary/${TABLE_3_ID}`, {method: 'GET', headers: headers, credentials: 'include'}),
            fetch(`https://api.quickbase.com/v1/auth/temporary/${TABLE_4_ID}`, {method: 'GET', headers: headers, credentials: 'include'})
        ])

        // Convert all promises in the array to JSON
        const dataPromises = results.map(result => result.json())

        // Return a single, resolved promise to a variable 
        const finalData = await Promise.all(dataPromises);

        // Return the data
        return finalData
    
        // Catch any errors. 
    } catch (err) {

        // Log error to console.
        console.log(err);
    }
}

// Declare variables for API bodies
let body_1 = {"from":TABLE_1_ID,"select":[FIELD_1_ID],"where":`{3.EX.${rid}}`} // This "where" points to the Parent table Record Id field ID.
let body_2 = {"from":TABLE_2_ID,"select":[FIELD_2_ID],"where":`{19.EX.${rid}}`} // This "where" points to a child table Related Project field ID.
let body_3 = {"from":TABLE_3_ID,"select":[FIELD_3_ID],"where":`{7.EX.${rid}}`} // This "where" points to a child table Related Project field ID.
let body_4 = {"from":TABLE_4_ID,"select":[FIELD_4_ID],"where":`{12.EX.${rid}}`} // This "where" points to a child table Related Project field ID.

//Variables for returned data
let data_1, data_2, data_3, data_4

// Function to make a single API call.
// Passes in a unique temp-auth token and a body. 
const quickBaseApiCall = async (tempToken, apiBody) => {
    try {
        const headers = {
            'QB-Realm-Hostname': '*****YOUR COMPANY*****.quickbase.com', // Put your company QuickBase domain here. 
            'Authorization': `QB-TEMP-TOKEN ${tempToken}`, // Pass the temp-auth token here
            'Content-Type': 'application/json'
        }

        // Fetch request for data in Quickbase using the temp token
        // api body parameter goes at the end => ------------------------------------------------------------------------------------| Below |
        const res = await fetch('https://api.quickbase.com/v1/records/query', {method: 'POST', headers: headers, body: JSON.stringify(apiBody)})

        // Convert response to JSON
        const data = await res.json();

        // Log the status and data to the console. 
        console.log(res.status);
        console.log(data);

        // Return the data 
        return data

        // Catch any errors
    } catch(err) {
        // Log error to console
        console.log(err)
    }
}

// Async function to call the above function with the different parameters. 
const getData = async () => {

    // Call the getAuthCodes function, and return the output to a variable
    const tempTokens = await getAuthCodes();
    console.log("USER TOKEN: ", tempTokens); // Log to console. 

    // Declare variables for each of the returned tempTokens
    let tempToken_1 = tempTokens[0].temporaryAuthorization
    let tempToken_2 = tempTokens[1].temporaryAuthorization
    let tempToken_3 = tempTokens[2].temporaryAuthorization
    let tempToken_4 = tempTokens[3].temporaryAuthorization

    // Call the quickBaseApiCall function, passing in the temp tokens and the respective API bodies.
    // Returning the data to the numbered variables. 
    data_1 = await quickBaseApiCall(tempToken_1, body_1);
    data_2 = await quickBaseApiCall(tempToken_2, body_2);
    data_3 = await quickBaseApiCall(tempToken_3, body_3);
    data_4 = await quickBaseApiCall(tempToken_4, body_4);

    // Object literal to return to manageData function
    const data = {
        table_1: data_1,
        table_2: data_2,
        table_3: data_3,
        table_4: data_4
    }

    // Return the data
    return data
}
const manageData = async () => {
    //Call getData and asign the output to a variable
    const data = await getData();
    console.log("MANAGE DATA: ", data)

    // Do things wih the data here.
    console.log(data.table_1);
    console.log(data.table_2);
    console.log(data.table_3)

}
manageData();