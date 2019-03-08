$(document).ready(function () {
    M.AutoInit();


    // Questions listed in an array so they can be generated.
    var questions = [
        'Which Would Be Your Go-To First Date?',
        'When Do You Get The Most Done?',
        'What do you do to relax?',
        'If you were to have a theme party, what would the theme be?',
        'What is your favorite form of exercise?',
        'Are you a night owl or an early bird?'
    ];

    // Choices for survey questions.
    var choices = [
        'a',
        'b',
        'c',
        'd',
        'e'
    ];

    // Identify div where questions will be inserted and initialize counter to 0.
    var questionDiv = $('#questions');
    i = 0;

    // For each question, create a div.
    questions.forEach(function (question) {
        i++;
        // Fill that div with a header, the question, and the choices selector.
        var item = $('<div class="question">');
        var headline = $('<h4>').text('Question ' + i);
        var questionText = $('<p>').text(question);
        var dropDown = $('<div class="form-group">');
        var select = $('<select class="form-control selector">');
        // Create an option for each choice.
        choices.forEach(function (choice) {
            var option = $('<option>').text(choice);
            select.append(option);
        });
        select.attr('id', 'select' + i);
        // Add the dropdown to the item, then add the item to the questions div.
        dropDown.append(select);
        item.append(headline, questionText, dropDown);
        var br = $('<br>');
        questionDiv.append(item, br);
    });

    // Event handler for when the form is submitted.
    $('#submit').on('click', function (event) {

        // Prevent reload.
        event.preventDefault();

        // Capture username and image link values.
        var userName = $('#displayName').val();
        var imageUrl = $('#imageUrl').val();

        // If both of those items were filled out, gather other answers and submit.
        if (userName.length > 0 && imageUrl.length > 0) {
            var scores = [];

            // Add the response for each selector to the array of answers.
            Object.keys($('.selector')).forEach(function (key) {
                if (scores.length < questions.length) {
                    // Take only the first character of the answer, which is the number.
                    scores.push($('.selector')[key].value.charAt(0));
                }
            });

            // Put the data in object form.
            var thisUser = {
                name: userName,
                photo: imageUrl,
                scores: scores
            };

            // POST that data to /api/friends.
            $.post('/api/friends', thisUser, function (data) {

                // Use data callback to display result.
                if (data) {

                    // Empty out modal and username and link fields.
                    $('#modalContent').empty();
                    $('#userName').val('');
                    $('#imageUrl').val('');
                    console.log(data);
                    // The results are in array form. For each object, grab the name and URL.
                    data.forEach(function (profile) {
                        var profileDiv = $('<div class="profile">');
                        var name = profile.name;
                        var photoURL = profile.photo;
                        // Put the name in a header.
                        var nameHeader = $('<h3>').text(name);
                        // Add a photo with an 'src' of the photoURL submitted.
                        var photo = $('<img>').attr('src', photoURL);
                        profileDiv.append(nameHeader, photo);

                        // Add these items to the modal.
                        $('#modalContent').append(profileDiv);
                    });

                    // If there is a tie for the best match and so you have more than one,
                    if (data.length > 1) {
                        // Make sure the header is plural.
                        $('.modal-title').text('Your best matches!');
                    } else {
                        // Make sure the header is singular.
                        $('.modal-title').text('Your best match!');
                    }

                    // Display the result modal.
                    $('#resultModal').modal();
                }
            });
            // If either name or URL is missing, show the error modal.
        } else {
            $('#errorModal').modal();
            // The error modal can be dismissed but it will also disappear after 2 seconds.
            setTimeout(function () {
                $('#errorModal').modal('hide');
            }, 2000);
        }
    });
});