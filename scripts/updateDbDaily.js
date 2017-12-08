require('dotenv').config({path: '../.env'});
const axios = require('axios');
const sql = require('mssql');
const jsonfile = require('jsonfile');

// database configurations
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER_URL,
    database: 'osi-hr-management'
};

async function main() {
    // BambooHR API call to fetch employees updates
    let EmployeesList = await fetchBambooHR();

    if (EmployeesList === 'No BambooHR Updates') {
        console.log(EmployeesList);
        process.exit();
    } else {
        // Connect to Database and Insert/Update employees
        let databaseResult = await updateDatabase(EmployeesList);

        if(databaseResult === 'DB correctly updated') {

            let saveUpdate = {
                lastUpdatedTimestamp: new Date().toISOString().slice(0,19)+'Z'
            };

            jsonfile.writeFileSync('./employeesList.json', saveUpdate, {spaces: 2});
            process.exit();
        }
    }
}

async function fetchBambooHR() {
    // Get latest update time from json file
    let lastUpdateTime = jsonfile.readFileSync('./employeesList.json').lastUpdatedTimestamp;
    let employeeList = {
        inserted: null,
        updated: null,
        deleted: null
    };

    try {
        // Get list of employees id that has been changed since lastUpdateTime
        let updatedEmployeesList = await getChangedEmployees(lastUpdateTime);
        console.log(updatedEmployeesList);

        // Categorize employee update status type in different lists
        let updatedList = Object.keys(updatedEmployeesList).filter(item => updatedEmployeesList[item].action === 'Updated');
        let insertedList = Object.keys(updatedEmployeesList).filter(item => updatedEmployeesList[item].action === 'Inserted');
        let deletedList = Object.keys(updatedEmployeesList).filter(item => updatedEmployeesList[item].action === 'Deleted');

        console.log('LOG DI UPDATEDLIST');
        console.log(updatedList);

        console.log('LOG DI INSERTEDLIST');
        console.log(insertedList);

        /*
         * If there has been employees update, the variable would be an array obj.
         * Otherwise, a string is returned
        */
        if (typeof updatedEmployeesList === 'object') {
            // Make singular API call for each updated employee and fetch the updated attributes
            if(updatedList.length !== 0) {
                let updatedAttributes = await getUpdatedAttributes(updatedList);
                employeeList.updated = updatedAttributes;
            }

            // Make singular API call for each inserted employee and fetch the updated attributes
            if(insertedList.length !== 0) {
                let insertedAttributes = await getUpdatedAttributes(insertedList);
                employeeList.inserted = insertedAttributes;
            }

            // Add deleted user list to the global obj
            if(deletedList.length !== 0) {
                employeeList.deleted = deletedList;
            }

            // Return global object with latest employees updates
            return employeeList;

        } else {
            return 'No BambooHR Updates';
        }
    } catch (error) {
        console.error(error)
    }
}

/*
* fetch BambooHR Last Changed Information API
* params: lastUpdatetime which is a date in ISO8601 format
* return: An array of updated employee ids. If no updates, a string to log out.
*/
function getChangedEmployees(lastUpdateTime) {
    return axios({
        method: 'get',
        url: `https://api.bamboohr.com/api/gateway.php/osimaritime/v1/employees/changed/`,
        auth: {
            username: process.env.API_KEY,
            password: 'x'
        },
        headers: {
            'Accept': 'application/json'
        },
        params: {
            since: lastUpdateTime,
        },
    })
    //    return only the data body we're interested from the request
    .then(result => {
        if(result.data.employees) {
            return result.data.employees;
        } else {
            return 'No employees updates';
        }
    })
    .catch(error => console.error(error))
    ;
}

/*
* fetch BambooHR Singular Dimension Data for each updated employee ids
* params: a list of employee ids
* return: a list of object*/
async function getUpdatedAttributes(employeesIds) {
    let attributesList = [];

    for (let employeeId of employeesIds) {
        try {
            let updatedAttributes = await _getBambooUpdatedAttributes(employeeId);
            console.log(updatedAttributes);

            attributesList.push(updatedAttributes)
        } catch (error) {
            console.error(error);
        }
    }

    return attributesList;
}

function _getBambooUpdatedAttributes(employeeId) {
    return axios({
        method: 'get',
        url: `https://api.bamboohr.com/api/gateway.php/osimaritime/v1/employees/${employeeId}`,
        auth: {
            username: process.env.API_KEY,
            password: 'x'
        },
        headers: {
            'Accept': 'application/json'
        },
        params: {
            fields: 'employeeNumber,firstName,lastName,supervisorEId'
        },
    })
    //    return only the data body we're interested from the request
        .then(result => result.data)
        .catch(error => console.error(error));
}

async function updateDatabase(EmployeeList) {

    let updateStatus = true;
    let insertedResult = null;
    let updatedResult = null;
    let deletedResult = null;

    if(EmployeeList.inserted) {
        insertedResult = await insertEmployeesDatabase(EmployeeList.inserted);
    }
    if(EmployeeList.updated) {
        updatedResult = await insertEmployeesDatabase(EmployeeList.updated);
    }
    if(EmployeeList.deleted) {

    }

    if(updateStatus === true && insertedResult !== 'Failed' && updatedResult !== 'Failed' && deletedResult !== 'Failed') {
        return 'DB correctly updated';
    } else {
        console.error('DB UPDATE FAILED!');
    }

}
async function updateEmployeesDatabase(employeeIds) {
    try {
        const pool = await sql.connect(dbConfig);

        let dbQuery = 'UPDATE test_insert ' +
            'SET first_name=@first_name, last_name=@last_name, emp_number=@emp_number ' +
            'WHERE id=@id';

        for (let employeeId of employeeIds) {
            let request = await pool.request()
            .input('id', employeeId.id)
            .input('first_name', employeeId.firstName)
            .input('last_name', employeeId.lastName)
            .input('emp_number', employeeId.employeeNumber)
            .query(dbQuery);

            console.dir(request);
        }

        return 'Completed';

    } catch (error) {
        console.error(error);
        return 'Failed';
    }
}

async function insertEmployeesDatabase(employeeIds) {
    try {
        const pool = await sql.connect(dbConfig);

        let dbQuery = 'INSERT INTO test_insert (id, first_name, last_name, emp_number) ' +
            'VALUES (@id, @first_name, @last_name, @emp_number)';

        for (let employeeId of employeeIds) {
            let request = await pool.request()
                .input('id', employeeId.id)
                .input('first_name', employeeId.firstName)
                .input('last_name', employeeId.lastName)
                .input('emp_number', employeeId.employeeNumber)
                .query(dbQuery);

            console.dir(request);
        }

        return 'Completed';

    } catch (error) {
        console.error(error);
        return 'Failed';
    }
}

main();