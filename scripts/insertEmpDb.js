require('dotenv').config({path: '../.env'});

const sql = require('mssql');
const jsonfile = require('jsonfile');

// database configurations
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER_URL,
    database: 'osi-hr-management'
};

let empList = jsonfile.readFileSync('./employeeAttributes.json');

console.log(empList.length);

sql.connect(dbConfig, function(err) {

    let dbQuery = 'INSERT INTO employee (emp_id, username, first_name, last_name, emp_number, manager_id) ' +
        'VALUES (@emp_id, @username, @first_name, @last_name, @emp_number, @manager_id)';


    empList.forEach( function(employee, index) {
        console.log(employee.emp_id);

        let dbRequest = new sql.Request();
        dbRequest.input('emp_id', employee.emp_id);
        dbRequest.input('username', employee.email);
        dbRequest.input('first_name', employee.firstName);
        dbRequest.input('last_name', employee.lastName);
        dbRequest.input('emp_number', employee.emp_number);
        dbRequest.input('manager_id', employee.manager_id);

        dbRequest.query(dbQuery, function(err, result) {
            if(err) console.log(err);
            console.log("User inserted: " + index);
        });
    });

    // let dbRequest = new sql.Request();
    // dbRequest.input('emp_id', empList[3].emp_id);
    // dbRequest.input('username', empList[3].email);
    // dbRequest.input('first_name', empList[3].firstName);
    // dbRequest.input('last_name', empList[3].lastName);
    // dbRequest.input('emp_number', empList[3].emp_number);
    // dbRequest.input('manager_id', empList[3].manager_id);
    //
    //
    // dbRequest.query(dbQuery, function(err, result) {
    //     if(err) console.log(err);
    //
    //     console.dir(result);
    // })
});





