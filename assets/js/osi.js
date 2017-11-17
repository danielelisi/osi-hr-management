var actionCount = actions.length; // number of actions currently in the DOM

$(document).ready(function() {
    // populate period select drop down
    $.ajax({
        url: '/populate-period-select',
        method: 'GET',
        success: function(resp) {
            if (resp.length > 0) {
                for (var i = 0; i < resp.length; i++) {
                    if (i === (resp.length - 1)) {
                        $('#period-select').append($('<option>', {
                            id: resp[i].start_date.substr(0, 10) + '_' + resp[i].end_date.substr(0, 10),
                            value: resp[i].start_date.substr(0, 10) + '_' + resp[i].end_date.substr(0, 10),
                            text: formatDate(resp[i].start_date, 'M yyyy') + ' - ' + formatDate(resp[i].end_date, 'M yyyy')
                        }).attr('selected', 'selected'));
                    } else {
                        $('#period-select').append($('<option>', {
                            id: resp[i].start_date.substr(0, 10) + '_' + resp[i].end_date.substr(0, 10),
                            value: resp[i].start_date.substr(0, 10) + '_' + resp[i].end_date.substr(0, 10),
                            text: formatDate(resp[i].start_date, 'M yyyy') + ' - ' + formatDate(resp[i].end_date, 'M yyyy')
                        }));
                    }
                }
            }
        }
    });

    var addActionStatus;
    $('#add-action-button').click(function() {
        if (actionCount < 4) {
            addAction('action', actionCount, 'Action', $(this).attr('data-from'));
            actionCount++;
        } else {
            displayStatus('Cannot add more than 4 actions', 'bg-warning', 'fa-warning');
            clearTimeout(addActionStatus);
            addActionStatus = statusMessageTimeout();
        }
    });
    // employee checkin submission
    $('.employee-checkin').each(function(i) {
       $(this).submit(function(e) {
            e.preventDefault();
            $.ajax({
                url: '/submit-checkin/employee',
                method: 'POST',
                data: $(this).serialize(),
                success: function(resp) {
                    if (resp.status === 'success') {
                        displayStatus('Check-in submitted', 'bg-success', 'fa-check');
                        statusMessageTimeout();

                        $('<div class="alert alert-success" style="display: none;"><div><i class="fa fa-commenting-o fa-lg mr-1" aria-hidden="true"></i><b>Employee Comment:</b> ' + resp.comment + '</div><div><i class="fa fa-calendar-check-o fa-lg mr-1" aria-hidden="true"></i><b>Date Submitted:</b> ' + formatDate(resp.date, 'MMMM dd, yyyy') + '</div></div>').appendTo($('.employee-ck-comments').eq(i)).slideDown('slow')
                    } else if (resp.status === 'fail') {
                        displayStatus('An error occurred', 'bg-danger', 'fa-exclamation-circle');
                        statusMessageTimeout();
                    }
                }
            });
        });
    });
    // employee goal review submission
    $('.employee-goal-review').each(function(i) {
        $(this).submit(function(e) {
            e.preventDefault();
            $.ajax({
                url: '/submit-goal-review/employee',
                method: 'POST',
                data: $(this).serialize(),
                success: function(resp) {
                    if (resp.status === 'success') {
                        displayStatus('Goal Review submitted', 'bg-success', 'fa-check');
                        statusMessageTimeout();

                        $('<div class="alert alert-success" style="display: none;"><div><i class="fa fa-commenting-o fa-lg mr-1" aria-hidden="true"></i><b>Employee Comment:</b> ' + resp.comment + '</div><div><i class="fa fa-calendar-check-o fa-lg mr-1" aria-hidden="true"></i><b>Date Submitted:</b> ' + formatDate(resp.date, 'MMMM dd, yyyy') + '</div></div>').appendTo($('#employee-gr-comments')).slideDown('slow')
                    } else if (resp.status === 'fail') {
                        displayStatus('An error occurred', 'bg-danger', 'fa-exclamation-circle');
                        statusMessageTimeout();
                    }
                }
            })
        });
    });
    // populate the employee drop down box (manager)
    $.ajax({
        url: '/populate-manager-employee-select',
        method: 'GET',
        success: function(resp) {
            console.log(resp);
            $('#manager-employee-select').append($('<option>', {
                id: 'no-employee'
            }));
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
                            $(resp).each(function(i) {
                                $('#manager-employee-date-select').append($('<option>', {
                                    id: (resp[i].start_date).substr(0, 10) + '_' + (resp[i].end_date).substr(0, 10),
                                    name: (resp[i].start_date).substr(0, 10) + '_' + (resp[i].end_date).substr(0, 10),
                                    text: formatDate(resp[i].start_date, 'MMMM dd, yyyy') + ' - ' + formatDate(resp[i].end_date, 'MMMM dd, yyyy')
                                }))
                            });
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
                    $('.manager-checkin-form').each(function(i) {
                        $(this).submit(function(e) {
                            e.preventDefault();
                            $.ajax({
                                url: '/submit-checkin/manager',
                                method: 'POST',
                                data: $(this).serialize(),
                                success: function(res) {
                                    if (res.status === 'success') {
                                        displayStatus('Check-in submitted', 'bg-success', 'fa-check');
                                        statusMessageTimeout();

                                        $('<div class="alert alert-success" style="display: none;"><div><i class="fa fa-commenting-o fa-lg mr-1" aria-hidden="true"></i><b>Manager Comment:</b> ' + res.comment + '</div><div><i class="fa fa-calendar-check-o fa-lg mr-1" aria-hidden="true"></i><b>Date Submitted:</b> ' + formatDate(res.date, 'MMMM dd, yyyy') + '</div></div>').appendTo($('#manager-ck-comments')).slideDown('slow');
                                    } else if (res.status === 'fail') {
                                        displayStatus('An error occurred', 'bg-danger', 'fa-exclamation-circle');
                                        statusMessageTimeout();
                                    }  
                                }
                            });
                        });
                    });
                    // goal review submission (manager)
                    $('.manager-gr-form').each(function(i) {
                        $(this).submit(function(e) {
                            e.preventDefault();
                            $.ajax({
                                url: '/submit-goal-review/manager',
                                method: 'POST',
                                data: $(this).serialize(),
                                success: function(res) {
                                    if (res.status === 'success') {
                                        displayStatus('Goal Review submitted', 'bg-success', 'fa-check');
                                        statusMessageTimeout();

                                        $('<div class="alert alert-success" style="display: none;"><div><i class="fa fa-commenting-o fa-lg mr-1" aria-hidden="true"></i><b>Manager Comment:</b> ' + res.comment + '</div><div><i class="fa fa-calendar-check-o fa-lg mr-1" aria-hidden="true"></i><b>Date Submitted:</b> ' + formatDate(res.date, 'MMMM dd, yyyy') + '</div></div>').appendTo($('#manager-gr-comments')).slideDown('slow');
                                    } else if (res.status === 'fail') {
                                        displayStatus('An error occurred', 'bg-danger', 'fa-exclamation-circle');
                                        statusMessageTimeout();
                                    }  
                                }
                            });
                        });
                    });
                }
            }
        });
    });
    // goal preparation edit button
    $('.edit-goal-prep').each(function(i) {
        //$(this).attr('data-edit', 'false');

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
        if($(this).attr('data-edit') === 'false') {
            $('#gs-input-goal').removeAttr('readonly')
            $(this).parent().append([
                $('<button>').addClass('btn btn-primary mr-1').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit').attr({
                    'type': 'submit',
                    'id': 'gs-save-goal-button'
                }).click(function(e) {
                    e.preventDefault();
                    if(confirm('Proceed to save new goal?')) {
                        $.ajax({
                            url: '/edit-goal',
                            method: 'POST',
                            data: $('#gs-edit-goal').serialize(),
                            success: function(resp) {
                                if(resp.status === 'success') {
                                    $('#gs-input-goal').attr('readonly', '').val(resp.goal);
                                    $('#gs-edit-goal-button').attr('data-edit', 'false');
                                    $('#gs-save-goal-button').remove();
                                    $('#gs-cancel-goal-button').remove();
                                }
                            }
                        })
                    }
                }),
                $('<button>').addClass('btn btn-danger').html('<i class="fa fa-times fa-lg mr-1" aria-hidden="true"></i>Cancel').attr({
                    'type': 'button',
                    'id': 'gs-cancel-goal-button'
                }).click(function() {
                    $('#gs-input-goal').attr('readonly', '').val(goals[0].goal);
                    $(this).remove();
                    $('#gs-save-goal-button').remove();
                    $('#gs-edit-goal-button').attr('data-edit', 'false').show();
                })
            ])
            $(this).attr('data-edit', 'true');
            $(this).hide();
        }
    });

    // edit action button function
    $('.edit-action-button').each(function(i) {
         $(this).click(function() {
            if($(this).attr('data-edit') === 'false') {
                $(this).parent().prepend([
                    $('<button>').addClass('btn btn-primary mr-1').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-2" aria-hidden="true"></i>Submit').attr('type', 'submit'),
                    $('<button>').addClass('cancel-button btn btn-danger').attr('type', 'button').html('<i class="fa fa-times fa-lg mr-1" aria-hidden="true"></i>Cancel').click(function() {
                        $('#edit-action-' + (i + 1) + ' :input[name=action]').attr('readonly', '').val(actions[i].action);
                        $('#edit-action-' + (i + 1) + ' :input[name=due_date]').attr('readonly', '').val(formatDate(actions[i].due_date, 'yyyy-mm-dd'));
                        $('#edit-action-' + (i + 1) + ' :input[name=hourly_cost]').attr('readonly', '').val(actions[i].hourly_cost);
                        $('#edit-action-' + (i + 1) + ' :input[name=training_cost]').attr('readonly', '').val(actions[i].training_cost);
                        $('#edit-action-' + (i + 1) + ' :input[name=expenses]').attr('readonly', '').val(actions[i].expenses);
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
        }); 
    });

    $('#actions-wrapper').on('submit', 'form.edit-action', function(e) {
        e.preventDefault();
        var parent = $(this);
        $.ajax({
            url: '/edit-action',
            method: 'POST',
            data: $(this).serialize(),
            success: function(resp) {
                console.log(resp);
                var inputs = $(parent).find('input').not('button, input[type=hidden]');
                $(inputs).attr('readonly', 'readonly');
                $(inputs).eq(0).val(resp.action[0].action);
                $(inputs).eq(1).val(formatDate(resp.action[0].due_date, 'yyyy-mm-dd'));
                $(inputs).eq(2).val(resp.action[0].hourly_cost);
                $(inputs).eq(3).val(resp.action[0].training_cost);
                $(inputs).eq(4).val(resp.action[0].expenses);

                $(parent).find('button[type=submit], button.cancel-button').remove();
                $(parent).find('button.edit-action-button').attr('data-edit', 'false').show();

                updateOthers(resp);
                displayStatus('Action successfully updated', 'bg-success', 'fa-check');
                statusMessageTimeout();
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
                    createActionAccordion(resp);


                    addTo(resp);
                    actions.push(resp.action[0]);
                    
                    if (actions.length >= 4) {
                        $('#edit-add-new-action-div').addClass('d-none');
                    }

                    $(parent).find('input').not('button, input[type=hidden]').val('');

                    displayStatus('Action successfully added', 'bg-success', 'fa-check');
                    statusMessageTimeout();
                }
            });
        } else {
            displayStatus('Nice try! Don\'t be lazy and complete your actions first', 'bg-warning', 'fa-warning');
            statusMessageTimeout();
        }
    });

    // delete action
    $('#actions-wrapper').on('submit', 'form.delete-action', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this action?')) {
            $.ajax({
                url: '/delete-action',
                method: 'POST',
                data: $(this).serialize(),
                success: function(resp) {
                    for (var i = 0; i < actions.length; i++) {
                        if (actions[i].a_id === resp.a_id) {
                            actions.splice(i, 1);
                            actionCount = actions.length;
                        }
                    }

                    $('#edit-add-new-action-div').removeClass('d-none');

                    $('#action-div-' + resp.a_id).animate({height: 0, opacity: 0}, 'slow', function() {
                        $(this).remove();
                        $('.edit-action-header').each(function(i) {
                            $(this).html('Action ' + (i + 1));
                        });
                        displayStatus('Action successfully deleted', 'bg-success', 'fa-check');
                        statusMessageTimeout();
                    });

                    deleteRemaining(resp.a_id);
                }
            });
        }
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
                    displayStatus('All fields are required', 'bg-danger', 'fa-exclamation-circle');

                    var statusTimeout = statusMessageTimeout();

                    $('#goal-prep-button').click(function() {
                        clearTimeout(statusTimeout);

                        statusTimeout = statusMessageTimeout();
                    });

                    dismissStatus(statusTimeout);
                } else if (resp === 'success') {
                    location.reload();
                }
            }
        });
    });

    // update goal preparation
    $('#goal-prep-update').submit(function(e) {
        e.preventDefault();

        $.ajax({
            url: '/update-goal-prep',
            method: 'POST',
            data: $('#goal-prep-update').serialize(),
            success: function(resp) {
                if (resp === 'fail') {
                    displayStatus('All fields are required', 'bg-danger', 'fa-exclamation-circle');

                    var statusTimeout = statusMessageTimeout();

                    $('#goal-prep-button').click(function() {
                        clearTimeout(statusTimeout);

                        statusTimeout = statusMessageTimeout();
                    });

                    dismissStatus(statusTimeout);
                }
            }
        });
    });

    $('#gs-delete-goal-button').click(function() {
        if (confirm('Are you sure you want to delete your goal? (All actions, check-ins, and goal review will be deleted as well)')) {
            $.ajax({
                url: '/delete-goal',
                method: 'POST',
                data: {
                    g_id: goals[0].g_id,
                    user: userData.emp_id
                },
                success: function(resp) {
                    displayStatus('Goal successfully deleted. Refreshing...', 'bg-success', 'fa-check');

                    setTimeout(function() {
                        $('#status-message').animate({
                            'top': '-50px'
                        });

                        location.reload();
                    }, 1000);
                }
            });
        }
    });

    var table = $('#employee-table').DataTable({
        'order': [1, 'asc'],
        'columns': [
            {
                'className': 'details-control',
                'orderable': false,
                'data': null,
                'defaultContent': "<i class='pntr fa fa-minus-circle text-red text-border' aria-hidden='true'></i>",
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
    });

    var tableLoaded = false;
    $('#admin-link').click(function() {
        if (!tableLoaded) { 
            $.ajax({
                url: '/populate-employee-table',
                method: 'GET',
                success: function(resp) {
                    console.log(resp);
                    for (i in resp) {
                        var actionTable = $('<div>').addClass('w-100 d-flex justify-content-between flex-wrap')
                        for (index in resp[i].actions) {
                            if (resp[i].actions[index].action !== null) {

                                // Show action index on Admin table
                                var actionIdx = 'Action ' + (parseInt(index) + 1);

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
                                    var statusState = 'Declined';
                                }

                                var actionCards = $('<div>').addClass('card-group').append([
                                    $('<div>').addClass('card').append(
                                        $('<div>').addClass('card-header text-center font-weight-bold').html('<i class="fa fa-calendar-times-o fa-lg mr-1" aria-hidden="true"></i>'),
                                        $('<div>').addClass('card-body text-center').html(formatDate(resp[i].actions[index].due_date, 'yyyy-mm-dd')),
                                    ),
                                    $('<div>').addClass('card').append([
                                        $('<div>').addClass('card-header text-center font-weight-bold').html('<i class="fa fa-clock-o fa-lg mr-1" aria-hidden="true"></i>'),
                                        $('<div>').addClass('card-body text-center').html(resp[i].actions[index].hourly_cost),
                                    ]),
                                    $('<div>').addClass('card').append([
                                        $('<div>').addClass('card-header text-center font-weight-bold').html('<i class="fa fa-dollar fa-lg mr-1" aria-hidden="true"></i>'),
                                        $('<div>').addClass('card-body text-center').html(resp[i].actions[index].training_cost),
                                    ]),
                                    $('<div>').addClass('card').append([
                                        $('<div>').addClass('card-header text-center font-weight-bold').html('<i class="fa fa-money fa-lg mr-1" aria-hidden="true"></i>'),
                                        $('<div>').addClass('card-body text-center').html(resp[i].actions[index].expenses),
                                    ])
                                ])

                                var action = $('<div>').addClass('action-container w-22 p-1 rounded mx-auto').append(
                                    $('<form>').addClass('form-inline justify-content-around').append([
                                        $('<button>').addClass('btn ' + statusClass + ' btn-sm').attr('id', 'action-status-button-' + resp[i].actions[index].a_id).attr('type', 'button').html(buttonHTML + actionIdx + statusState ).popover({
                                            'title': resp[i].actions[index].action,
                                            'placement': 'top',
                                            'trigger': 'hover focus',
                                            'html': true,
                                            'template': "<div class=\"popover\" role=\"tooltip\"><div class=\"arrow\"></div><h3 class=\"popover-header\"></h3><div class=\"popover-body\"></div></div>",
                                            'content': actionCards
                                        }),
                                        $('<form>').addClass('set-status-form').attr({'method': 'POST', 'action': '/submit-action-status'}).append([
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
                                                $('#hrv-employee').append(
                                                    $('<div>').addClass('position-absolute d-flex justify-content-center align-items-center mx-auto my-auto').attr('id', 'submit-decline-message').css({'top': '0', 'bottom': '0', 'left': '0', 'right': '0'}).append(
                                                        $('<div>').addClass('card w-50 bg-white border border-dark rounded').append([
                                                            $('<div>').addClass('card-header').append(
                                                                $('<h5>').html('Submit Message for Declining')
                                                            ),
                                                            $('<div>').addClass('card-body').append(
                                                                $('<input>').addClass('form-control').attr({'type': 'text', 'id': 'hr_comment'})
                                                            ),
                                                            $('<div>').addClass('card-footer text-right').append([
                                                                $('<button>').addClass('btn btn-primary mr-1').attr('type', 'button').html('<i class="fa fa-level-down fa-rotate-90 fa-lg mr-1" aria-hidden="true"></i>Submit').click(function() {
                                                                    $.ajax({
                                                                        url: '/submit-action-status',
                                                                        method: 'POST',
                                                                        data: {
                                                                            data: $(parent).serializeArray(),
                                                                            message: $('#hr_comment').val()
                                                                        },
                                                                        success: function(resp) {
                                                                            console.log(resp);
                                                                            if (resp.status === 'success') {
                                                                                $('#action-status-button-' + resp.a_id).removeClass('btn-success btn-warning').addClass('btn-danger').html('<i class="fa fa-ban mr-1" aria-hidden="true"></i>Declined');
                                                                                $('#submit-decline-message').remove();
                                                                            } else {
                                                                                displayStatus('An error occurred while trying to set this action\'s status', 'bg-warning', 'fa-warning')
                                                                            }
                                                                        }
                                                                    });
                                                                }),
                                                                $('<button>').addClass('btn btn-secondary').attr('type', 'button').html('<i class="fa fa-times fa-lg mr-1" aria-hidden="true"></i>Cancel').click(function() {
                                                                    $('#submit-decline-message').remove();
                                                                    $(parent).find('select').val('Default');
                                                                })
                                                            ])
                                                        ])
                                                    )
                                                )
                                            } else {
                                                $.ajax({
                                                    url: '/submit-action-status',
                                                    method: 'POST',
                                                    data: {
                                                        data: $(parent).serializeArray(),
                                                        message: null
                                                    },
                                                    success: function(resp) {
                                                        console.log(resp);
                                                        if (resp.status === 'success') {
                                                            if (resp.value === 'Approved') {
                                                                $('#action-status-button-' + resp.a_id).removeClass('btn-danger btn-warning').addClass('btn-success').html('<i class="fa fa-check mr-1" aria-hidden="true"></i>Approved');
                                                            } else if (resp.value === 'Submitted') {
                                                                $('#action-status-button-' + resp.a_id).removeClass('btn-danger btn-success').addClass('btn-warning').html('<i class="fa fa-ellipsis-h mr-1" aria-hidden="true"></i>Pending');
                                                            }
                                                        } else {
                                                            displayStatus('An error occurred while trying to set this action\'s status', 'bg-warning', 'fa-warning')
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
            $(this).html('<i class="pntr fa fa-plus-circle text-green text-border" aria-hidden="true">')
        } else {
            row.child.show();
            tr.addClass('shown').removeClass('hidden');
            $(this).html('<i class="pntr fa fa-minus-circle text-red text-border" aria-hidden="true">')
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
                    }
                }
            });

            deptFieldsLoaded = true;
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
                        employeeFieldsLoaded = true;
                    } else {
                        $('#by-employee').find('.field-loading-screen').removeClass('bg-dark-light').addClass('bg-danger-light');
                        $('#by-employee').find('.w-50').html('<i class="fa fa-exclamation-circle fa-lg mr-1" aria-hidden="true"></i>No emloyees found')
                    }
                }
            })
        } else {
            $('#by-employee').find('.field-loading-screen').removeClass('bg-dark-light').addClass('bg-warning-light');
            $('#by-employee').find('.w-50').html('<i class="fa fa-warning fa-lg mr-1" aria-hidden="true"></i>Departments not selected')
        }
    });

    var divisionFieldsLoaded = false;
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
                } else {
                    $('#report-period-div').html('<div class="alert alert-danger">Failed to retrieve date period</div>')
                }
            }
        });

        if (!divisionFieldsLoaded) {
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

    var reportTable = $('#report-table').DataTable({
        'dom': "Blftipr",
        'buttons': [
            {
                'extend': 'excelHtml5',
                'text': 'Export',
                'title': formatDate(actions[0].start_date, 'yyyy-mm-dd') + ' - ' + formatDate(actions[0].end_date, 'yyyy-mm-dd'),
                'exportOptions': {
                    'columns': ':visible'
                },
                'customize': function(xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    $('row c[r^="F"]', sheet).attr('s', '30');
                    $('row c[r^="G"]', sheet).attr('s', '30');
                    $('row c[r^="H"]', sheet).attr('s', '30');
                    $('row c[r^="I"]', sheet).attr('s', '30');
                    $('row c[r^="J"]', sheet).attr('s', '30');

                    $('row c[r^="K"]', sheet).attr('s', '35');
                    $('row c[r^="L"]', sheet).attr('s', '35');
                    $('row c[r^="M"]', sheet).attr('s', '35');
                    $('row c[r^="N"]', sheet).attr('s', '35');
                    $('row c[r^="O"]', sheet).attr('s', '35');

                    $('row c[r^="P"]', sheet).attr('s', '40');
                    $('row c[r^="Q"]', sheet).attr('s', '40');
                    $('row c[r^="R"]', sheet).attr('s', '40');
                    $('row c[r^="S"]', sheet).attr('s', '40');
                    $('row c[r^="T"]', sheet).attr('s', '40');

                    $('row c[r^="U"]', sheet).attr('s', '45');
                    $('row c[r^="V"]', sheet).attr('s', '45');
                    $('row c[r^="W"]', sheet).attr('s', '45');
                    $('row c[r^="X"]', sheet).attr('s', '45');
                    $('row c[r^="Y"]', sheet).attr('s', '45');
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
            {'width': '125px'},
            {'width': '125px'},
            {'width': '125px'},
            {'width': '125px'},
            {'width': '125px'},
            {'width': '300px'},
            {'width': '75px', 'title': 'Due Date'},
            {'width': '75px', 'title': 'Hourly Cost'},
            {'width': '75px', 'title': 'Training Cost'},
            {'width': '75px', 'title': 'Expenses'},
            {'width': '300px'},
            {'width': '75px', 'title': 'Due Date'},
            {'width': '75px', 'title': 'Hourly Cost'},
            {'width': '75px', 'title': 'Training Cost'},
            {'width': '75px', 'title': 'Expenses'},
            {'width': '300px'},
            {'width': '75px', 'title': 'Due Date'},
            {'width': '75px', 'title': 'Hourly Cost'},
            {'width': '75px', 'title': 'Training Cost'},
            {'width': '75px', 'title': 'Expenses'},
            {'width': '300px'},
            {'width': '75px', 'title': 'Due Date'},
            {'width': '75px', 'title': 'Hourly Cost'},
            {'width': '75px', 'title': 'Training Cost'},
            {'width': '75px', 'title': 'Expenses'}
        ],
        'scrollY': '50vh',
        'scrollX': true,
        'scrollCollapse': true,
        'paging': false
    }).columns.adjust();

    $('#report-table_wrapper div.btn-group a').removeClass('btn-secondary').addClass('btn-outline-primary');

/*     new $.fn.dataTable.FixedColumns(reportTable, {
        leftColumns: 3,
        heightMatch: 'auto'
    }); */

    $('#close-report-button').click(function() {
        reportTable.clear().draw();
        $('#build-table-loading').removeClass('d-none').addClass('d-flex');
        $('#report-table-div').addClass('d-none');
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
                for (let id in resp) {
                    var row = [resp[id].lastName, resp[id].firstName, resp[id].jobTitle, resp[id].division, resp[id].department]
                    for (var i = 0; i < 4; i++) {
                        if (!resp[id].pdp[i]) {
                            var action = null;
                            var due_date = null;
                            var hourly_cost = null;
                            var training_cost = null;
                            var expenses = null;
                        } else {
                            var action = resp[id].pdp[i].action;
                            var due_date = formatDate(resp[id].pdp[i].due_date, 'dd-M-yy');
                            var hourly_cost = resp[id].pdp[i].hourly_cost;
                            var training_cost = resp[id].pdp[i].training_cost;
                            var expenses = resp[id].pdp[i].expenses
                        }
                        
                        row.push(action);
                        row.push(due_date);
                        row.push(hourly_cost);
                        row.push(training_cost);
                        row.push(expenses);
                    }

                    reportTable.row.add(row).draw();
                }
                $('#build-table-loading').removeClass('d-flex').addClass('d-none');
                $('#report-table-div').removeClass('d-none');
                reportTable.columns.adjust().draw();
            }
        });
    });

    /* var departmentLoaded = false;
    $('#by-department-link').click(function() {
        if (!departmentLoaded) {
            $.ajax({
                url: '/get-department',
                method: 'GET',
                success: function(resp) {
                    $('#report-department-select').append(
                        $('<option>').attr('value', resp[i].department).text(resp[i].department)
                    )
                }
            });
        }
    }); */

/*     $.ajax({
        url: '/populate-employee-table',
        method: 'GET',
        success: function(resp) {
            console.log(resp);
        }
    })   */
});