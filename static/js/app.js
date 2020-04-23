//Import Data   
var url = "http://localhost:5000/api/covid_cases/date/?day=2020-04-10";
var dates = [];
// Adding tile layer
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 3
});
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken:API_KEY
}).addTo(myMap);
states=["Alaska","Alabama","Arkansas","Arizona","California","Colorado","Connecticut","District of Columbia","Delaware","Florida","Georgia","Hawaii","Iowa","Idaho","Illinois","Indiana","Kansas","Kentucky","Louisiana","Massachusetts","Maryland","Maine","Michigan","Minnesota","Missouri","Mississippi","Montana","North Carolina","North Dakota","Nebraska","New Hampshire","New Jersey","New Mexico","Nevada","New York","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Virginia","Vermont","Washington","Wisconsin","West Virginia","Wyoming"]
   // optionChanged("All");
   //d3.select("#selDataset").on('change',() => {
  // optionChanged(d3.event.target.value);
  // });
d3.select ("#selState").append('option').attr('value',"USA" ).text('USA');
 for (var i = 0; i<states.length; i++)
	 {
		 d3.select ("#selState").append('option').attr('value',states[i] ).text(states[i]);
	 }

    function optionChanged(selectedID){
      buildPlot(selectedID)
      //console.log(selectedID);
	  buildPie(selectedID);
     } 
	 function optionChanged2(selectedID){
      buildLHS(selectedID)
      //console.log(selectedID);
     } 
	  function optionDate(selectedID){
      buildMap(selectedID)
      //console.log(selectedID);
     } 
	 
d3.select ("#selState2").append('option').attr('value',"USA" ).text('USA');
 for (var i = 0; i<states.length; i++)
	 {
		 d3.select ("#selState2").append('option').attr('value',states[i] ).text(states[i]);
	 }
   
buildPlot("USA");
buildLHS("USA");
//buildMap();
buildPie("USA")
//buldTopBar()


function buildPlot(state) {
////console.log(state);
if (state == "USA")
  var url = "http://localhost:5000/api/covid_cases";
else 
  var url = "http://localhost:5000/api/covid_cases/state/?name="+state;
  //console.log(url);}

  d3.json(url).then(function(data) {
    // Grab values from the response json object to build the plots
    var name = "Covid Cases";
    var startDate = "2020-01-22";
    var endDate = "2020-04-10";
    // Print the names of the columns
    //console.log(data.column_names);
    // Print the data for each day
    //console.log(data);
    // Use map() to build an array of the the dates
    dates = data.map(row=>row['Date']);
	console.log(dates);
	if (state == "USA"){
		for (var i = dates.length; i>0; i--)
		{
		 d3.select ("#selDate").append('option').attr('value',dates[i-1] ).text(dates[i-1]);
		 //console.log(dates[i])
		}
		buildMap(dates[dates.length-1]);
	}
    // Use map() to build an array of the closing prices
    var ConfirmedCases = data.map(row=>row['Confirmed']);
	//console.log(ConfirmedCases);
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: ConfirmedCases,
      fill:'tozeroy',
      line: {
        color: "#32CD32"
      }
    };

    var data = [trace1];

    var layout = {
      title: `Covid Confirmed Cases `+state,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot("line_1", data, layout);

  });
  
}

function buildLHS(state) {
	//console.log(state);
if (state == "USA")
  var url = "http://localhost:5000/api/LHS_Sales/USA";
else 
  var url = "http://localhost:5000/api/LHS_Sales/state?state="+state;
  //console.log(url);}

  d3.json(url).then(function(data) {
    // Grab values from the response json object to build the plots
    var name = "Covid Cases";
    var startDate = "2019-12-01";
    var endDate = "2020-04-10";
    // Print the names of the columns
    //console.log(data.column_names);
    // Print the data for each day
    //console.log(data);
    // Use map() to build an array of the the dates
    var dates = data.map(row=>row['Week Ending']);
	//console.log(dates);
    // Use map() to build an array of the closing prices
    var UnitSales = data.map(row=>row['Unit Sales']);
	//console.log(UnitSales);
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: state,
      x: dates,
      y: UnitSales,
      marker: {
        color: "#128012",
        //line:{width:3}
      }
    };

    var data = [trace1];

    var layout = {
      title: `Liquid Hand Soap Unit Sales in `+state,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };


    Plotly.newPlot("line_2", data, layout);

  });
}


function buildMap(day)
{
// Create a map object
myMap.remove();
 myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 3
});
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken:API_KEY
}).addTo(myMap);



url = "http://localhost:5000/api/covid_cases/date/?day=" + day;
console.log(day);
buldTopBar(day);
d3.json(url).then(function(data) {

// Loop through the countries array
 for (var i = 0; i<data.length; i++)
	 {

	//var color1 ="";

  // Conditionals for state confirmed cases
   ////console.log(data[i].Confirmed);
	if (data[i].Confirmed > 5000)
	{
		color1 = "red";
		radius1= 100000;
  }
  else if (data[i].Confirmed  > 3000)
	{
		color1 = "orange";
		radius1= 100000;
	}
	else if (data[i].Confirmed  > 2000)
	{
		color1 = "yellow";
		radius1= 100000;
	}
	else if (data[i].Confirmed> 1000)
	{
		color1 = "yellowgreen";
		radius1= 50000;
	}
	else if (data[i].Confirmed< 1000)
	{
		color1 = "green";
		radius1= 25000;
  }
  
	var geojsonMarkerOptions = {
    radius: radius1,
    fillColor: color1,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
//console.log(geojsonMarkerOptions);
  L.circle([data[i].latitude,data[i].longitude],geojsonMarkerOptions).bindTooltip("<h3>" + data[i]['Province/State'] + "</h3> <hr> <h5>Confirmed: " + data[i].Confirmed + "</h5> <hr> <h5>Deaths: " + data[i].Deaths + "</h5>").addTo(myMap);
}
});

function Gradient(cases1) {
  return cases1 > 5000 ? 'red' :
          cases1> 3000? 'orange' :
        cases1> 2000? 'yellow' :
        cases1 > 1000  ? 'yellowgreen' :
                  'green';
}

//create the legend for the map
var legend = L.control({position: 'bottomleft'});
  
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        casenum = [0,1000, 2000, 3000, 5000],
        legendLabel = ["<1k", "1k-2k", "2k-3k", "3k-5k",">5k"];

        
    for (var i = 0; i < casenum.length; i++) {
        div.innerHTML +=
            '<i style="background:' + Gradient(casenum[i] + 1) + '"></i> ' + legendLabel[i] + "<br/>" ;
    }

    return div;
};

legend.addTo(myMap);



}

function buildPie(state){


  var url = "http://localhost:5000/api/covid_cases/latest/?state="+state
  console.log(url)

  d3.json(url).then(function(data) {
    // Grab values from the response json object to build the plots
   
    //console.log(data);
   // Use map() to build an array of the closing prices
    //var ConfirmedCases = data.map(row=>row['Confirmed']);
	////console.log(ConfirmedCases);
   // append key-value pair 
      var deaths=data[0].Deaths;
	  var confirmed =data[0].Confirmed;

	// PIE CHART : Deaths as a % of Confirmed Cases by State
	 var trace1 = {
		 labels: ["Deaths", "Confirmed"],
		 values: [ deaths,confirmed],
     type: 'pie',
     marker: {
      colors: [
        'red',
        '#083666'
      ]
    },
	   };
  
     var data = [trace1];
  
    var layout = {
         title: " Deaths to TTL Cases Ratio in " +state,
     };
  
     Plotly.newPlot("Pie-chart", data, layout); 

  });
}

 function buldTopBar(day){
// 3. Use the map method with the arrow function to return all the filtered states' names.
var url = "http://localhost:5000/api/covid_cases/top/?type=deaths&day=" + day;
  //console.log(url);}

  d3.json(url).then(function(data)
  {
	var states = data.map(row => row['Province/State'])

	//  Check your filtered cities
	console.log(states);

	// 4. Use the map method with the arrow function to return all the filtered cities' populations.

	var deaths = data.map(row => row['Deaths'])
	//  Check the deaths of your filtered cities
	console.log(deaths);
	// 5. Create your trace.
	var trace1 = {
    x:states,
    y:deaths, 
    type: 'bar', 
    marker: {
      color: "red"}
  };

	// 6. Create the data array for our plot

	var data = [trace1];

	// 7. Define our plot layout

	var layout = {
     title: "Top 10 Mortality States on " + day,
     xaxis: { title: "State"},
	 yaxis: { title: "Deaths"},
	 //marker: {
			//color: '#ed0e0e'
	//	}
	};
	

// 8. Plot the chart to a div tag with id "bar-plot"

	Plotly.newPlot("bar-deaths", data, layout);
 });
 var url = "http://localhost:5000/api/covid_cases/top/?type=confirmed&day=" + day;
  //console.log(url);}

  d3.json(url).then(function(data)
  {
	var states = data.map(row => row['Province/State'])

	//  Check your filtered cities
	console.log(states);

	// 4. Use the map method with the arrow function to return all the filtered cities' populations.

	var confirmed = data.map(row => row['Confirmed'])
	//  Check the deaths of your filtered cities
	console.log(confirmed);
	// 5. Create your trace.
	var trace1 = {
    x:states,
    y:confirmed, 
    type: 'bar',
    marker: {
      color: "#e0bb36"}
  };

	// 6. Create the data array for our plot

	var data = [trace1];

	// 7. Define our plot layout

	var layout = {
     title: "Top 10 Infected States on " + day,
     xaxis: { title: "State"},
	 yaxis: { title: "Confirmed Cases"}
	};

// 8. Plot the chart to a div tag with id "bar-plot"

	Plotly.newPlot("bar-confirmed", data, layout);
 });
}