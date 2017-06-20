
const travelApp = {};
      travelApp.userInput = "";
      travelApp.countryOptions = [];
      travelApp.userCountry = "";
      travelApp.key = 'MDphZTZkOTdiNC00MjE3LTExZTctOWQ1MS01ZjJkNzBmM2EzMjg6enNhcFFjckZoZW5oV05tQWxla3V2S1dKZUdYbEw1aDNoUTZC';
  
   // Start App
    travelApp.init = function() {
        travelApp.getCountries();
        travelApp.events();
        // travelApp.getdrinkByType();
    }

   // Make AJAX request for ALL country Data 
    travelApp.getCountries = function() {
        $.ajax ({
            url: `https://restcountries.eu/rest/v2/all/`,
            method: 'GET',
            dataType: 'json'
        })
        // then store ALL DATA in an array-CountryResults
        .then(function(countryResults){
            travelApp.countries = countryResults
            travelApp.autoCompleteArray(countryResults);
            travelApp.events();
        });
   };

   // for each country name in the country object 
      //push the country data in the auto complete values = [countryOptions] array
   travelApp.autoCompleteArray = function(res) {
        res.forEach(function(country) {
            travelApp.countryOptions.push(country.name);
        });
        $('#userInput').autocomplete({
            source: travelApp.countryOptions
        });
   };


    travelApp.events = function() {
        // Once user inputs/ submits a country, then run function below
        $('#submit').on('click', function(e) {
            e.preventDefault();
            travelApp.userInput = $('#userInput').val();
            // Based on the user country selected, set values to lowercase and
            // match userInput with userMatch w filter
            var userMatch = travelApp.countries.filter(function(country){
                var lowerCountry = country.name.toString().toLowerCase();
                var lowerInput = travelApp.userInput.toString().toLowerCase();
                return lowerCountry == lowerInput;
            });
            // Exact country name is stored in userCountry value            
            travelApp.userCountry = userMatch[0].name;
            travelApp.displayResults(userMatch[0]);

             //Run the the ajax request for LCBO for find userCounrty beer
            travelApp.getdrinkByType(travelApp.userCountry);

            $('#userInput').val(''); // setting val of input to be empty ' '

        });
    };

    // search through the country object 
    // Display the select properties, in countryContainer
        travelApp.displayResults = function(country) {
            // console.log(travelApp.userCountry);
            $('.countryContainer').remove();
            $('.info').remove();
            $('.countryStamp').remove();
             $('.front').remove();
            const countryContainer = $('<div class="countryContainer">').addClass('countryContainer');
            const countryStamp = $('<div class="countryStamp">').addClass('counrtyStamp');

            const countryName = $('<h1>').text(`Welcome to: ${country.name}`); 
            const countryPop = $('<p>').text(`Peeps: ${country.population}`);
            const countryCapital = $('<h2>').text(`Capital City: ${country.capital}`);
            const countryLatLong = $('<p> ').text(`Lat & Lng ${country.latlng}`);
            const countrySubRegion = $('<h2>').text(country.subregion);
            const countryCurrencySymbol = $('<h2 class="style">').text(`Currency: ${country.currencies[0].symbol}`);
            const countryCurrencyName = $('<h2 class="style">').text(country.currencies[0].name);
            const countryFlag = $('<img class="flag">').attr('src', country.flag);

            // Display Container with all the info
            countryContainer.append(countryName, countryPop, countryCapital, 
                countryLatLong, countrySubRegion, 
                countryCurrencySymbol, countryCurrencyName);
            $('#app').append(countryContainer);
            
            countryStamp.append(countryFlag);
            $('#app').append(countryStamp);

        // Get all beer that matches the country they picked on submit
        // select random beer from that country 
        // get the name of beer 
        // put on the screen

    travelApp.getdrinkByType = function(countryType){

    $.ajax({
        url: 'https://lcboapi.com/products',
        method: 'GET',
        dataType:'json',
        headers: {
            'Authorization': 'Token token=' + travelApp.key,
        },
        data: {
            per_page: 100,
            format: 'json',
            q: 'beer+' + countryType
        }
    })
    .then(function(beerResults){
            // math.random for random beer/beer selection
            // result.length makes sure the number is within range of beer matches
            travelApp.pickRandomBeer = Math.floor(Math.random() * beerResults.result.length);
            // console.log(travelApp.pickRandomBeer;
            var beer = beerResults.result[travelApp.pickRandomBeer];
            // if there is no beer for that country in the lcbo api
            //append this message
            if (beer === undefined) {
                const noBeer = $('<p class="info">').text(`"Bon Voyage!"`);
            $('.countryStamp').append(noBeer);
            // if there is a country beer match append the beer name!
            } else {
                const countryBeer = $('<p class="info">').text(`"${beer.name}" is a beer produced here!`);
             $('.countryStamp').append(countryBeer);
            }
            
            });                                                                          
        };

    };


$(function () {
    travelApp.init();
});