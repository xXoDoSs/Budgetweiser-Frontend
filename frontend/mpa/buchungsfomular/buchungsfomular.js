$(document).ready(function(){
    $("#add-button").click(function(e){
        e.preventDefault();

        // Mapping for enums
        const typeMapping = {
            "Einnahme": "EINNAHME",
            "Ausgabe": "AUSGABE"
        };

        const categoryMapping = {
            "Gehalt": "GEHALT",
            "sonstige Einnahmen": "SONSTIGE_EINNAHMEN",
            "Miete": "MIETE",
            "Versicherung": "VERSICHERUNGEN",
            "Nebenkosten": "NEBENKOSTEN",
            "Lebensmittel": "NAHRUNGSMITTEL",
            "Freizeit": "FREIZEIT",
            "Mobilität": "MOBILITAET",
            "sonstige Ausgaben": "SONSTIGE_AUSGABEN",
            "Sparen": "SPAREN"
        };

        var rawType = $('input[name="Buchung"]:checked').val();
        var rawCategory = $(".category").val();

        var typ = typeMapping[rawType];
        var kategorie = categoryMapping[rawCategory];
        var title = $("#fomular-title").val();
        var summe = $("#fomular-budget").val();
        var datum = $("#booking-date").val();
        var beschreibung = $("#notes-id").val();

        if (!typ || !title || !summe || !datum || !kategorie){
            alert('Es wurden nicht alle wichtigen Felder ausgefüllt. Bitte überprüfe deine Buchung!');
            return;
        }

        var query = `
           mutation($input: CreateBookingInput!){
             createBooking(input: $input){
                id
                title
                type
                amount
                date
                category
                notes
           }
        }`;

        var variable = {
            input: {
                title: title,
                type: typ,
                amount: parseFloat(summe),
                date: datum,
                category: kategorie,
                notes: beschreibung,
            }
        };

        // Get token from local storage
        var token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('You are not logged in. Please log in to create a booking.');
            // Redirect to login page if it exists, otherwise alert
            // window.location.href = '../login/login.html'; 
            return;
        }

        $.ajax({
            url: 'https://budgetweiser-a9722999c31d.herokuapp.com/graphql',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: JSON.stringify({query: query, variables: variable}),

            success: function(response) {
                if (response.errors) {
                    console.error("GraphQL Error:", response.errors);
                    alert('Fehler bei der Erstellung der Buchung: ' + response.errors[0].message);
                } else {
                    alert('Buchung wurde erfolgreich erstellt');
                    $("#bookingform")[0].reset();
                    window.location.href = '../../spa/src/app/calendar/calendar.component.html';
                }
            },
            error: function(xhr, status, error){
                console.error("Fehler:", xhr, status, error);
                alert('Fehler bei der Erstellung von der Buchung. Status: ' + status);
            }
        });
    });
});