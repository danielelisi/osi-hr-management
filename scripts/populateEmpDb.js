/*
DISCLAIMER:
    THIS IS JUST AN UTILITY TOOL WHICH IS PROBABLY NOT REUSABLE.
    CODE IS REALLY MESSY CAUSE I JUST WANTED IT
    TO WORK THE WAY I WANTED FOR THIS SPECIFIC USE CASE.
- DL

 */
require('dotenv').config({path: '../.env'});
const bamboohr = new (require('node-bamboohr'))({apikey: process.env.API_KEY, subdomain:'osimaritime'});
const jsonfile = require('jsonfile');

let employeeList = [];

employeeList = fetchBamboo(employeeList);
console.log('MAIN FUNC');

function fetchBamboo(empList) {

    // fetch a list of obj containing all employees
    bamboohr.employees(function(err, employees) {
        if(err) {
            console.log(err);
        }

        empList = employees;
        let empIdEmailList = extractEmpIdEmail(empList);
        console.log(empIdEmailList);

        let timeoutVar = (1000 * empIdEmailList.length + 5000);
        console.log(timeoutVar);

        let empAttributeList = getEmpAttributes(empIdEmailList);
    });
}

function extractEmpIdEmail(empList) {
    let empIdEmailList = [];
    empList.forEach(function (employee) {
        empIdEmailList.push({
            emp_id: employee.id,
            email: employee.fields.workEmail
        });
    });

    return empIdEmailList;
}

//extract only employees' attributes
function getEmpAttributes(empList) {
    let empAttributeList = [];

    let finalTimeoutValue = (1500 * empList.length) + 2000;

    empList.forEach( function(employee, index) {
        setTimeout(function() {
            bamboohr.employee(employee.emp_id).get('employeeNumber','firstName','lastName','supervisorEId', function(err, result) {
                if(err) {
                    console.log(`ERROR FETCHING EMP FROM BAMBOO: ${err}`);
                }

                console.dir(`BAMBOO RESULT ${index}`);

                let empAttributes = {
                    emp_id: employee.emp_id,
                    email: employee.email,
                    firstName: result.fields.firstName,
                    lastName: result.fields.lastName,
                    emp_number: result.fields.employeeNumber,
                    manager_id: result.fields.supervisorEId
                };

                empAttributeList.push(empAttributes);
            });
        },
        index * 1500);
    });

    // make sure to call writeToJson after the fetching finishes
    setTimeout( function() {
        writeToJson('./employeeAttributes.json', empAttributeList);
    },
    finalTimeoutValue);
}


function writeToJson(filePath, empAttributeList) {
    jsonfile.writeFile(filePath, empAttributeList, {spaces: 2}, function(err) {
        if(err) console.log(err);
        else console.log('DONE WRITING TO JSON!');
    })
}

