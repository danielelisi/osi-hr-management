require('dotenv').config({path: '../.env'});
const axios = require('axios');
const sql = require('mssql');

// database configurations
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER_URL,
    database: 'osi-hr-management'
};

async function main() {
    try {
        let employeesDirectory = await _getEmployeesDirectory();
        console.dir(employeesDirectory);

        let employeesToInsert = await _getEmployeesDetail(employeesDirectory.slice(0,5));
        console.log(employeesToInsert);

        let databaseResult = await _populateDatabase(employeesToInsert);
        console.log(databaseResult);

    } catch (error) {
        console.error(error);
    }
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

async function _getEmployeesDetail(employeeDirectory) {
    let employeesList = [];

    for (let employee of employeeDirectory) {
        try {
            let employeeDetails = await _getBambooUpdatedAttributes(employee.id);
            console.log(employeeDetails);

            employeesList.push(employeeDetails)
        } catch (error) {
            console.error(error);
        }
    }

    let updatedEmployeesList = mergeEmployeeObject(employeeDirectory, employeesList);

    return updatedEmployeesList;
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
            fields: 'employeeNumber,supervisorEId'
        },
    })
    //    return only the data body we're interested from the request
        .then(result => result.data)
        .catch(error => console.error(error));
}

function mergeEmployeeObject(employeesList, detailsList) {
    let employeesToInsert = [];

    employeesList.forEach(employee => {
        detailsList.forEach(employeeDetails => {
            if(employee.id === employeeDetails.id) {
                let updatedEmployee = Object.assign({}, employee, employeeDetails);
                employeesToInsert.push(updatedEmployee);
            }
        });
    });

    return employeesToInsert;
}

async function _populateDatabase(employeesToInsert) {
    try {
        const pool = await sql.connect(dbConfig);
        let dbQuery = 'INSERT INTO employee (emp_id, username, first_name, last_name, emp_number, manager_id) ' +
            'VALUES (@emp_id, @username, @first_name, @last_name, @emp_number, @manager_id)';

        for (let employee of employeesToInsert) {
            let request = await pool.request()
                .input('emp_id', employee.id)
                .input('first_name', employee.firstName)
                .input('last_name', employee.lastName)
                .input('emp_number', employee.employeeNumber)
                .input('username', employee.workEmail)
                .input('manager_id', employee.supervisorEId)
                .query(dbQuery);

            console.dir(request);
            console.log(`INSERTED EMPLOYEE #${employee.id} ${employee.firstName} ${employee.lastName}`);
        }

        return 'DB correctly populated';

    } catch (error) {
        console.error(error);
        return 'Failed';
    }
}

main();
