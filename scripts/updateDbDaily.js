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

    if (EmployeesList === 'No BambooHR updates') {
        console.log(EmployeesList);
        process.exit();

    } else {
        // Connect to Database and Insert/Update employees
        let databaseResult = await updateDatabase(EmployeesList);

        if(databaseResult === 'DB correctly updated') {

            let saveUpdateTime = {lastUpdatedTimestamp: new Date().toISOString().slice(0,19)+'Z'};

            jsonfile.writeFileSync('./employeesList.json', saveUpdateTime, {spaces: 2});

            console.log(databaseResult);
            process.exit();
        } else {
            console.error('DB update error');
            process.exit(1);
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
        // TODO Switch back insertList and updateList names
        let insertedList = Object.keys(updatedEmployeesList).filter(item => updatedEmployeesList[item].action === 'Inserted');
        let updatedList = Object.keys(updatedEmployeesList).filter(item => updatedEmployeesList[item].action === 'Updated');
        let deletedList = Object.keys(updatedEmployeesList).filter(item => updatedEmployeesList[item].action === 'Deleted');

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
                let insertedEmployeesUsername = await _getBambooUsername(insertedList.slice(0,5));
                let insertedAttributes = await getUpdatedAttributes(insertedList.slice(0,5));

                let employeeToInsert = mergeEmployeeObject(insertedEmployeesUsername, insertedAttributes);
                employeeList.inserted = employeeToInsert;
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

async function updateDatabase(EmployeeList) {

    let updateStatus = true;
    let insertedResult = null;
    let updatedResult = null;
    let deletedResult = null;

    const pool = await sql.connect(dbConfig);

    if(EmployeeList.inserted) {
        insertedResult = await insertEmployeesDatabase(EmployeeList.inserted, pool);
    }
    if(EmployeeList.updated) {
        updatedResult = await updateEmployeesDatabase(EmployeeList.updated, pool);
    }
    if(EmployeeList.deleted) {
        deletedResult = await deleteEmployeesDatabase(EmployeeList.deleted, pool);
    }

    if(updateStatus === true && insertedResult !== 'Failed' && updatedResult !== 'Failed' && deletedResult !== 'Failed') {
        return 'DB correctly updated';
    } else {
        console.error('DB UPDATE FAILED!');
        return 'DB UPDATE FAILED!';
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

async function _getEmployeesDirectory() {
    return axios({
        method: 'get',
        url: `https://api.bamboohr.com/api/gateway.php/osimaritime/v1/employees/directory`,
        auth: {
            username: process.env.API_KEY,
            password: 'x'
        },
        headers: {
            'Accept': 'application/json'
        }
    })
    //    return only the data body we're interested from the request
    .then(result => {
        if(result.data) {
            return result.data.employees;
        } else {
            return 'Error with getting new Employees';
        }
    })
    .catch(error => console.error(error))
    ;
}

async function insertEmployeesDatabase(employeeIds, pool) {

    try {
        let dbQuery = 'INSERT INTO test_insert (id, username, first_name, last_name, emp_number, manager_id) ' +
            'VALUES (@id, @username, @first_name, @last_name, @emp_number, @manager_id)';

        for (let employeeId of employeeIds) {
            let request = await pool.request()
                .input('id', employeeId.id)
                .input('first_name', employeeId.firstName)
                .input('last_name', employeeId.lastName)
                .input('emp_number', employeeId.employeeNumber)
                .input('username', employeeId.username)
                .input('manager_id', employeeId.supervisorEId)
                .query(dbQuery);

            console.dir(request);
            console.log(`INSERTED EMPLOYEE #${employeeId.id} ${employeeId.firstName} ${employeeId.lastName}`);
        }

        return 'Completed';

    } catch (error) {
        console.error(error);
        return 'Failed';
    }
}

async function updateEmployeesDatabase(employeeIds, pool) {

    try {

        let dbQuery = 'UPDATE test_insert ' +
            'SET first_name=@first_name, last_name=@last_name, emp_number=@emp_number, manager_id=@manager_id ' +
            'WHERE id=@id';

        for (let employeeId of employeeIds) {
            let request = await pool.request()
            .input('id', employeeId.id)
            .input('first_name', employeeId.firstName)
            .input('last_name', employeeId.lastName)
            .input('emp_number', employeeId.employeeIds)
            .input('manager_id', employeeId.supervisorEId)
            .query(dbQuery);

            console.dir(request);
            console.log(`UPDATED EMPLOYEE #${employeeId.id} ${employeeId.firstName} ${employeeId.lastName}`);
        }

        return 'Completed';

    } catch (error) {
        console.error(error);
        return 'Failed';
    }
}

async function deleteEmployeesDatabase(employeeIds, pool) {
    try {

        let dbQuery = 'DELETE FROM test_insert WHERE id=@id';

        for (let employeeId of employeeIds) {
            let request = await pool.request()
                .input('id', employeeId)
                .query(dbQuery);

            console.dir(request);
            console.log(`DELETED EMPLOYEE #${employeeId}`);
        }

        return 'Completed';

    } catch (error) {
        console.error(error);
        return 'Failed';
    }
}

async function _getBambooUsername(employeeIdsList) {
    console.log(employeeIdsList);
    let employeeDirectory = await _getEmployeesDirectory();
    let newEmployees = employeeDirectory.filter( item => employeeIdsList.includes(item.id)).map( item => {
        return {id: item.id, username: item.workEmail}
    });

    console.log("EMPLOYEE DIRECTORY");
    console.dir(newEmployees);
    return newEmployees;
}

function mergeEmployeeObject(usernameList, attributeList) {
    let employeesToInsert = [];
    usernameList.forEach(employeeUsername => {
        attributeList.forEach(employeeAttribute => {
            if(employeeUsername.id === employeeAttribute.id) {
                let employee = Object.assign({}, employeeUsername, employeeAttribute);
                employeesToInsert.push(employee);
            }
        });
    });

    return employeesToInsert;
}

main();
