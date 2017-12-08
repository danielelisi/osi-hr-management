var actionCount = actions.length; // number of actions currently in the DOM

$(document).ready(function() {
    if (goalPrep.length === 0) {
        swal({
            text: 'Please complete your goal preparation',
            animation: false,
            allowOutsideClick: false
        });
    }

    if (goalPrep.length > 0 && goals.length === 0) {
        swal({
            html: 'Please set your goal and actions in the <b><u>Goal Setting</b></u> tab',
            animation: false,
            allowOutsideClick: false
        });
    }

    if (goalPrep.length > 0 && goals.length > 0 && actions.length === 0) {
        swal({
            html: 'Please add actions to your goal in the <b><u>Goal Setting</b></u> tab',
            animation: false,
            allowOutsideClick: false
        });
    }

    populatePeriodSelect();

    let pdpPeriodObj = getPdpPeriod();

    $('.date-select').datepicker({
        minDate: new Date() < pdpPeriodObj.start_date ? pdpPeriodObj.start_date : new Date(),
        maxDate: pdpPeriodObj.end_date
    });

    $('#get-goal-period').submit(function(e) {
        e.preventDefault();
        var loading = $('<div>').addClass('position-absolute vh-100 vw-100 bg-black-tint-75 d-flex flex-column justify-content-center align-items-center text-white').css('z-index', 7).append([
            $('<i>').addClass('fa fa-spinner fa-pulse fa-5x').attr('aria-hidden', 'true'),
            $('<span>').html('Getting data for that period...')
        ])

        window.scroll(0, 0);
        $('body').css('overflow-y', 'hidden').prepend(
            loading
        )

        location.href = '/view?period=' + $('#period-select').val();
    });

    var addActionStatus;
    $('#add-action-button').click(function() {
        if (actionCount < 4) {
            addAction('action', actionCount, 'Action', $(this).attr('data-from'));
            actionCount++;
        } else {
            swal({
                title: 'Error!',
                text: 'Cannot add more than 4 actions',
                type: 'error',
                allowOutsideClick: false
            });
        }
    });
    // employee checkin submission
    $('#accordion-checkins').on('submit', 'form.employee-checkin', function(e) {
        e.preventDefault();
        var parent = $(this);
        $.ajax({
            url: '/submit-checkin/employee',
            method: 'POST',
            data: $(this).serialize(),
            success: function(resp) {
                console.log(resp);
                if (resp.status === 'success') {
                    swal({
                        title: 'Success!',
                        text: 'Check-in successfully submitted',
                        type: 'success',
                        allowOutsideClick: false
                    });

                    $('<div>').addClass('card bg-transparent').css('display', 'none').append(
                        $('<div>').addClass('card-body').append(
                            $('<h5>').addClass('text-dark-blue').append(
                                $('<i>').addClass('fa fa-user-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                $('<span>').html('Employee\'s Submission')
                            ),
                            $('<div>').addClass('alert alert-success').append([
                                $('<div>').append([
                                    $('<i>').addClass('fa fa-commenting-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                    $('<span>').addClass('font-weight-bold').html('Employee Comment: '),
                                    $('<span>').html(resp.checkin[0].employee_checkin_comment)
                                ]),
                                $('<div>').append([
                                    $('<i>').addClass('fa fa-calendar-check-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                    $('<span>').addClass('font-weight-bold').html('Date Submitted: '),
                                    $('<span>').html(formatDate(resp.checkin[0].checkin_date, 'MMMM dd, yyyy'))
                                ]),
                                $('<div>').append([
                                    $('<i>').addClass('fa fa-line-chart fa-lg mr-1').attr('aria-hidden', 'true'),
                                    $('<span>').addClass('font-weight-bold').html('Progress: '),
                                    $('<span>').html(resp.checkin[0].progress)
                                ])
                            ])
                        )
                    ).appendTo($(parent).siblings().eq(0)).slideDown('slow')
                    
                    $(parent).remove();
                } else if (resp.status === 'fail') {
                    swal({
                        title: 'Error!',
                        text: 'An error occurred while checking in',
                        type: 'error',
                        allowOutsideClick: false
                    });
                }
            }
        });
    });

    // employee goal review submission
    $('#accordion-goal-review').on('submit', 'form.employee-goal-review', function(e) {
        e.preventDefault();
        var parent = $(this);
        $.ajax({
            url: '/submit-goal-review/employee',
            method: 'POST',
            data: $(this).serialize(),
            success: function(resp) {
                console.log(resp);
                if (resp.status === 'success') {
                    swal({
                        title: 'Success!',
                        type: 'Goal review successfully submitted',
                        type: 'success',
                        allowOutsideClick: false
                    });

                    $('<div>').addClass('card bg-transparent').css('display', 'none').append(
                        $('<div>').addClass('card-body').append(
                            $('<h5>').addClass('text-dark-blue').append(
                                $('<i>').addClass('fa fa-user-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                $('<span>').html('Employee\'s Submission')
                            ),
                            $('<div>').addClass('alert alert-success').append([
                                $('<div>').append([
                                    $('<i>').addClass('fa fa-commenting-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                    $('<span>').addClass('font-weight-bold').html('Employee Comment: '),
                                    $('<span>').html(resp.goal_review[0].employee_gr_comment)
                                ]),
                                $('<div>').append([
                                    $('<i>').addClass('fa fa-calendar-check-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                    $('<span>').addClass('font-weight-bold').html('Date Submitted: '),
                                    $('<span>').html(formatDate(resp.goal_review[0].submitted_on, 'MMMM dd, yyyy'))
                                ]),
                                $('<div>').append(
                                    $('<i>').addClass('fa fa-line-chart fa-lg mr-1').attr('aria-hidden', 'true'),
                                    $('<span>').addClass('font-weight-bold').html('Final Status: '),
                                    $('<span>').html(resp.final_status[0].action_review_status)
                                )
                            ])
                        )
                    ).appendTo($(parent).siblings().eq(0)).slideDown('slow');

                    $(parent).remove();
                } else if (resp.status === 'fail') {
                    swal({
                        title: 'Error!',
                        text: 'An error occurred while submitting your goal review',
                        type: 'error',
                        allowOutsideClick: false
                    });
                }
            }
        });
    });
    // populate the employee drop down box (manager)
    $.ajax({
        url: '/populate-manager-employee-select',
        method: 'GET',
        success: function(resp) {
            $(resp).each(function(i) {
                $('#manager-employee-select').append($('<option>', {
                    id: resp[i].emp_id,
                    name: (resp[i].first_name + '-' + resp[i].last_name).toLowerCase(),
                    text: resp[i].first_name + ' ' + resp[i].last_name
                }))
            });
            // populate the date drop down box when employee is selected (manager)
            $('#manager-employee-select').change(function() {
                $.ajax({
                    url: '/populate-manager-employee-date-select/' + $(this).children(':selected').attr('id'),
                    method: 'GET',
                    success: function(resp) {
                        if (resp === 'fail') {
                            $('#manager-employee-date-select').empty();
                        } else {
                            $('#manager-employee-date-select').empty();
                             $('#manager-employee-date-select').append($('<option>').text(''));
                            $(resp).each(function(i) {
                                $('#manager-employee-date-select').append($('<option>', {
                                    id: (resp[i].start_date).substr(0, 10) + '_' + (resp[i].end_date).substr(0, 10),
                                    name: (resp[i].start_date).substr(0, 10) + '_' + (resp[i].end_date).substr(0, 10),
                                    text: formatDate(resp[i].start_date, 'MMMM dd, yyyy') + ' - ' + formatDate(resp[i].end_date, 'MMMM dd, yyyy')
                                }))
                            });
                            $('#manager-employee-date-select option:last').prop('selected', 'selected');
                        }
                    }
                });
            });
        }
    });
    // get employee data when clicking 'view'
    $('#get-employee-goal').submit(function(event) {
        event.preventDefault();
        $('#ev-link li.nav-item a').each(function(i) {
            $(this).addClass('disabled').removeClass('active');
        });
        $('#ev').hide();
        $('#fetch-employee').show();
        $('#fetch-employee-status').html('<i class="d-block fa fa-spinner fa-pulse fa-5x fa-fw mx-auto mb-2" aria-hidden="true"></i>Fetching employee data...')
        $.ajax({
            url: '/get-employee-goal',
            method: 'POST',
            data: {
                emp_id: $('#manager-employee-select option:selected').attr('id'),
                date: $('#manager-employee-date-select option:selected').attr('id')
            },
            success: function(resp) {
                console.log(resp);
                if (resp === 'fail') {
                    $('#fetch-employee-status').html('<i class="d-block fa fa-exclamation-circle fa-5x mx-auto mb-2" aria-hidden="true"></i>That employee does not exist')
                    $('#ev').hide();
                } else {
                    $('#ev-pdp-period').append(
                        $('<h4>').html(formatDate(resp.action[0].start_date, 'MMMM dd, yyyy') + ' - ' + formatDate(resp.action[0].end_date, 'MMMM dd, yyyy'))
                    );
                    $('#fetch-employee').hide();
                    $('#ev-goal-overview').empty();
                    $('#plan').empty();
                    $('#ev-checkin-actions').empty();
                    $('#ev-gr-actions').empty();
                    $('#ev').css('display', 'block');

                    $('#ev-link li.nav-item a').each(function(i) {
                        $(this).removeClass('active');
                    });

                    $('#ev-overview-link').removeClass('disabled').addClass('active').removeAttr('data-original-title');
                    $('#ev-plan-link, #ev-goal-link, #ev-checkin-link, #ev-goal-review-link').attr('data-original-title', 'Employee has not set their goal preparation yet');
                    if (resp.goal_prep.length > 0) {
                        $('#ev-plan-link').removeClass('disabled').removeAttr('data-original-title');
                        $('#ev-goal-link, #ev-checkin-link, #ev-goal-review-link').attr('data-original-title', 'Employee has not set their goal yet');
                    }
                    
                    if (resp.goal.length > 0) {
                        $('#ev-goal-link, #ev-checkin-link, #ev-goal-review-link').removeClass('disabled').removeAttr('data-original-title');
                    }
                    $('#ev-emp-name').text(resp.user.first_name + ' ' + resp.user.last_name);
                    $('#ev-emp-badge').text(resp.fields.customJobCode + resp.fields.customLevel);
                    $('#ev-emp-id').text(resp.fields.employeeNumber);
                    $('#ev-hired-date').text(resp.fields.hiredDate);
                    $('#ev-dept').text(resp.fields.department);
                    $('#ev-division').text(resp.fields.division);
                    $('#ev-title').text(resp.fields.jobTitle);
                    $('#ev-manager').text(resp.fields.supervisor);
                    $('#ev-goal').text(resp.goal[0].goal);

                    $(resp.action).each(function(i) {
                        createEmployeeActions(resp, i);
                        createCheckins(resp, '/submit-checkin/manager', i);
                        createGoalReview(resp, '/submit-goal-review/manager', i);
                    });

                    $(resp.goal_prep).each(function(i) {
                        createGoalPrep(resp.goal_prep, i);
                    });
                    // checkin submission (manager)
                    $('#ev-checkin-actions').on('submit', 'form.manager-checkin-form', function(e) {
                        e.preventDefault();
                        var parent = $(this);
                        $.ajax({
                            url: '/submit-checkin/manager',
                            method: 'POST',
                            data: $(parent).serialize(),
                            success: function(res) {
                                if (res.status === 'success') {
                                    swal({
                                        title: 'Success!',
                                        text: 'Check-in successfully submitted',
                                        type: 'success',
                                        allowOutsideClick: false
                                    });

                                    $('<div>').addClass('card bg-transparent').css('display', 'none').append(
                                        $('<div>').addClass('card-body').append(
                                            $('<h5>').addClass('text-dark-blue').append(
                                                $('<i>').addClass('fa fa-user fa-lg mr-1').attr('aria-hidden', 'true'),
                                                $('<span>').html('Manager\'s Submission')
                                            ),
                                            $('<div>').addClass('alert alert-info').append([
                                                $('<div>').append([
                                                    $('<i>').addClass('fa fa-commenting-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                                    $('<span>').addClass('font-weight-bold').html('Manager Comment: '),
                                                    $('<span>').html(res.checkin[0].manager_checkin_comment)
                                                ]),
                                                $('<div>').append([
                                                    $('<i>').addClass('fa fa-calendar-check-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                                    $('<span>').addClass('font-weight-bold').html('Date Submitted: '),
                                                    $('<span>').html(formatDate(res.checkin[0].m_check_in_date, 'MMMM dd, yyyy'))
                                                ]),
                                            ])
                                        )
                                    ).appendTo($(parent).siblings().eq(1)).slideDown('slow');

                                    $(parent).remove();
                                } else if (res.status === 'fail') {
                                    swal({
                                        title: 'Error!',
                                        text: 'An error occurred while checking in',
                                        type: 'error',
                                        allowOutsideClick: false
                                    });
                                }  
                            }
                        });
                    });

                    // goal review submission (manager)
                    $('#ev-gr-actions').on('submit', 'form.manager-gr-form', function(e) {
                        e.preventDefault();
                        var parent = $(this);
                        $.ajax({
                            url: '/submit-goal-review/manager',
                            method: 'POST',
                            data: $(this).serialize(),
                            success: function(res) {
                                if (res.status === 'success') {
                                    swal({
                                        title: 'Success!',
                                        text: 'Goal review successfully submitted',
                                        type: 'success',
                                        allowOutsideClick: false
                                    });
                                    
                                    $('<div>').addClass('card bg-transparent').css('display', 'none').append(
                                        $('<div>').addClass('card-body').append(
                                            $('<h5>').addClass('text-dark-blue').append(
                                                $('<i>').addClass('fa fa-user fa-lg mr-1').attr('aria-hidden', 'true'),
                                                $('<span>').html('Manager\'s Submission')
                                            ),
                                            $('<div>').addClass('alert alert-info').append([
                                                $('<div>').append([
                                                    $('<i>').addClass('fa fa-commenting-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                                    $('<span>').addClass('font-weight-bold').html('Manager Comment: '),
                                                    $('<span>').html(res.goal_review[0].manager_gr_comment)
                                                ]),
                                                $('<div>').append([
                                                    $('<i>').addClass('fa fa-calendar-check-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                                    $('<span>').addClass('font-weight-bold').html('Date Submitted: '),
                                                    $('<span>').html(formatDate(res.goal_review[0].reviewed_on, 'MMMM dd, yyyy'))
                                                ]),
                                                $('<div>').append([
                                                    $('<i>').addClass('fa fa-line-chart fa-lg mr-1').attr('aria-hidden', 'true'),
                                                    $('<span>').addClass('font-weight-bold').html('Observed Progress: '),
                                                    $('<span>').html(res.goal_review[0].progress + '%')
                                                ]),
                                                $('<div>').append([
                                                    $('<i>').addClass('fa fa-area-chart fa-lg mr-1').attr('aria-hidden', 'true'),
                                                    $('<span>').addClass('font-weight-bold').html('Effectiveness: '),
                                                    $('<span>').html(res.goal_review[0].effectiveness)
                                                ])
                                            ])
                                        )
                                    ).appendTo($(parent).siblings().eq(1)).slideDown('slow');

                                    $(parent).remove();
                                } else if (res.status === 'fail') {
                                    swal({
                                        title: 'Error!',
                                        text: 'An error occurred while submitting your goal review',
                                        type: 'error',
                                        allowOutsideClick: false
                                    });
                                }  
                            }
                        });
                    });
                }
            }
        });
    });
    
    // HR/manager edit employee action
    $('#ev-goal-overview').on('submit', 'form.edit-emp-action-form', function(e) {
        e.preventDefault();
        var parent = $(this);
        $.ajax({
            url: '/edit-employee-action',
            method: 'POST',
            data: $(this).serialize(),
            success: function(resp) {
                if (resp.status === 'success') {
                    var inputs = $(parent).find('input').not('input[type=hidden]');
                    $(inputs).eq(0).attr('readonly', 'readonly').val(resp.action[0].action);
                    $(inputs).eq(1).attr('readonly', 'readonly').val(formatDate(resp.action[0].due_date, 'yyyy-mm-dd'));
                    $(inputs).eq(2).attr('readonly', 'readonly').val(resp.action[0].hourly_cost);
                    $(inputs).eq(3).attr('readonly', 'readonly').val(resp.action[0].training_cost);
                    $(inputs).eq(4).attr('readonly', 'readonly').val(resp.action[0].expenses);
                    $(inputs).eq(5).attr('readonly', 'readonly').val(resp.action[0].cost_notes);

                    $(parent).find('div.text-right button:contains("Submit")').hide();
                    $(parent).find('div.text-right button:contains("Cancel")').hide();
                    $(parent).find('div.text-right button:contains("Edit")').show();

                    $('#ev-ca-' + resp.action[0].a_id).find('h6 span').html(resp.action[0].action);
                    $('#ev-gra-' + resp.action[0].a_id).find('h6 span').html(resp.action[0].action);
                    swal({
                        title: 'Success!',
                        text: 'Employee\'s action successfully updated',
                        type: 'success',
                        allowOutsideClick: false
                    });
                }
            }
        });
    });

    // goal preparation edit button
    $('.edit-goal-prep').each(function(i) {
        $(this).click(function() {
            if ($(this).attr('data-edit') === 'false') {
                $(this).attr('data-edit', 'true')
                $('#answer-' + $(this).attr('id')).removeAttr('readonly');
                /* $(this).parent().append(
                    $('<div>').addClass('form-group text-right mt-1').append(
                        $('<button>').addClass('btn btn-success').attr('type', 'button').html('<i class="fa fa-save fa-lg" aria-hidden="true">').attr('data-id', $(this).attr('id')).click(function() {
                            $('#answer-' + $(this).attr('data-id')).attr('readonly', '').text($('#answer-' + $(this).attr('data-id')).val());
                            $('#' + $(this).attr('data-id')).attr('data-edit', 'false');
                            $(this).siblings().remove();
                            $(this).remove();
                        })
                    ).append(
                        $('<button>').addClass('btn btn-danger ml-1').attr('type', 'button').html('<i class="fa fa-times fa-lg" aria-hidden="true">').attr('data-id', $(this).attr('id')).click(function() {
                            $('#answer-' + $(this).attr('data-id')).attr('readonly', '').val(goalPrep[i].answer);
                            $('#' + $(this).attr('data-id')).attr('data-edit', 'false');
                            $(this).siblings().remove();
                            $(this).remove();
                        })
                    )
                ) */
            } else {
                $(this).attr('data-edit', 'false');
                $('#answer-' + $(this).attr('id')).attr('readonly', '');
            }
        });
    });
    // cancel goal prep edit and revert all edited textarea to default
    $('#goal-prep-cancel').click(function() {
        $('.answer-box').each(function(i) {
            $(this).val(goalPrep[i].answer);
        });
    });

    // edit goal button and submission
    $('#gs-edit-goal-button').click(function() {
        swal({
            title: 'Warning',
            html: 'In order to start a new goal, the current PDP period MUST NOT have actions in it.<br><u>IT IS HIGHLY SUGGESTED THAT YOU DO NOT DELETE CURRENT ACTIONS; INSTEAD, WAIT UNTIL THE NEXT PDP PERIOD TO START A NEW GOAL.</u>',
            type: 'warning',
            allowOutsideClick: false
        });

        var parent = $(this).parent();
        $('#gs-input-goal').removeAttr('readonly')
        $(parent).append([
            $('<button>').addClass('btn btn-primary mr-1').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit').attr({
                'type': 'submit',
                'id': 'gs-save-goal-button'
            }).click(function(e) {
                e.preventDefault();
            
                $.ajax({
                    url: '/edit-goal',
                    method: 'POST',
                    data: $('#gs-edit-goal').serialize(),
                    success: function(resp) {
                        if (resp.status === 'success') {
                            swal({
                                title: 'Success!',
                                type: 'Edit successful',
                                type: 'success',
                                allowOutsideClick: false
                            });
                            
                            location.reload();
                        } else if (resp.status === 'fail') {
                            swal({
                                title: 'Error!',
                                text: resp.message,
                                type: 'error',
                                allowOutsideClick: false
                            });
                        }
                    }
                });
            }),
            $('<button>').addClass('btn btn-secondary').html('<i class="fa fa-times fa-lg mr-1" aria-hidden="true"></i>Cancel').attr({
                'type': 'button',
                'id': 'gs-cancel-goal-button'
            }).click(function() {
                $('#gs-input-goal').attr('readonly', '').val(goals[0].goal);
                $(this).remove();
                $('#gs-save-goal-button').remove();
                $('#gs-edit-goal-button').show();
                $('#gs-delete-goal-button').show();
            })
        ])
        $(this).hide();
        $('#gs-delete-goal-button').hide();
    });

    // edit action button function
    /* $('#actions-wrapper').on('click', 'button.edit-action-button', function() {
        if($(this).attr('data-edit') === 'false') {
            $(this).parent().prepend([
                $('<button>').addClass('btn btn-primary mr-1').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit').attr('type', 'submit'),
                $('<button>').addClass('cancel-button btn btn-secondary').attr('type', 'button').html('<i class="fa fa-times fa-lg mr-1" aria-hidden="true"></i>Cancel').click(function() {
                    $('#edit-action-' + (i + 1) + ' :input[name=action]').attr('readonly', '').val(actions[i].action);
                    $('#edit-action-' + (i + 1) + ' :input[name=due_date]').attr('readonly', '').val(formatDate(actions[i].due_date, 'yyyy-mm-dd'));
                    $('#edit-action-' + (i + 1) + ' :input[name=hourly_cost]').attr('readonly', '').val(actions[i].hourly_cost);
                    $('#edit-action-' + (i + 1) + ' :input[name=training_cost]').attr('readonly', '').val(actions[i].training_cost);
                    $('#edit-action-' + (i + 1) + ' :input[name=expenses]').attr('readonly', '').val(actions[i].expenses);
                    $('#edit-action-' + (i + 1) + ' :input[name=cost_notes]').attr('readonly', '').val(actions[i].cost_notes);
                    $(this).siblings().eq(1).attr('data-edit', 'false').show();
                    $(this).siblings().eq(0).remove();
                    $(this).remove();
                })
            ])

            $('#edit-action-' + (i + 1) + ' :input').not(':button, :hidden').each(function() {
                $(this).removeAttr('readonly');
            });

            $(this).hide();
            $(this).attr('data-edit', 'true');
        }
    }); */

    $('#actions-wrapper').on('submit', 'form.edit-action', function(e) {
        e.preventDefault();
        var parent = $(this);

        swal({
            title: 'Are you sure?',
            text: 'The actions\'s status will be reverted to pending',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url: '/edit-action',
                    method: 'POST',
                    data: $(this).serialize(),
                    success: function(resp) {
                        console.log(resp);
                        var inputs = $(parent).find('input').not('button, input[type=hidden]');
                        console.log(inputs);
                        if (resp.status === 'success') {
                            $(inputs).attr('readonly', 'readonly');
                            $(inputs).eq(0).val(resp.action.action);
                            $(inputs).eq(1).val(formatDate(resp.action.due_date, 'yyyy-mm-dd'));
                            $(inputs).eq(2).val(resp.action.hourly_cost);
                            $(inputs).eq(3).val(resp.action.training_cost);
                            $(inputs).eq(4).val(resp.action.expenses);
                            $(inputs).eq(5).val(resp.action.cost_notes);

                            $(parent).find('button[type=submit], button.cancel-button').remove();
                            $(parent).find('button.edit-action-button').show();

                            swal({
                                title: 'Success!',
                                text: 'The action is updated!',
                                type: 'success',
                                allowOutsideClick: false
                            });

                            updateOthers(resp);
                        } else {
                            swal({
                                title: 'Error!',
                                text: 'An error occurred while updating.',
                                type: 'error',
                                allowOutsideClick: false
                            });
                        }
                    }
                });
            }
        });
    });

    $('#actions-wrapper').on('click', 'button.edit-action-button', function() {
        let textControl = $(this).parent();
        let inputs = $(textControl).parent().find('input').not('input[type=hidden]');
        let editButton = $(textControl).find('button:contains("Edit")');
        let deleteButton = $(textControl).find('button:contains("Delete")');
        let submitButton = $(textControl).find('button:contains("Submit")');
        let cancelButton = $(textControl).find('button:contains("Cancel")');
        let oldValues = [];

        $(inputs).each(function(i) {
            oldValues.push($(inputs).eq(i).val());
        });

        $(inputs).removeAttr('readonly');

        $(editButton).hide();
        $(deleteButton).hide();
        $(submitButton).show();
        $(cancelButton).show();

        $(cancelButton).click(function() {
            $(editButton).show();
            $(deleteButton).show();
            $(submitButton).hide();
            $(this).hide();

            $(inputs).attr('readonly', 'readonly');
            $(inputs).eq(0).val(oldValues[0]);
            $(inputs).eq(1).val(oldValues[1]);
            $(inputs).eq(2).val(oldValues[2]);
            $(inputs).eq(3).val(oldValues[3]);
            $(inputs).eq(4).val(oldValues[4]);
            $(inputs).eq(5).val(oldValues[5]);
        });
    });

    $('#add-action').submit(function(e) {
        e.preventDefault();
        
        $.ajax({
            url: '/save-goal-changes',
            method: 'POST',
            data: $(this).serialize(),
            success: function(resp) {
                if (resp.status === 'success') {
                    swal({
                        title: 'Goal added!',
                        html: 'Refreshing...',
                        onOpen: () => {
                            swal.showLoading()
                        },
                        allowOutsideClick: false
                    });

                    location.reload();
                } else if (resp.status === 'fail') {
                    swal({
                        title: 'Error!', 
                        text: resp.message,
                        type: 'error',
                        allowOutsideClick: false
                    });
                }
            }
        });
    });

    $('#gs-add-action').submit(function(e) {
        var parent = $(this);
        e.preventDefault();
        if (actionCount < 4) {
            $.ajax({
                url: '/edit-add-action',
                method: 'POST',
                data: $(this).serialize(),
                success: function(resp) {
                    if (resp.status === 'success') {
                        createActionAccordion(resp);
                        populatePeriodSelect();
                        actions.push(resp.action[0]);
                        $('#checkin-link').removeClass('disabled').removeAttr('data-placement', 'data-original-title', 'title');
                        $('#goal-review-link').removeClass('disabled').removeAttr('data-placement', 'data-original-title', 'title');
                        
                        if (actions.length >= 4) {
                            $('#edit-add-new-action-div').addClass('d-none');
                        }

                        $(parent).find('input').not('button, input[type=hidden]').val('');

                        addTo(resp);
                        swal({
                            title: 'Success!',
                            text: 'Your new action has been added',
                            type: 'success',
                            allowOutsideClick: false
                        });
                    } else if (resp.status = 'fail') {
                        swal({
                            title: 'Error!',
                            text: 'An error occurred',
                            type: 'error',
                            allowOutsideClick: false
                        });
                    }
                }
            });
        } else {
            swal({
                title: 'Error!',
                text: 'Nice try! Don\'t be lazy and complete your actions first :)',
                type: 'error',
                allowOutsideClick: false
            });
        }
    });

    // delete action
    $('#actions-wrapper').on('click', 'button.delete-action-button', function(e) {
        e.preventDefault();
        var parent = $(this).parent().parent();

        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url: '/delete-action',
                    method: 'POST',
                    data: $(parent).serialize(),
                    success: function(resp) {
                        populatePeriodSelect();
                        for (var i = 0; i < actions.length; i++) {
                            if (actions[i].a_id === resp.a_id) {
                                actions.splice(i, 1); // update the DOM object 'actions'
                                actionCount = actions.length; // declare new action count
                            }
                        }

                        $('#edit-add-new-action-div').removeClass('d-none'); // show add action form again

                        // remove the action from display
                        $('#action-div-' + resp.a_id).animate({height: 0, opacity: 0}, 'slow', function() {
                            $(this).remove();
                            $('.edit-action-header').each(function(i) {
                                $(this).html('Action ' + (i + 1));
                            });
                        });

                        deleteRemaining(resp.a_id); // delete actions from other tabs

                        swal({
                            title: 'Success!',
                            text: 'The action has been deleted.',
                            type: 'success',
                            allowOutsideClick: false
                        })
                    }
                });
            }
        });
    });

    // get number of submitted actions
    if (userData.auth === 'HR') {
        $.ajax({
            url: '/get-status-count',
            method: 'GET',
            success: function(resp) {
                console.log(resp);
            }
        });
    }

    // open/close notification
    $('#notification-button').click(function() {
        $('#notification').toggle(250);
    });

    // submit goal preparation
    $('#goal-prep-form').submit(function(e) {
        e.preventDefault();

        $.ajax({
            url: '/submit-goal-prep',
            method: 'POST',
            data: $('#goal-prep-form').serialize(),
            success: function(resp) {
                console.log(resp);
                if (resp === 'invalid') {
                    swal({
                        title: 'Error!', 
                        text: 'All fields are required',
                        type: 'error',
                        allowOutsideClick: false
                    });
                } else if (resp === 'success') {
                    swal({
                        title: 'Success!',
                        text: 'Refreshing...',
                        type: 'success',
                        allowOutsideClick: false
                    });
                    location.reload();
                }
            }
        });
    });

    // update goal preparation
    $('#goal-prep-update').submit(function(e) {
        e.preventDefault();
        var parent = $(this);

        $.ajax({
            url: '/update-goal-prep',
            method: 'POST',
            data: $(this).serialize(),
            success: function(resp) {
                console.log(resp);
                if (resp.status === 'fail') {
                    swal({
                        title: 'Warning!',
                        text: 'All fields are required',
                        type: 'warning',
                        allowOutsideClick: false
                    });
                } else if (resp.status === 'success') {
                    swal({
                        title: 'Success!',
                        text: 'Goal preparation successfully updated',
                        type: 'success',
                        allowOutsideClick: false
                    });
                    $(parent).find('input').not('input[type=hidden], button').attr('readonly', 'readonly');
                }
            }
        });
    });

    $('#gs-delete-goal-button').click(function(e) {
        swal({
            title: 'Are you sure you want to delete your goal?',
            text: "All actions will be deleted and cannot be reverted.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url: '/delete-goal',
                    method: 'POST',
                    data: {
                        g_id: goals[0].g_id,
                        user: userData.emp_id
                    },
                    success: function(resp) {
                        swal({
                            title: 'Success!',
                            html: 'Refreshing...',
                            type: 'success',
                            allowOutsideClick: false,
                            onOpen: () => {
                                swal.showLoading()
                            }
                        })
                        
                        location.reload();
                    }
                });
            }
        });
    });

    var table = $('#employee-table').DataTable({
        'order': [1, 'asc'],
        'columns': [
            {
                'className': 'details-control',
                'orderable': false,
                'data': null,
                'defaultContent': "<button class='btn btn-secondary btn-sm' type='button'><i class='fa fa-minus' aria-hidden='true'></i></button>",
                'width': '10%'
            },
            null,
            null,
            {'defaultContent': 'OSI Maritime'},
            {'defaultContent': 'Staff'}
        ],
        'scrollY': '50vh',
        'scrollCollapse': true,
        'paging': false
    }).columns.adjust().draw();

    var tableLoaded = false;
    $('#admin-link').click(function() {
        if (!tableLoaded) { 
            $.ajax({
                url: '/populate-employee-table',
                method: 'GET',
                success: function(resp) {
                    for (i in resp) {
                        var actionTable = $('<div>').addClass('w-100 d-flex justify-content-between flex-wrap')
                        for (index in resp[i].actions) {
                            if (resp[i].actions[index].action !== null) {

                                // Show action index on Admin table
                                let actionIdx = 'Action ' + (parseInt(index) + 1);

                                // Classify Action Status and store in variables
                                if (resp[i].actions[index].status === 'Submitted') {
                                    var statusClass = 'btn-warning';
                                    var buttonHTML = '<i class="fa fa-ellipsis-h mr-1" aria-hidden="true"></i>';
                                    var statusState = ' Pending';
                                } else if (resp[i].actions[index].status === 'Approved') {
                                    var statusClass = 'btn-success';
                                    var buttonHTML = '<i class="fa fa-check mr-1" aria-hidden="true"></i>';
                                    var statusState = ' Approved';
                                } else if (resp[i].actions[index].status === 'Declined') {
                                    var statusClass = 'btn-danger';
                                    var buttonHTML = '<i class="fa fa-ban mr-1" aria-hidden="true"></i>'
                                    var statusState = ' Declined';
                                }

                                var actionCards = $('<div>').append([
                                    $('<div>').addClass('card-group mb-2').append([
                                        $('<div>').addClass('card').append(
                                            $('<div>').addClass('card-header text-center font-weight-bold').html('<i class="fa fa-calendar-times-o fa-lg mr-1" aria-hidden="true"></i>'),
                                            $('<div>').addClass('card-body text-center').html(formatDate(resp[i].actions[index].due_date, 'yyyy-mm-dd')),
                                        ),
                                        $('<div>').addClass('card').append([
                                            $('<div>').addClass('card-header text-center font-weight-bold').html('<i class="fa fa-clock-o fa-lg mr-1" aria-hidden="true"></i>'),
                                            $('<div>').addClass('card-body text-center').html('$' + resp[i].actions[index].hourly_cost),
                                        ]),
                                        $('<div>').addClass('card').append([
                                            $('<div>').addClass('card-header text-center font-weight-bold').html('<i class="fa fa-dollar fa-lg mr-1" aria-hidden="true"></i>'),
                                            $('<div>').addClass('card-body text-center').html('$' + resp[i].actions[index].training_cost),
                                        ]),
                                        $('<div>').addClass('card').append([
                                            $('<div>').addClass('card-header text-center font-weight-bold').html('<i class="fa fa-money fa-lg mr-1" aria-hidden="true"></i>'),
                                            $('<div>').addClass('card-body text-center').html('$' + resp[i].actions[index].expenses)
                                        ])
                                    ]),
                                    $('<div>').addClass('d-flex justify-content-start align-items-center').append([
                                        $('<i>').addClass('fa fa-sticky-note-o fa-lg mr-1').attr('aria-hidden', 'true'),
                                        $('<span>').html(resp[i].actions[index].cost_notes)
                                    ])
                                ]);

                                var action = $('<div>').addClass('action-container w-22 p-1 rounded mx-auto').append(
                                    $('<form>').addClass('form-inline justify-content-around').append([
                                        $('<button>').addClass('btn ' + statusClass + ' btn-sm mb-1').attr('id', 'action-status-button-' + resp[i].actions[index].a_id).attr('type', 'button').html(buttonHTML + actionIdx + statusState ).popover({
                                            'title': resp[i].actions[index].action,
                                            'placement': 'top',
                                            'trigger': 'hover focus',
                                            'html': true,
                                            'template': "<div class=\"popover\" role=\"tooltip\"><div class=\"arrow\"></div><h3 class=\"popover-header\"></h3><div class=\"popover-body\"></div></div>",
                                            'content': actionCards
                                        }),
                                        $('<form>').addClass('set-status-form mb-1').attr({'method': 'POST', 'action': '/submit-action-status'}).append([
                                            $('<input>').attr({'type': 'hidden', 'name': 'a_id', 'value': resp[i].actions[index].a_id}),
                                            $('<select>').addClass('form-control form-control-sm').attr('name', 'status').append([
                                                $('<option>').text(''),
                                                $('<option>').attr('value', 'Submitted').text('Revise'),
                                                $('<option>').attr('value', 'Approved').text('Approve'),
                                                $('<option>').attr('value', 'Declined').text('Decline')
                                            ])
                                        ]).change(function() {
                                            var parent = $(this);
                                            if ($(this).find('select :selected').attr('value') === 'Declined') {
                                                declineMessage(parent, '#hr_comment', actionIdx);
                                            } else {
                                                $.ajax({
                                                    url: '/submit-action-status',
                                                    method: 'POST',
                                                    data: {
                                                        data: $(parent).serializeArray(),
                                                        message: null
                                                    },
                                                    success: function(resp) {
                                                        if (resp.status === 'success') {
                                                            if (resp.value === 'Approved') {
                                                                $('#action-status-button-' + resp.a_id).removeClass('btn-danger btn-warning').addClass('btn-success').html('<i class="fa fa-check mr-1" aria-hidden="true"></i>' + actionIdx + ' Approved');
                                                            } else if (resp.value === 'Submitted') {
                                                                $('#action-status-button-' + resp.a_id).removeClass('btn-danger btn-success').addClass('btn-warning').html('<i class="fa fa-ellipsis-h mr-1" aria-hidden="true"></i>' + actionIdx + ' Pending');
                                                            }
                                                        } else {
                                                            swal({
                                                                title: 'Error!',
                                                                text: 'An error occurred while submitting this action\'s status', type: 'error',
                                                                allowOutsideClick: false
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        })
                                    ])
                                )
                                actionTable.append(action);
                            }
                        } 
                        var r = table.row.add([null, resp[i].first_name, resp[i].last_name, null, null]).draw();
                        r.child(actionTable).show();
                    }

                    table.rows().nodes().to$().addClass('shown');

                    tableLoaded = true;
                    table.columns.adjust().draw();
                }
            });
        }
    });

    $('#employee-table tbody').on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        
        if (row.child.isShown()) {
            row.child.hide();
            tr.addClass('hidden').removeClass('shown');
            $(this).html('<button class="btn btn-primary btn-sm" type="button"><i class="fa fa-plus" aria-hidden="true"></i></button>')
        } else {
            row.child.show();
            tr.addClass('shown').removeClass('hidden');
            $(this).html('<button class="btn btn-secondary btn-sm" type="button"><i class="fa fa-minus" aria-hidden="true"></i></button>')
        }  
    });

    expandCollapse('#expand-all-button', '#employee-table', table, 'expand');
    expandCollapse('#collapse-all-button', '#employee-table', table, 'collapse');

    $('#report-division-select').on('click', function() {
        $('#report-department-select').empty();
        $('#report-employee-select').empty();
    });

    $('#report-department-select').on('click', function() {
        $('#report-employee-select').empty();
    });

    var loadingDept = false;
    var loadingEmpNames = false;

    $('#get-dept-button').click(function() {
        $('#report-department-select').empty();
        $('#report-employee-select').empty();

        var divisionObj = $('#report-division-select').serializeArray();
        var divisions = [];
        for (let item of divisionObj) {
            divisions.push(item.value);
        }

        if (divisions.length > 0) {
            if ($('#by-department').find('.field-loading-screen').hasClass('bg-warning-light')) {
                $('#by-department').find('.field-loading-screen').removeClass('bg-warning-light').addClass('bg-dark-light');
            }

            if ($('#by-department').find('.field-loading-screen').hasClass('d-none')) {
                $('#by-department').find('.field-loading-screen').removeClass('d-none').addClass('d-flex');
            }

            $('#by-department').find('.w-50').html('<div><i class="fa fa-spinner fa-pulse fa-fw fa-5x" aria-hidden="true"></i></div><div>Loading...</div>');
            if (!loadingDept) {
                loadingDept = true;
                $.ajax({
                    url: '/get-department-fields',
                    method: 'POST',
                    data: {
                        divisions: divisions
                    },
                    success: function(resp) {
                        if (resp.status === 'success') {
                            $('#by-department').find('.field-loading-screen').removeClass('d-flex').addClass('d-none');
                            for (let dept of resp.departments) {
                                $('#report-department-select').append(
                                    $('<option>').attr('value', dept).text(dept)
                                )
                            }
                        } else {
                            var loading = $('#by-department').find('.field-loading-screen');
                            $(loading).removeClass('bg-dark-light').addClass('bg-warning-light');
                            $(loading).find('.w-50').html('<i class="fa fa-warning fa-lg mr-1" aria-hidden="true"></i>No departments found');
                        }
                        loadingDept = false;
                    }
                });
            } else {
                swal({
                    text: 'Divisions are being loaded. Please wait...',
                    showConfirmButton: false,
                    timer: 1500,
                    allowOutsideClick: false
                });
            }
        } else {
            var loading = $('#by-department').find('.field-loading-screen');
            $(loading).removeClass('bg-dark-light').addClass('bg-warning-light');
            $(loading).find('.w-50').html('<i class="fa fa-warning fa-lg mr-1" aria-hidden="true"></i>Divisions not selected');
        }
    });

    $('#get-employee-button').click(function() {
        $('#report-employee-select').empty();

        var deptObj = $('#report-department-select').serializeArray();
        var departments = [];
        for (let dept of deptObj) {
            departments.push(dept.value);
        }

        if (departments.length > 0) {
            if ($('#by-employee').find('.field-loading-screen').hasClass('bg-warning-light')) {
                $('#by-employee').find('.field-loading-screen').removeClass('bg-warning-light').addClass('bg-dark-light');
            }

            if ($('#by-employee').find('.field-loading-screen').hasClass('d-none')) {
                $('#by-employee').find('.field-loading-screen').removeClass('d-none').addClass('d-flex');

                $('#by-employee').find('.w-50').html('<div><i class="fa fa-spinner fa-pulse fa-fw fa-5x" aria-hidden="true"></i></div><div>Loading...</div>');
            }

            if (!loadingEmpNames) {
                loadingEmpNames = true;
                $.ajax({
                    url: '/get-employee-names',
                    method: 'POST',
                    data: {
                        departments: departments
                    },
                    success: function(resp) {
                        console.log(resp);
                        if (resp.status === 'success') {
                            for (let employee of resp.employees) {
                                $('#by-employee').find('.field-loading-screen').removeClass('d-flex').addClass('d-none');
                                $('#report-employee-select').append(
                                    $('<option>').attr('value', employee.id).text(employee.name)
                                )
                            }

                        } else {
                            $('#by-employee').find('.field-loading-screen').removeClass('bg-dark-light').addClass('bg-danger-light');
                            $('#by-employee').find('.w-50').html('<i class="fa fa-exclamation-circle fa-lg mr-1" aria-hidden="true"></i>No emloyees found')
                        }
                        loadingEmpNames = false;
                    }
                });
            } else {
                swal({
                    text: 'Employees are being loaded. Please wait...',
                    showConfirmButton: false,
                    timer: 1500,
                    allowOutsideClick: false
                });
            }
        } else {
            $('#by-employee').find('.field-loading-screen').removeClass('bg-dark-light').addClass('bg-warning-light');
            $('#by-employee').find('.w-50').html('<i class="fa fa-warning fa-lg mr-1" aria-hidden="true"></i>Departments not selected')
        }
    });

    var divisionFieldsLoaded = false;
    var loadingDivisions = false;
    $('#hrv-report-link').click(function() {
        $.ajax({
            url: '/get-report-period',
            method: 'GET',
            success: function(resp) {
                console.log(resp);
                if (resp.status === 'success') {
                    for (let date of resp.dates) {
                        $('#report-period-select').append(
                            $('<option>').attr('value', formatDate(date.start_date, 'yyyy-mm-dd') + '_' + formatDate(date.end_date, 'yyyy-mm-dd')).html(formatDate(date.start_date, 'MMMM dd, yyyy') + ' - ' + formatDate(date.end_date, 'MMMM dd, yyyy'))
                        )
                    }

                    $('#report-period-select option:last').prop('selected', 'selected');
                } else {
                    $('#report-period-div').html('<div class="alert alert-danger">Failed to retrieve date period</div>')
                }
            }
        });

        if (!divisionFieldsLoaded && !loadingDivisions) {
            loadingDivisions = true;

            $.ajax({
                url: '/get-division-fields',
                method: 'GET',
                success: function(resp) {
                    console.log(resp);
                    for (let division of resp) {
                        $('#report-division-select').append(
                            $('<option>').attr('value', division).text(division)
                        )
                    }

                    $('#by-division').find('.field-loading-screen').removeClass('d-flex').addClass('d-none');
                    loadingDivisions = false;
                    divisionFieldsLoaded = true;
                }
            });

            /* $.ajax({
                url: '/get-fields',
                method: 'GET',
                success: function(resp) {
                    console.log(resp);
                    if (resp.status === 'success') {
                        for (let group in resp.fields) {
                            let optgroup = $('<optgroup>').addClass('text-capitalize').attr('label', group.replace(/_/g, ' '));

                            for (let field of resp.fields[group]) {
                                $(optgroup).append(
                                    $('<option>').attr('value', field).text(field)
                                )
                            }
                            $('#report-field-select').append(optgroup);
                        }
                    }
                }
            }); */
        }
    });

    selectAllOrNone('#by-division', true, 'Select All');
    selectAllOrNone('#by-division', false, 'Select None');
    selectAllOrNone('#by-department', true, 'Select All');
    selectAllOrNone('#by-department', false, 'Select None');
    selectAllOrNone('#by-employee', true, 'Select All');
    selectAllOrNone('#by-employee', false, 'Select None');
    selectAllOrNone('#field-select', true, 'Select All');
    selectAllOrNone('#field-select', false, 'Select None');

    $('#report-table tfoot th').each(function() {
        var title = $('#report-table thead th').eq($(this).index()).text();
        $(this).append(
            $('<input>').attr({'type': 'text', 'placeholder': 'Search "' + title + '"'}).addClass('form-control')
        );
    });

    var reportTable = $('#report-table').DataTable({
        'dom': "Blftipr",
        'buttons': [
            {
                'extend': 'excelHtml5',
                'text': 'Export',
                'exportOptions': {
                    'columns': ':visible',
                    'modifier': {
                        'search': 'applied'
                    }
                },
                'customize': function(xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    $('row c[r^="I"]', sheet).attr('s', '30');
                    $('row c[r^="J"]', sheet).attr('s', '30');
                    $('row c[r^="K"]', sheet).attr('s', '30');
                    $('row c[r^="L"]', sheet).attr('s', '30');
                    $('row c[r^="M"]', sheet).attr('s', '30');
                    $('row c[r^="N"]', sheet).attr('s', '30');
                    $('row c[r^="O"]', sheet).attr('s', '30');
                    $('row c[r^="P"]', sheet).attr('s', '30');
                    $('row c[r^="Q"]', sheet).attr('s', '30');
                    $('row c[r^="R"]', sheet).attr('s', '30');
                    $('row c[r^="S"]', sheet).attr('s', '30');
                    $('row c[r^="T"]', sheet).attr('s', '30');

                    $('row c[r^="U"]', sheet).attr('s', '35');
                    $('row c[r^="V"]', sheet).attr('s', '35');
                    $('row c[r^="W"]', sheet).attr('s', '35');
                    $('row c[r^="X"]', sheet).attr('s', '35');
                    $('row c[r^="Y"]', sheet).attr('s', '35');
                    $('row c[r^="Z"]', sheet).attr('s', '35');
                    $('row c[r^="AA"]', sheet).attr('s', '35');
                    $('row c[r^="AB"]', sheet).attr('s', '35');
                    $('row c[r^="AC"]', sheet).attr('s', '35');
                    $('row c[r^="AD"]', sheet).attr('s', '35');
                    $('row c[r^="AE"]', sheet).attr('s', '35');
                    $('row c[r^="AF"]', sheet).attr('s', '35');

                    $('row c[r^="AG"]', sheet).attr('s', '40');
                    $('row c[r^="AH"]', sheet).attr('s', '40');
                    $('row c[r^="AI"]', sheet).attr('s', '40');
                    $('row c[r^="AJ"]', sheet).attr('s', '40');
                    $('row c[r^="AK"]', sheet).attr('s', '40');
                    $('row c[r^="AL"]', sheet).attr('s', '40');
                    $('row c[r^="AM"]', sheet).attr('s', '40');
                    $('row c[r^="AN"]', sheet).attr('s', '40');
                    $('row c[r^="AO"]', sheet).attr('s', '40');
                    $('row c[r^="AP"]', sheet).attr('s', '40');
                    $('row c[r^="AQ"]', sheet).attr('s', '40');
                    $('row c[r^="AR"]', sheet).attr('s', '40');

                    $('row c[r^="AS"]', sheet).attr('s', '45');
                    $('row c[r^="AT"]', sheet).attr('s', '45');
                    $('row c[r^="AU"]', sheet).attr('s', '45');
                    $('row c[r^="AV"]', sheet).attr('s', '45');
                    $('row c[r^="AW"]', sheet).attr('s', '45');
                    $('row c[r^="AX"]', sheet).attr('s', '45');
                    $('row c[r^="AY"]', sheet).attr('s', '45');
                    $('row c[r^="AZ"]', sheet).attr('s', '45');
                    $('row c[r^="BA"]', sheet).attr('s', '45');
                    $('row c[r^="BB"]', sheet).attr('s', '45');
                    $('row c[r^="BC"]', sheet).attr('s', '45');
                    $('row c[r^="BD"]', sheet).attr('s', '45');
                }
            },
            {
                extend: 'collection',
                text: 'Show columns',
                buttons: [ 'columnsVisibility' ],
                visibility: true
            }
        ],
        'columns': [
            {'width': '50px'}, // emp #
            {'width': '125px'}, // last name
            {'width': '125px'}, // first name
            {'width': '125px'},  // job title
            {'width': '125px'}, // division
            {'width': '125px'}, // department
            {'width': '125px'}, // manager
            {'width': '300px'}, // goal
            {'width': '300px'}, // action 1
            {'width': '100px'}, // status
            {'width': '100px'}, // final status
            {'width': '75px'}, // due date
            {'width': '75px'}, // Budgeted Hours
            {'width': '75px'}, // training cost
            {'width': '75px'}, // expenses
            {'width': '75px'}, // total cost
            {'width': '300px'}, // employee checkin comment
            {'width': '300px'}, // manager checkin comment
            {'width': '300px'}, // employee goal review comment
            {'width': '300px'}, // manager goal review comment
            {'width': '300px'}, // action 2
            {'width': '100px'}, // status
            {'width': '100px'}, // final status
            {'width': '75px'}, // due date
            {'width': '75px'}, // Budgeted Hours
            {'width': '75px'}, // training cost
            {'width': '75px'}, // expenses
            {'width': '75px'}, // total cost
            {'width': '300px'}, // employee checkin comment
            {'width': '300px'}, // manager checkin comment
            {'width': '300px'}, // employee goal review comment
            {'width': '300px'}, // manager goal review comment
            {'width': '300px'}, // action 3
            {'width': '100px'}, // status
            {'width': '100px'}, // final status
            {'width': '75px'}, // due date
            {'width': '75px'}, // Budgeted Hours
            {'width': '75px'}, // training cost
            {'width': '75px'}, // expenses
            {'width': '75px'}, // total cost
            {'width': '300px'}, // employee checkin comment
            {'width': '300px'}, // manager checkin comment
            {'width': '300px'}, // employee goal review comment
            {'width': '300px'}, // manager goal review comment
            {'width': '300px'}, // action 4
            {'width': '100px'}, // status
            {'width': '100px'}, // final status
            {'width': '75px'}, // due date
            {'width': '75px'}, // Budgeted Hours
            {'width': '75px'}, // training cost
            {'width': '75px'}, // expenses
            {'width': '75px'}, // total cost
            {'width': '300px'}, // employee checkin comment
            {'width': '300px'}, // manager checkin comment
            {'width': '300px'}, // employee goal review comment
            {'width': '300px'}, // manager goal review comment
        ],
        'scrollY': '50vh',
        'scrollX': true,
        'scrollCollapse': true,
        'paging': false
    }).columns.adjust();

    reportTable.columns().every(function() {
        var column = this;

        $('input', this.footer()).on('keyup change', function() {
            column.search(this.value).draw();
        });
    });

    $('#report-table_wrapper div.btn-group a').removeClass('btn-secondary').addClass('btn-outline-primary');

/*     new $.fn.dataTable.FixedColumns(reportTable, {
        leftColumns: 3,
        heightMatch: 'auto'
    }); */

    $('#close-report-button').click(function() {
        reportTable.clear().draw();
        $('#build-table-loading').removeClass('d-none').addClass('d-flex');
        $('#report-table-div').addClass('d-none');
        $('#show-report').find('.card-header:first span').empty();
        $('#show-report').hide();
        $('body').css('overflow-y', '');
    });

    $('#report-form').submit(function(e) {
        e.preventDefault();
        $('#show-report').show();
        $('body').css('overflow-y', 'hidden');
        window.scrollTo(0, 0);
        var arr = $(this).serializeArray();
        console.log(arr);
        var prev;
        var obj = {};
        for (let field of arr) {
            if (prev !== field.name) {
                obj[field.name] = [field.value];
                prev = field.name;
            } else {
                obj[field.name].push(field.value);
            }
        }

        $.ajax({
            url: '/get-report',
            method: 'POST',
            data: obj,
            success: function(resp) {
                console.log(resp);
                var sd;
                var ed;
                for (let id in resp) {
                    var emp_num = resp[id].emp_number ? resp[id].emp_number : null;
                    var manager_name = resp[id].manager_name ? resp[id].manager_name : null;

                    if (resp[id].pdp.length > 0) {
                        sd = resp[id].pdp[0].start_date;
                        ed = resp[id].pdp[0].end_date;
                        var goal = resp[id].pdp[0].goal;
                    } else {
                        var goal = null;
                    }

                    var row = [emp_num, resp[id].lastName, resp[id].firstName, resp[id].jobTitle, resp[id].division, resp[id].department,  manager_name, goal]
                    for (var i = 0; i < 4; i++) {
                        if (!resp[id].pdp[i]) {
                            var action = null;
                            var status = null;
                            var final_status = null
                            var due_date = null;
                            var hourly_cost = null;
                            var training_cost = null;
                            var expenses = null;
                            var total_cost = null;
                            var employee_checkin_comment = null;
                            var manager_checkin_comment = null;
                            var employee_gr_comment = null;
                            var manager_gr_comment = null;
                        } else {
                            var action = resp[id].pdp[i].action;
                            var status = resp[id].pdp[i].status;
                            var final_status = resp[id].pdp[i].action_review_status;
                            var due_date = formatDate(resp[id].pdp[i].due_date, 'dd-M-yy');
                            var hourly_cost = resp[id].pdp[i].hourly_cost;
                            var training_cost = resp[id].pdp[i].training_cost;
                            var expenses = resp[id].pdp[i].expenses;
                            var total_cost = parseInt(hourly_cost) + parseInt(training_cost) + parseInt(expenses);
                            var employee_checkin_comment = resp[id].pdp[i].employee_checkin_comment;
                            var manager_checkin_comment = resp[id].pdp[i].manager_checkin_comment;
                            var employee_gr_comment = resp[id].pdp[i].employee_gr_comment;
                            var manager_gr_comment = resp[id].pdp[i].manager_gr_comment;
                        }
                        
                        row.push(action);
                        row.push(status);
                        row.push(final_status);
                        row.push(due_date);
                        row.push(hourly_cost);
                        row.push(training_cost);
                        row.push(expenses);
                        row.push(total_cost);
                        row.push(employee_checkin_comment, manager_checkin_comment, employee_gr_comment, manager_gr_comment);
                    }

                    reportTable.row.add(row).draw();
                }

                $('#build-table-loading').removeClass('d-flex').addClass('d-none');
                $('#show-report').find('.card-header:first h3').html(formatDate(sd, 'MMMM dd, yyyy') + ' - ' + formatDate(ed, 'MMMM dd, yyyy'));
                $('#report-table-div').removeClass('d-none');
                reportTable.columns.adjust().draw();
            }
        });
    });

    $('#start-new-goal-button').click(function() {
        startNewGoal(goalPrep[0].gp_id, goals.g_id);
    });
});