$(document).ready(function() {
    // initialize tooltip
    $('[data-toggle="tab"], [data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });

    // initialize popover
    $('[data-toggle="popover"]').popover({
        trigger: 'hover focus',
        placement: 'left',
        html: true,
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-title"></h3><div class="popover-content card-group d-flex justify-content-between"></div></div>'
    });
});

function formatDate(date, format) {
    var monthShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    var monthLong = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]
    var day = date.substr(8, 2);
    var m = date.substr(5, 2);
    var monthIndex;
    var y = date.substr(0, 4);
    var ys = date.substr(2, 2);

    if (parseInt(m) < 10) {
        monthIndex = date.substr(6, 1);
        var monthDigit = '0' + parseInt(m);
    } else {
        monthIndex = m;
        var monthDigit = parseInt(m)
    }

    var month = parseInt(monthIndex) - 1;
    var year = parseInt(y);
    var yearShort = parseInt(ys);
    var result;

    // use these formats as second parameters to output different formats
    if (format === 'M yyyy') {
        result = monthShort[month] + ' ' + year;
    } else if (format === 'MMM yyyy') {
        result = monthLong[month] + ' ' + year;
    } else if (format === 'dd-M-yy') {
        result = day + '-' + monthShort[month] + '-' + yearShort;
    } else if (format === 'MMMM dd, yyyy') {
        result = monthLong[month] + ' ' + day + ', ' + year;
    } else if (format === 'yyyy-mm-dd') {
        result = year + '-' + monthDigit + '-' + day;
    } else if (format === 'mm-yyyy') {
        result = monthDigit + '-' + year;
    } else if (format === 'mmyy') {
        result = m + yearShort.toString();
    }

    return result;
}

// add action in goal setting
function addAction(id, count, header, from) {
    var num = count + 1;
    $('#action-wrapper').append(
        $('<div>').addClass('accordion').attr('id', 'accordion-' + id + '-' + num).attr('role', 'tablist').attr('aria-multiselectable', 'true').append([
            $('<div>').addClass('card bg-transparent mb-3').append(
                $('<a>').addClass('action-header-link').attr('href', '#collapse-set-' + id + '-' + num).attr('data-toggle', 'collapse').attr('data-parent', '#set-' + id + '-' + num).attr('aria-expanded', 'true').attr('aria-controls', 'collapse-set-' + id + '-' + num).append(
                    $('<div>').addClass('action-header card-header bg-white').attr('id', 'set-' + id + '-' + num).attr('role', 'tab').append(
                        $('<div>').addClass('action-header-text d-inline-block mb-0 h6 font-weight-bold').html('<i class="fa fa-dot-circle-o fa-lg mr-1" aria-hidden="true"></i>' + header + ' ' + num)
                    )
                ),
                $('<div>').attr('id', 'collapse-set-' + id + '-' + num).addClass('action-body collapse bg-transparent show').attr('role', 'tabpanel').attr('aria-labelledby', 'set-' + id + '-' + num).append(
                    $('<div>').addClass('goal-actions card-body').append(
                        $('<div>').addClass('form-group').append(
                            $('<label>').addClass('d-inline-block font-weight-bold text-dark-blue').html('<i class="fa fa-dot-circle-o fa-lg mr-1" aria-hidden="true"></i>' + header)
                        ).append(
                            $('<input>').addClass('goal-action form-control').attr('type', 'text').attr('name', 'action').attr('required', 'required')
                        )
                    ).append(
                        $('<div>').addClass('form-inline mt-4').append(
                            $('<label>').addClass('font-weight-bold text-dark-blue mr-5').html('<i class="fa fa-calendar-times-o fa-lg mr-1" aria-hidden="true"></i> Due Date:')
                        ).append(
                            $('<input>').addClass('date-select form-control').attr('type', 'date').attr('name', 'due_date').attr('required', 'required')
                        )
                    ).append(
                        $('<div>').addClass('card-deck mt-3').append(
                            $('<div>').addClass('card bg-transparent').append(
                                $('<div>').addClass('card-body text-center').append(
                                    $('<label>').addClass('d-block font-weight-bold text-dark-blue').html ('<i class="fa fa-clock-o fa-lg mr-1" aria-hidden="true"></i> Wage Cost')
                                ).append(
                                    $('<div>').addClass('d-flex justify-content-between input-group').append([
                                        $('<span>').addClass('input-group-addon').html('$'),
                                        $('<input>').addClass('form-control w-15').attr('type', 'number').attr('name', 'hourly_cost'),
                                        $('<span>').addClass('input-group-addon').html('/'),
                                        $('<input>').addClass('form-control').attr({'type': 'text', 'placeholder': 'Optional'}).attr('name', 'hc_cost_type').tooltip({
                                            trigger: 'focus',
                                            title: '<i>eg. "hour", "month", etc.</i>',
                                            html: true
                                        })
                                    ])
                                )
                            )
                        ).append(
                            $('<div>').addClass('card bg-transparent').append(
                                $('<div>').addClass('card-body text-center').append(
                                    $('<label>').addClass('d-block font-weight-bold text-dark-blue').html ('<i class="fa fa-dollar fa-lg mr-1" aria-hidden="true"></i> Training Cost')
                                ).append(
                                    $('<div>').addClass('d-flex justify-content-between input-group').append([
                                        $('<span>').addClass('input-group-addon').html('$'),
                                        $('<input>').addClass('form-control w-15').attr('type', 'number').attr('name', 'training_cost'),
                                        $('<span>').addClass('input-group-addon').html('/'),
                                        $('<input>').addClass('form-control').attr({'type': 'text', 'placeholder': 'Optional'}).attr('name', 'tc_cost_type').tooltip({
                                            trigger: 'focus',
                                            title: '<i>eg. "course", "day", etc.</i>',
                                            html: true
                                        })
                                    ])
                                )
                            )
                        ).append(
                            $('<div>').addClass('card bg-transparent').append(
                                $('<div>').addClass('card-body text-center').append(
                                    $('<label>').addClass('d-block font-weight-bold text-dark-blue').html ('<i class="fa fa-money fa-lg mr-1" aria-hidden="true"></i> Expenses')
                                ).append(
                                    $('<div>').addClass('d-flex justify-content-between input-group').append([
                                        $('<span>').addClass('input-group-addon').html('$'),
                                        $('<input>').addClass('form-control w-15').attr('type', 'number').attr('name', 'expenses'),
                                        $('<span>').addClass('input-group-addon').html('for'),
                                        $('<input>').addClass('form-control').attr({'type': 'text', 'placeholder': 'Optional'}).attr('name', 'exp_cost_type').tooltip({
                                            trigger: 'focus',
                                            title: '<i>eg. "transit", "lodging" etc.</i>',
                                            html: true
                                        })
                                    ])
                                )
                            )
                        )
                    ).append(
                        $('<div>').addClass('text-right mt-2').append([
                            $('<button>').attr('type', 'button').html('<i class="fa fa-trash fa-lg mr-1" aria-hidden="true"></i>Remove').addClass('btn btn-danger').on('click', function() {
                                $(this).parent().parent().parent().parent().parent().remove();
                                actionCount--;
                                $('.accordion').each(function(i) {
                                    $(this).attr('id', 'accordion-' + id + '-' + (i));
                                });
                                $('.action-header-link').each(function(i) {
                                    $(this).attr('href', '#collapse-set-' + id + '-' + (i + 1)).attr('data-parent', '#set-' + id + '-' + (i + 1)).attr('aria-controls', 'collapse-set-' + id + '-' + (i + 1));
                                });
                                $('.action-header').each(function(i) {
                                    $(this).attr('id', 'set-' + id + '-' + (i + 1));
                                });
                                $('.action-header-text').each(function(i) {
                                    $(this).html(header + ' ' + (i + 1));
                                });
                                $('.action-body').each(function(i) {
                                    $(this).attr('id', 'collapse-set-' + id + '-' + (i + 1)).attr('aria-labelledby', 'set-' + id + '-' + (i + 1));
                                });
                            })
                        ])
                    )
                )
            )
        ])
    )
}

// create current date variables
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth() + 1;
var currentDay = currentDate.getDate();
if (parseInt(currentMonth) < 10 && parseInt(currentMonth) > 3) {
    var start_date = currentYear + '-04-01';
    var end_date = currentYear + '-09-30';
    var date_code = '04' + currentYear.toString().substr(2, 2) + '-09' + currentYear.toString().substr(2 ,2);
}  else {
    var start_date = currentYear + '-10-01';
    var end_date = currentYear + 1 + '-03-31';
    var date_code = '10' + currentYear.toString().substr(2, 2) + '-03' + (currentYear + 1).toString().substr(2, 2);
}

// create checkin accordions
function createCheckins(resp, form_url, i) {
    if (i === 0) { // check if it's first one created
        var collapsed = 'collapsed';
        var show = 'show';
    } else {
        var collapsed;
        var show;
    }

    var content;
    var employeeSubmitted;
    var managerSubmitted;

    // check if employee already submitted checkin
    if (resp.checkin.length > 0) {
        $(resp.checkin).each(function(index) {
            // check if action id in actions table matches with action id in checkins table
            if (resp.action[i].a_id === resp.checkin[index].c_a_id) {
                employeeSubmitted = true;
                content = $('<div>').addClass('card-footer bg-info-light d-flex justify-content-start align-items-center').append(
                    $('<div class="mr-3">').html('<i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i>')
                ).append(
                    $('<div>').append(
                        $('<span>').addClass('d-block').html('<b>Employee Comment:</b> ' + resp.checkin[index].employee_checkin_comment)
                    ). append(
                        $('<span>').html('<b>Submitted on:</b> ' + formatDate(resp.checkin[index].checkin_date, 'MMMM dd, yyyy'))
                    )
                )
                return false;
            } else { // if not, warning manager employee has not checked in yet
                employeeSubmitted = false;
                content = $('<div>').addClass('card-footer bg-danger-light d-flex align-items-center font-weight-bold').html('<i class="fa fa-exclamation-circle fa-lg mr-1" aria-hidden="true"></i> Employee has not check into this action')
            }
        });
    } else {
        employeeSubmitted = false;
        content = $('<div>').addClass('card-footer bg-danger-light d-flex align-items-center font-weight-bold').html('<i class="fa fa-exclamation-circle fa-lg mr-1" aria-hidden="true"></i> Employee has not check into this action')
    }

    // if there is checkin
    if (resp.checkin.length > 0) {
        $(resp.checkin).each(function(index) {
            // check if action id in actions table matches with action id in checkins table AND if manager submitted checkin
            if (resp.action[i].a_id === resp.checkin[index].c_a_id && resp.checkin[index].manager_checkin_comment) {
                managerSubmitted = $('<div>').addClass('alert alert-success mb-3').append(
                    $('<div>').addClass('font-weight-bold').html('<i class="fa fa-check fa-lg mr-1" aria-hidden="true"></i> You already submitted your checkin for this employee&#39;s action')
                )
                return false;
            } else { // else show form
                if (employeeSubmitted) { // if employee submitted their checkin
                    var state = false; // enable the form
                } else {
                    var state = true; // otherwise, disable form
                }
                managerSubmitted = $('<form>').addClass('manager-checkin-form').attr('method', 'POST').attr('action', form_url).append(
                    $('<div>').addClass('form-group').append(
                        $('<label>').addClass('d-block font-weight-bold').text('Manager Comment')
                    ).append(
                        $('<div>').addClass('d-inline-block w-85 align-top').append(
                            $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp.action[i].a_id})
                        ).append(
                            $('<input>').addClass('form-control').attr({'type': 'text', 'name': 'comment', 'placeholder': "What have you observed about the employee's efforts toward this action?", 'disabled': state, 'title': 'Make sure employee check-in first. Simultaneous check-in can cause an error.', 'data-toggle': 'tooltip'})
                        )
                    ).append(
                        $('<div>').addClass('d-inline-block w-15 align-top').append(
                            $('<div>').addClass('d-flex justify-content-around').append(
                                $('<button>').addClass('no-bg').attr('type', 'reset').append(
                                    $('<i>').addClass('fa fa-times fa-lg').attr('aria-hidden', 'true')
                                )
                            ).append(
                                $('<button>').addClass('btn btn-primary').attr('id', 'manager-checkin-button-' + resp.action[i].a_id).attr('type', 'submit').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit')
                            )
                        )
                    )
                )
            }
        });
    }  else {
        if (employeeSubmitted) {
            var state = false;
        } else {
            var state = true;
        }
        managerSubmitted = $('<form>').addClass('manager-checkin-form').attr('method', 'POST').attr('action', form_url).append(
            $('<div>').addClass('form-group').append(
                $('<label>').addClass('d-block font-weight-bold').text('Manager Comment')
            ).append(
                $('<div>').addClass('d-inline-block w-85 align-top').append(
                    $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp.action[i].a_id})
                ).append(
                    $('<input>').addClass('form-control').attr({'type': 'text', 'name': 'comment', 'placeholder': "What have you observed about the employee's efforts toward this action?", 'disabled': state})
                )
            ).append(
                $('<div>').addClass('d-inline-block w-15 align-top').append(
                    $('<div>').addClass('d-flex justify-content-around').append(
                        $('<button>').addClass('no-bg').attr('type', 'reset').append(
                            $('<i>').addClass('fa fa-times fa-lg').attr('aria-hidden', 'true')
                        )
                    ).append(
                        $('<button>').addClass('btn btn-primary').attr('id', 'manager-checkin-button-' + resp.action[i].a_id).attr('type', 'submit').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit')
                    )
                )
            )
        )
    }

    $('#ev-checkin-actions').addClass('accordion').attr('role', 'tablist').attr('aria-multiselectable', 'true').append(
        $('<div>').addClass('card bg-transparent mb-1').append(
            $('<a>').addClass(collapsed).attr('data-toggle', 'collapse').attr('data-parent', '#ev-checkin-actions').attr('href', '#collapse-ev-checkin-actions-' + resp.action[i].a_id).append(
                $('<div>').addClass('card-header bg-white').attr('role', 'tab').attr('id', 'ev-ca-' + resp.action[i].a_id).append(
                    $('<h6>').addClass('d-inline-block mb-0').html('<i class="fa fa-dot-circle-o fa-lg mr-1" aria-hidden="true"></i>' + resp.action[i].action)
                )
            )
        ).append(
            $('<div>').addClass('collapse bg-transparent ' + show).attr('role', 'tabpanel').attr('aria-labelledby', 'ev-ca-' + resp.action[i].a_id).attr('id', 'collapse-ev-checkin-actions-' + resp.action[i].a_id).append([
                $('<div>').addClass('card-body').append([
                    $('<div>').addClass('manager-ck-comment'),
                    managerSubmitted
                ]),
                content
            ])
        )
    )
}

// create goal review accordions
function createGoalReview(resp, form_url, i) {
    if (i === 0) { // check if it's first one created
        var collapsed = 'collapsed';
        var show = 'show';
    } else {
        var collapsed;
        var show;
    }

    var grEmployeeComment;
    var employeeSubmitted;
    var grManagerComment;

    if (resp.goal_review.length > 0) { // if there is goal review
        var gr_id = resp.goal_review[0].gr_id;
        $(resp.goal_review).each(function(index) {
            if (resp.action[i].a_id === resp.goal_review[index].gr_a_id) { // check if action id in actions table matches with action id in goal review table
                employeeSubmitted = true;
                grEmployeeComment = $('<div>').addClass('card-footer bg-info-light d-flex justify-content-start align-items-center').append(
                    $('<div class="mr-3">').html('<i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i>')
                ).append(
                    $('<div>').append(
                        $('<span>').addClass('d-block').html('<b>Employee Comment:</b> ' + resp.goal_review[index].employee_gr_comment)
                    ).append(
                        $('<span>').html('<b>Submitted on:</b> ' + formatDate(resp.goal_review[index].submitted_on, 'MMMM dd, yyyy'))
                    )
                )
                return false;
            } else { // if not, warn manager that employee has not submitted goal review
                employeeSubmitted = false;
                grEmployeeComment = $('<div>').addClass('card-footer bg-danger-light d-flex align-items-center font-weight-bold').html('<i class="fa fa-exclamation-circle fa-lg mr-1" aria-hidden="true"></i>Employee has not submitted a review for this action')
            }
        });
    } else {
        employeeSubmitted = false;
        grEmployeeComment = $('<div>').addClass('card-footer bg-danger-light d-flex align-items-center font-weight-bold').html('<i class="fa fa-exclamation-circle fa-lg mr-1" aria-hidden="true"></i>Employee has not submitted a review for this action')
    }

    if (resp.goal_review.length > 0) {
        $(resp.goal_review).each(function(index) {
            if (resp.action[i].a_id === resp.goal_review[index].gr_a_id && resp.goal_review[index].manager_gr_comment) {
                grManagerComment = $('<div>').addClass('alert alert-success').append([
                    $('<div>').html('<i class="fa fa-commenting-o fa-lg mr-1" aria-hidden="true"></i><b>Manager Comment: </b> ' + resp.goal_review[index].manager_gr_comment),
                    $('<div>').html('<i class="fa fa-calendar-check-o fa-lg mr-1" aria-hidden="true"></i><b>Submitted on: </b>' + formatDate(resp.goal_review[index].reviewed_on, 'MMMM dd, yyyy'))
                ]);
                return false;
            } else if (userData.auth === 'HR' || userData.auth === 'Manager') {
                if (employeeSubmitted) {
                    var state = false;
                } else {
                    var state = true;
                }
                grManagerComment = $('<form>').addClass('manager-gr-form').attr('method', 'POST').attr('action', form_url).append(
                    $('<div>').addClass('form-group').append(
                        $('<label>').addClass('d-block font-weight-bold').text('Manager Comment')
                    ).append(
                        $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp.action[i].a_id})
                    ).append(
                        $('<input>').addClass('form-control').attr({'type': 'text', 'name': 'comment', 'placeholder': "What have you observed about the employee's efforts toward this action?", 'disabled': state})
                    )
                ).append(
                    $('<div>').addClass('form-group mb-3').append(
                        $('<label>').addClass('d-block font-weight-bold mr-5').text('What percent of this action was completed on time?')
                    ).append(
                        $('<select>').attr({'name': 'goal_progress', 'required': 'required', 'disabled': state}).addClass('form-control').append([
                            $('<option>'),
                            $('<option>').attr('value', '0').text('0%'),
                            $('<option>').attr('value', '10').text('10%'),
                            $('<option>').attr('value', '20').text('20%'),
                            $('<option>').attr('value', '30').text('30%'), 
                            $('<option>').attr('value', '40').text('40%'), 
                            $('<option>').attr('value', '50').text('50%'), 
                            $('<option>').attr('value', '60').text('60%'), 
                            $('<option>').attr('value', '70').text('70%'), 
                            $('<option>').attr('value', '80').text('80%'), 
                            $('<option>').attr('value', '90').text('90%'), 
                            $('<option>').attr('value', '100').text('100%'), 
                        ])
                    )
                ).append(
                    $('<div>').addClass('form-group mb-3').append([
                        $('<label>').addClass('d-block font-weight-bold mr-5').text('Was this action effective towards the employees competence and knowledge?'),
                        $('<select>').addClass('form-control').attr({'name': 'goal_effectiveness', 'required': 'required', 'disabled': state}).append([
                            $('<option>'),
                            $('<option>').text('Not effective'),
                            $('<option>').text('Somewhat effective'),
                            $('<option>').text('Effective'),
                            $('<option>').text('Very effective'),
                            $('<option>').text('Extremely effective'),
                        ])
                    ])
                ).append(
                    $('<div>').addClass('text-right w-100').append(
                        $('<button>').addClass('btn btn-primary').attr('type', 'submit').attr('id', 'manager-gr-button-' + resp.action[i].a_id).html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit')
                    )
                )
            }
        })
    } else {
        if (employeeSubmitted) {
            var state = false;
        } else {
            var state = true;
        }
        grManagerComment = $('<form>').addClass('manager-gr-form').attr('method', 'POST').attr('action', form_url).append(
            $('<div>').addClass('form-group').append(
                $('<label>').addClass('d-block font-weight-bold').text('Manager Comment')
            ).append(
                $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp.action[i].a_id})
            ).append(
                $('<input>').addClass('form-control').attr({'type': 'text', 'name': 'comment', 'placeholder': "What have you observed about the employee's efforts toward this action?", 'disabled': state})
            )
        ).append(
            $('<div>').addClass('form-group mb-3').append(
                $('<label>').addClass('d-block font-weight-bold mr-5').text('What percent of this action was completed on time?')
            ).append(
                $('<select>').attr({'name': 'goal_progress', 'required': 'required', 'disabled': state}).addClass('form-control').append([
                    $('<option>'),
                    $('<option>').attr('value', '0').text('0%'),
                    $('<option>').attr('value', '10').text('10%'),
                    $('<option>').attr('value', '20').text('20%'),
                    $('<option>').attr('value', '30').text('30%'), 
                    $('<option>').attr('value', '40').text('40%'), 
                    $('<option>').attr('value', '50').text('50%'), 
                    $('<option>').attr('value', '60').text('60%'), 
                    $('<option>').attr('value', '70').text('70%'), 
                    $('<option>').attr('value', '80').text('80%'), 
                    $('<option>').attr('value', '90').text('90%'), 
                    $('<option>').attr('value', '100').text('100%'), 
                ])
            )
        ).append(
            $('<div>').addClass('form-group mb-3').append([
                $('<label>').addClass('d-block font-weight-bold mr-5').text('Was this action effective towards the employees competence and knowledge?'),
                $('<select>').addClass('form-control').attr({'name': 'goal_effectiveness', 'required': 'required', 'disabled': state}).append([
                    $('<option>'),
                    $('<option>').text('Not effective'),
                    $('<option>').text('Somewhat effective'),
                    $('<option>').text('Effective'),
                    $('<option>').text('Very effective'),
                    $('<option>').text('Extremely effective'),
                ])
            ])
        ).append(
            $('<div>').addClass('text-right w-100').append(
                $('<button>').addClass('btn btn-primary').attr('type', 'submit').attr('id', 'manager-gr-button-' + resp.action[i].a_id).html('<i class="fa fa-level-down fa-rotate-90 fa-lg" aria-hidden="true"></i>')
            )
        )
    }

    $('#ev-gr-actions').addClass('accordion').attr('role', 'tablist').attr('aria-multiselectable', 'true').append(
        $('<div>').addClass('card bg-transparent mb-1').append(
            $('<a>').addClass(collapsed).attr('data-toggle', 'collapse').attr('data-parent', '#ev-gr-actions').attr('href', '#collapse-ev-gr-actions-' + resp.action[i].a_id).append(
                $('<div>').addClass('card-header bg-white').attr('role', 'tab').attr('id', 'ev-gra-' + resp.action[i].a_id).append(
                    $('<h6>').addClass('d-inline-block mb-0').html('<i class="fa fa-dot-circle-o fa-lg mr-1" aria-hidden="true"></i>' + resp.action[i].action)
                )
            ) 
        ).append(
            $('<div>').addClass('collapse bg-transparent ' + show).attr('role', 'tabpanel').attr('aria-labelledby', 'ev-gra-' + resp.action[i].a_id).attr('id', 'collapse-ev-gr-actions-' + resp.action[i].a_id).append([
                $('<div>').addClass('card-body').append([
                    $('<div>').attr('id', 'manager-gr-comments'),
                    grManagerComment
                ]),
                grEmployeeComment
            ])
        )
    )
}

function createGoalPrep(obj, i) {
    $('#plan').append(
        $('<div>').addClass('card bg-transparent mb-3').append(
            $('<div>').addClass('card-body').append(
                $('<h6>').text(obj[i].question)
            ).append(
                $('<div>').addClass('card bg-transparent').append(
                    $('<div>').addClass('card-body').html(obj[i].answer)
                )
            )
        )
    )
}

function createEmployeeActions(obj, i) {
    var select = false;
    $('#ev-goal-overview').append(
        $('<div>').addClass('card bg-transparent mb-3').attr('id', 'ev-action-' + obj.action[i].a_id).append([
            $('<div>').addClass('card-header bg-white d-flex justify-content-between align-items-center').append(
                $('<h6>').addClass('text-dark-blue').html('<i class="fa fa-dot-circle-o fa-lg mr-1" aria-hidden="true"></i>Action ' + (i + 1))
            ),
            $('<form>').addClass('edit-emp-action-form').attr({'method': 'POST', 'action': '/edit-employee-action'}).append([
                $('<div>').addClass('card-body').append([
                    $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': obj.action[i].a_id}),
                    $('<input>').addClass('form-control mb-2').attr({'type': 'text', 'name': 'action', 'readonly': 'readonly'}).val(obj.action[i].action),
                    $('<div>').addClass('d-flex justify-content-between mb-2').append([
                        $('<div>').addClass('w-24 input-group').append([
                            $('<span>').addClass('input-group-addon').html('<i class="fa fa-calendar-times-o fa-lg mr-1" aria-hidden="true"></i>'),
                            $('<input>').addClass('form-control').attr({'type': 'date', 'readonly': 'readonly', 'name': 'due_date'}).val(formatDate(obj.action[i].due_date, 'yyyy-mm-dd'))
                        ]).tooltip({
                            trigger: 'hover',
                            title: 'Due Date'
                        }),
                        $('<div>').addClass('w-24 input-group').append(
                            $('<span>').addClass('input-group-addon').html('<i class="fa fa-clock-o fa-lg mr-1" aria-hidden="true"></i>'),
                            $('<input>').addClass('form-control').attr({'type': 'number', 'readonly': 'readonly', 'name': 'hourly_cost'}).val(obj.action[i].hourly_cost),
                            $('<span>').addClass('input-group-addon').html('/'),
                            $('<input>').addClass('form-control').attr({'type': 'text', 'readonly': 'readonly', 'name': 'hc_cost_type'}).val(obj.action[i].hc_cost_type)
                        ).tooltip({
                            trigger: 'hover',
                            title: 'Wage Cost'
                        }),
                        $('<div>').addClass('w-24 input-group').append(
                            $('<span>').addClass('input-group-addon').html('<i class="fa fa-dollar fa-lg mr-1" aria-hidden="true"></i>'),
                            $('<input>').addClass('form-control').attr({'type': 'number', 'readonly': 'readonly', 'name': 'training_cost'}).val(obj.action[i].training_cost),
                            $('<span>').addClass('input-group-addon').html('/'),
                            $('<input>').addClass('form-control').attr({'type': 'text', 'readonly': 'readonly', 'name': 'tc_cost_type'}).val(obj.action[i].tc_cost_type)
                        ).tooltip({
                            trigger: 'hover',
                            title: 'Training Cost'
                        }),
                        $('<div>').addClass('w-24 input-group').append(
                            $('<span>').addClass('input-group-addon').html('<i class="fa fa-money fa-lg mr-1" aria-hidden="true"></i>'),
                            $('<input>').addClass('form-control').attr({'type': 'number', 'readonly': 'readonly', 'name': 'expenses'}).val(obj.action[i].expenses),
                            $('<input>').addClass('form-control').attr({'type': 'text', 'readonly': 'readonly', 'name': 'exp_cost_type'}).val(obj.action[i].exp_cost_type)
                        ),
                    ]).tooltip({
                            trigger: 'hover',
                            title: 'Expenses'
                        }),
                    $('<div>').addClass('text-right').append([
                        $('<button>').addClass('btn btn-info').attr('type', 'button').html('<i class="fa fa-edit fa-lg mr-1" aria-hidden="true"></i>Edit').click(function() {
                            $('#ev-action-' + obj.action[i].a_id).find('input').not('input[type=hidden]').removeAttr('readonly');
                            $(this).siblings().show();
                            $(this).hide();
                        }),
                        $('<button>').addClass('btn btn-primary mr-1').attr('type', 'submit').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-1" aria-hidden="true"></i>Submit').hide(),
                        $('<button>').addClass('btn btn-danger').attr('type', 'button').html('<i class="fa fa-times fa-lg mr-1" aria-hidden="true"></i>Cancel').click(function() {
                            var inputs = $('#ev-action-' + obj.action[i].a_id).find('input').not('input[type=hidden]');
                            $(inputs).eq(0).attr('readonly', 'readonly').val(obj.action[i].action);
                            $(inputs).eq(1).attr('readonly', 'readonly').val(formatDate(obj.action[i].due_date, 'yyyy-mm-dd'));
                            $(inputs).eq(2).attr('readonly', 'readonly').val(obj.action[i].hourly_cost);
                            $(inputs).eq(3).attr('readonly', 'readonly').val(obj.action[i].hc_cost_type);
                            $(inputs).eq(4).attr('readonly', 'readonly').val(obj.action[i].training_cost);
                            $(inputs).eq(5).attr('readonly', 'readonly').val(obj.action[i].tc_cost_type);
                            $(inputs).eq(6).attr('readonly', 'readonly').val(obj.action[i].expenses);
                            $(inputs).eq(7).attr('readonly', 'readonly').val(obj.action[i].exp_cost_type);

                            $(this).parent().find('button:contains("Edit")').show();
                            $(this).parent().find('button:contains("Submit")').hide();
                            $(this).hide();
                        }).hide()
                    ])
                ])
            ])
        ])
    )
}

function displayStatus(message, statusClass, iconName) {
    var statusMessage = '<i class="fa ' + iconName + ' fa-lg mr-1" aria-hidden="true"></i>' + message;

    $('#status-message div').html(statusMessage);
    $('#status-message').addClass(statusClass).animate({
        'top': '0'
    });
}

function dismissStatus(timeout) {
    $('#dismiss-status-message').click(function() {
        clearTimeout(timeout);
        $('#status-message').animate({
            'top': '-50px'
        });
    });
}

function statusMessageTimeout() {
    setTimeout(function() {
        $('#status-message').animate({
            'top': '-50px'
        })
    }, 2000);
}

function expandCollapse(button, parentTable, dataTable, type) {
    if (type === 'collapse') {
        var addClass = 'hidden';
        var removeClass = 'shown';
        var buttonHTML = '<i class="pntr fa fa-plus-circle text-green text-border" aria-hidden="true">';
    } else if (type === 'expand') {
        var addClass = 'shown';
        var removeClass = 'hidden';
        var buttonHTML = '<i class="pntr fa fa-minus-circle text-red text-border" aria-hidden="true">';
    }

    $(button).click(function() {
        var shownRows = $(parentTable).find('tbody tr.' + removeClass);
        for(var i = 0; i < shownRows.length; i++) {
            var tr = shownRows[i];
            var row = dataTable.row(tr);
            if (type === 'expand') {
                row.child.show();
            } else if (type === 'collapse') {
                row.child.hide();
            }
            $(tr).addClass(addClass).removeClass(removeClass);
            $(tr).find('.details-control').html(buttonHTML);
        }
    })
}

function selectAllOrNone(parent, bool, type) {
    $(parent).find('button:contains("' + type + '")').click(function() {
        $(parent).find('select option').prop('selected', bool);
    });
}

function createActionAccordion(resp) {
    $('<div>').addClass('card bg-transparent mb-3 h-0').css('display', 'none').attr('id', 'action-div-' + resp.action.a_id).append([
        $('<div>').addClass('card-header d-flex justify-content-between align-items-center bg-white').append([
            $('<h6>').addClass('font-weight-bold text-dark-blue mb-0').append([
                $('<i>').addClass('fa fa-dot-circle-o fa-lg mr-1').attr('aria-hidden', 'true'),
                $('<span>').addClass('edit-action-header').html('Action ' + (actionCount + 1))
            ]),
            $('<form>').addClass('delete-action').attr({'method': 'POST', 'action': '/delete-action'}).append([
                $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp.action[0].a_id}),
                $('<button>').addClass('delete-action-button btn btn-danger btn-sm').attr('type', 'submit').html('<i class="fa fa-trash-o mr-1" aria-hidden="true"></i>Delete')
            ])
        ]),
        $('<div>').addClass('card-body').append(
            $('<form>').attr({'method': 'POST', 'action': '/edit-action', 'id': 'edit-action-' + (actionCount + 1)}).append([
                $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp.action[0].a_id}),
                $('<input>').addClass('d-inline-block form-control').attr({'type': 'text', 'name': 'action', 'readonly': 'readonly', 'value': resp.action[0].action}),
                $('<div>').addClass('d-flex justify-content-between mt-2 mb-2').append([
                    $('<div>').addClass('input-date w-24 input-group d-flex flex-row').attr({'data-toggle': 'tooltip', 'title': 'Due Date'}).append([
                        $('<span>').addClass('input-group-addon').append(
                            $('<i>').addClass('fa fa-calendar-times-o fa-lg').attr('aria-hidden', 'true')
                        ),
                        $('<input>').addClass('d-flex flex-row form-control').attr({'type': 'date', 'value': formatDate(resp.action[0].due_date, 'yyyy-mm-dd'), 'name': 'due_date', 'readonly': 'readonly'})
                    ]),
                    $('<div>').addClass('w-24').append(
                        $('<div>').addClass('input-group').attr({'data-toggle': 'tooltip', 'title': 'Wage Cost'}).append([
                            $('<span>').addClass('input-group-addon').append(
                                $('<i>').addClass('fa fa-clock-o fa-lg').attr('aria-hidden', 'true')
                            ),
                            $('<input>').addClass('form-control').attr({'type': 'text', 'value': resp.action[0].hourly_cost, 'name': 'hourly_cost', 'readonly': 'readonly'})
                        ])
                    ),
                    $('<div>').addClass('w-24').append(
                        $('<div>').addClass('input-group').attr({'data-toggle': 'tooltip', 'title': 'Training Cost'}).append([
                            $('<span>').addClass('input-group-addon').append(
                                $('<i>').addClass('fa fa-dollar fa-lg').attr('aria-hidden', 'true')
                            ),
                            $('<input>').addClass('form-control').attr({'type': 'text', 'value': resp.action[0].training_cost, 'name': 'training_cost', 'readonly': 'readonly'})
                        ])
                    ),
                    $('<div>').addClass('w-24').append(
                        $('<div>').addClass('input-group').attr({'data-toggle': 'tooltip', 'title': 'Expenses'}).append([
                            $('<span>').addClass('input-group-addon').append(
                                $('<i>').addClass('fa fa-money fa-lg').attr('aria-hidden', 'true')
                            ),
                            $('<input>').addClass('form-control').attr({'type': 'text', 'value': resp.action[0].expenses, 'name': 'expenses', 'readonly': 'readonly'})
                        ])
                    )
                ]),
                $('<div>').addClass('edit-action-controls form-group text-right').append(
                    $('<button>').addClass('edit-action-button btn btn-info').attr({'type': 'button', 'data-edit': 'false'}).html("<i class=\"fa fa-edit fa-lg mr-1\" aria-hidden=\"true\"></i>Edit").click(function() {
                        if($(this).attr('data-edit') === 'false') {
                            $(this).hide();
                            $(this).parent().prepend([
                                $('<button>').addClass('btn btn-primary mr-1').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit').attr('type', 'submit'),
                                $('<button>').addClass('btn btn-danger').attr('type', 'button').html('<i class="fa fa-times fa-lg mr-1" aria-hidden="true"></i>Cancel').click(function() {
                                    $('#edit-action-' + (actionCount + 1) + ' :input[name=action]').attr('readonly', '').val(resp.action[0].action);
                                    $('#edit-action-' + (actionCount + 1) + ' :input[name=due_date]').attr('readonly', '').val(formatDate(resp.action[0].due_date, 'yyyy-mm-dd'));
                                    $('#edit-action-' + (actionCount + 1) + ' :input[name=hourly_cost]').attr('readonly', '').val(resp.action[0].hourly_cost);
                                    $('#edit-action-' + (actionCount + 1) + ' :input[name=training_cost]').attr('readonly', '').val(resp.action[0].training_cost);
                                    $('#edit-action-' + (actionCount + 1) + ' :input[name=expenses]').attr('readonly', '').val(resp.action[0].expenses);
                                    $(this).siblings().eq(1).attr('data-edit', 'false').show();
                                    $(this).siblings().eq(0).remove();
                                    $(this).remove();
                                })
                            ])

                            $('#edit-action-' + (actionCount + 1) + ' :input').not(':button, :hidden').each(function() {
                                $(this).removeAttr('readonly');
                            });

                            $(this).hide();
                            $(this).attr('data-edit', 'true');
                        }
                    })
                )
            ])
        )
    ]).appendTo('#actions-wrapper').slideDown('slow');
    actionCount++;
}

function deleteRemaining(a_id) {
    $('#accordion-overview #overview-action-div-' + a_id).remove();
    $('#accordion-checkins #checkin-action-div-' + a_id).remove();
    $('#accordion-goal-review #goal-review-action-div-' + a_id).remove();

    if (actions.length === 0) {
        $('#overview-action-wrapper').empty();
        $('#overview-action-wrapper').append(
            $('<div>').addClass('alert alert-info mx-auto mt-5 w-75 font-weight-bold text-center').html('<i class="fa fa-info-circle fa-lg mr-1" aria-hidden="true"></i>Add actions to begin achieving your goal')
        )
        $('#checkin-link').addClass('disabled').attr({'data-placement': 'top', 'title': 'You need actions to access this tab'});
        $('#goal-review-link').addClass('disabled').attr({'data-placement': 'top', 'title': 'You need actions to access this tab'});
    }
}

function addTo(resp) {
    $('#accordion-overview').append(
        $('<div>').addClass('card mb-1 bg-transparent').attr('id', 'overview-action-div-' + resp.action[0].a_id).append([
            $('<a>').attr({'data-toggle': 'collapse', 'data-parent': '#accordion-overview', 'href': '#collapse-overview-' + resp.action[0].a_id, 'aria-expanded': 'true', 'aria-controls': 'collapse-overview-' + resp.action[0].a_id}).append(
                $('<div>').addClass('card-header bg-white d-flex align-items-center').attr({'role': 'tab', 'id': 'overview-action-' + resp.action[0].a_id}).append([
                    $('<h6>').addClass('d-inline-block mb-0 font-weight-bold mr-auto').html('<i class="fa fa-dot-circle-o fa-lg mr-1" aria-hidden="true"></i>' + resp.action[0].action),
                    $('<span>').addClass('badge badge-pill badge-warning mr-2').html('Pending')
                ])
            ),
            $('<div>').addClass('collapse bg-transparent').attr({'role': 'tabpanel', 'aria-labelledby': 'overview-action-' + resp.action[0].a_id, 'id': 'collapse-overview-' + resp.action[0].a_id}).append(
                $('<div>').addClass('card-body').append(
                    $('<div>').addClass('action-items card-deck').append([
                        $('<div>').addClass('card bg-transparent').append(
                            $('<div>').addClass('card-body text-center').append([
                                $('<label>').addClass('d-block font-weight-bold text-dark-blue').html('<i class="fa fa-calendar-times-o fa-lg mr-1" aria-hidden="true"></i>Due Date'),
                                $('<span>').html(formatDate(resp.action[0].due_date, 'dd-M-yy'))
                            ])
                        ),
                        $('<div>').addClass('card bg-transparent').append(
                            $('<div>').addClass('card-body text-center').append([
                                $('<label>').addClass('d-block font-weight-bold text-dark-blue').html('<i class="fa fa-clock-o fa-lg mr-1" aria-hidden="true"></i>Wage Cost'),
                                $('<span>').html('$' + resp.action[0].hourly_cost + ' per ' + resp.action.hc_cost_type)
                            ])
                        ),
                        $('<div>').addClass('card bg-transparent').append(
                            $('<div>').addClass('card-body text-center').append([
                                $('<label>').addClass('d-block font-weight-bold text-dark-blue').html('<i class="fa fa-dollar fa-lg mr-1" aria-hidden="true"></i>Training Cost'),
                                $('<span>').html('$' + resp.action[0].training_cost + ' per ' + resp.action.tc_cost_type)
                            ])
                        ),
                        $('<div>').addClass('card bg-transparent').append(
                            $('<div>').addClass('card-body text-center').append([
                                $('<label>').addClass('d-block font-weight-bold text-dark-blue').html('<i class="fa fa-money fa-lg mr-1" aria-hidden="true"></i>Expenses'),
                                $('<span>').html('$' + resp.action[0].expenses + ' per ' + resp.action.exp_cost_type)
                            ])
                        )
                    ])
                )
            )
        ])
    )

    $('#accordion-checkins').append(
        $('<div>').addClass('card mb-1 bg-transparent').attr('id', 'checkin-action-div- ' + resp.action[0].a_id).append([
            $('<a>').attr({'data-toggle': 'collapse', 'data-parent': '#accordion-checkins', 'href': '#collapse-checkin-action-' + resp.action[0].a_id}).append(
                $('<div>').addClass('card-header bg-white').attr({'role': 'tab', 'id': 'checkin-action-' + resp.action[0].a_id}).append(
                    $('<h6>').addClass('d-inline-block mb-0 font-weight-bold').html('<i class="fa fa-dot-circle-o fa-lg mr-1" aria-hidden="true"></i>' + resp.action[0].action)
                )
            ),
            $('<div>').addClass('collapse bg-transparent').attr({'role': 'tabpanel', 'aria-labelledby': 'checkin-action-' + resp.action[0].a_id, 'id': 'collapse-checkin-action-' + resp.action[0].a_id}).append(
                $('<div>').addClass('card-body').append([
                    $('<div>').addClass('employee-ck-comments'),
                    $('<form>').addClass('employee-checkin').attr({'method': 'POST', 'action': '/submit-checkin/employee'}).append(
                        $('<div>').addClass('card mt-2 bg-transparent').append([
                            $('<div>').addClass('card-body').append([
                                $('<label>').addClass('d-block font-weight-bold text-dark-blue').html('<i class="fa fa-comment-o fa-lg mr-1" aria-hidden="true"></i>Employee Comment'),
                                $('<div>').addClass('d-inline-block w-85 align-top').append([
                                    $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp.action[0].a_id}),
                                    $('<input>').addClass('form-control').attr({'type': 'text', 'placeholder': 'How are you doing with this action?', 'name': 'comment'})
                                ]),
                                $('<div>').addClass('d-inline-block w-15 align-top').append(
                                    $('<div>').addClass('d-flex justify-content-around').append([
                                        $('<button>').addClass('no-bg').attr('type', 'reset').html('<i class="fa fa-times fa-lg" aria-hidden="true"></i>'),
                                        $('<button>').addClass('btn btn-primary').attr('type', 'submit').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit')
                                    ])
                                )
                            ])
                        ])
                    )
                ])
            )
        ])
    )

    $('#accordion-goal-review').append(
        $('<div>').addClass('card mb-1 bg-transparent').attr('id', 'goal-review-action-div- ' + resp.action[0].a_id).append([
            $('<a>').attr({'data-toggle': 'collapse', 'data-parent': '#accordion-goal-review', 'href': '#collapse-goal-review-' + resp.action[0].a_id}).append(
                $('<div>').addClass('card-header bg-white').attr({'role': 'tab', 'id': 'goal-review-' + resp.action[0].a_id}).append(
                    $('<h6>').addClass('d-inline-block mb-0 font-weight-bold').html('<i class="fa fa-dot-circle-o fa-lg mr-1" aria-hidden="true"></i>' + resp.action[0].action)
                )
            ),
            $('<div>').addClass('collapse bg-transparent').attr({'role': 'tabpanel', 'aria-labelledby': 'goal-review-' + resp.action[0].a_id, 'id': 'collapse-goal-review-' + resp.action[0].a_id}).append(
                $('<div>').addClass('card-body').append([
                    $('<div>').addClass('employee-gr-comments'),
                    $('<form>').addClass('employee-goal-review').attr({'method': 'POST', 'action': '/submit-goal-review/employee'}).append(
                        $('<div>').addClass('card mt-2 bg-transparent').append([
                            $('<div>').addClass('card-body').append([
                                $('<label>').addClass('d-block font-weight-bold text-dark-blue').html('<i class="fa fa-comment-o fa-lg mr-1" aria-hidden="true"></i>Employee Comment'),
                                $('<div>').addClass('d-inline-block w-85 align-top').append([
                                    $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp.action[0].a_id}),
                                    $('<input>').addClass('form-control').attr({'type': 'text', 'placeholder': 'How are you doing with this action?', 'name': 'comment'})
                                ]),
                                $('<div>').addClass('d-inline-block w-15 align-top').append(
                                    $('<div>').addClass('d-flex justify-content-around').append([
                                        $('<button>').addClass('no-bg').attr('type', 'reset').html('<i class="fa fa-times fa-lg" aria-hidden="true"></i>'),
                                        $('<button>').addClass('btn btn-primary').attr('type', 'submit').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit')
                                    ])
                                )
                            ])
                        ])
                    )
                ])
            )
        ])
    )

    if (actions.length > 0) {
        $('#checkin-link').removeClass('disabled').removeAttr('data-placement').removeAttr('title');
        $('#goal-review-link').removeClass('disabled').removeAttr('data-placement').removeAttr('title');
    }
}

function updateOthers(resp) {
    // update action divs in Overview tab
    var overviewActions = $('#overview-action-div-' + resp.action.a_id);
    $(overviewActions).find('span.overview-action-title').html(resp.action.action);
    $(overviewActions).find('div.action-items .card .card-body span').eq(0).html(formatDate(resp.action.due_date, 'dd-M-yy'));
    $(overviewActions).find('div.action-items .card .card-body span').eq(1).html('$' + resp.action.hourly_cost + ' per ' + resp.action.hc_cost_type);
    $(overviewActions).find('div.action-items .card .card-body span').eq(2).html('$' + resp.action.training_cost + ' per ' + resp.action.tc_cost_type);
    $(overviewActions).find('div.action-items .card .card-body span').eq(3).html('$' + resp.action.expenses + ' for ' + resp.action.exp_cost_type);

    // update action divs in Check-in tab
    $('#checkin-action-div-' + resp.action.a_id).find('.card-header span').html(resp.action.action);
    
    // update action divs in Goal Review tab
    $('#goal-review-action-div-' + resp.action.a_id).find('.card-header span').html(resp.action.action);
}

function createConfirmation(confirmation, callback) {
    if (confirmation === 'delete goal') {
        var message = [$('<h5>').html('Are you sure you want to delete your goal?'), $('<div>').addClass('alert alert-danger').html('<i class="fa fa-warning fa-lg mr-1" aria-hidden="true"></i>All actions, check-ins, and goal review will be deleted as well')];
    } else if (confirmation === 'delete action') {
        var message = $('<h5>').html('Are you sure you want to delete this action?');
    } else if (confirmation === 'save new goal') {
        var message = $('<h5>').html('Do you want save this goal?');
    }

    var offSetTop = $(window).scrollTop();
    $('body').css('overflow-y', 'hidden');

    $('body').append(
        $('<div>').addClass('position-absolute w-100 h-100 d-flex justify-content-center align-items-center delete-goal-confirmation').css({'top': offSetTop, 'background-color': 'rgba(0, 0, 0, 0.75)', 'z-index': 5}).append(
            $('<div>').addClass('card').append([
                $('<div>').addClass('card-body').append(message),
                $('<div>').addClass('card-footer text-right').append(
                    $('<button>').addClass('btn btn-primary mr-1').attr('type', 'button').html('<i class="fa fa-check fa-lg mr-1" aria-hidden="true"></i>Yes').click(function() {
                        $('body').find('.delete-goal-confirmation').remove();
                        $('body').css('overflow-y', '');
                        callback(true);
                    }),
                    $('<button>').addClass('btn btn-secondary').attr('type', 'button').html('<i class="fa fa-ban fa-lg mr-1" aria-hidden="true"></i>No').click(function() {
                        $('body').find('.delete-goal-confirmation').remove();
                        $('body').css('overflow-y', '');
                    })
                )
            ])
        )
    )
}