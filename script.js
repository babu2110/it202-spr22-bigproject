if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function() {
          console.log("Service worker registered");
        });
}
// Body change modes
const switchControl = new mdc.switchControl.MDCSwitch(document.querySelector(".mdc-switch"));

let db = new Dexie("app_data");

db.version(1).stores({
    settings: "name"
});

db.settings.where("name").equals("mode").toArray((arr) => {
    if(arr.length == 0) {
        db.settings.add( {
            name: "mode",
            value: "light-mode"
        })
    } else {
        let mode = arr[0]["value"];
        document.querySelector("body").className = mode;
        if(mode == "light-mode") {
            switchControl.selected = false;
        } else {
            switchControl.selected = true;
        }
    }
})
document.querySelector(".mdc-switch").addEventListener("click", (f)=> {
    let newMode = switchControl.selected ? "dark-mode" : "light-mode"

    document.querySelector("body").className = newMode;
    db.settings.put({name: "mode", value: newMode})
});
//
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
// once drawer icon has been clicked.
document.querySelector(".mdc-top-app-bar__navigation-icon").addEventListener("click", (e)=>{
  drawer.open = true;
});
// Modifying navigation bar color
document.querySelector(".mdc-top-app-bar__section--align-start").style.backgroundColor = "green";
document.querySelector(".mdc-top-app-bar__section--align-end").style.backgroundColor = "green";

let changeHome = document.querySelector("#section-home");
let changeMap = document.querySelector("#section-map");
let changePlanning = document.querySelector("#section-planning");
let changeWeather = document.querySelector("#section-weather");

changeHome.style.display= "block";

// contenting what is included inside main
document.querySelector("#nav-home").addEventListener("click", (e)=> {
    changeMap.style.display = "none";
    changePlanning.style.display ="none";
    changeWeather.style.display ="none";
    changeHome.style.display= "block";
    drawer.open = false;
});
document.querySelector("#nav-planning").addEventListener("click", (e)=> {
    changeMap.style.display = "none";
    changePlanning.style.display ="block";
    changeWeather.style.display ="none";
    changeHome.style.display= "none";
    drawer.open = false;
});
document.querySelector("#nav-map").addEventListener("click", (e)=> {
    changeMap.style.display = "block";
    changePlanning.style.display ="none";
    changeWeather.style.display ="none";
    changeHome.style.display= "none";
    drawer.open = false;
});
document.querySelector("#nav-weather").addEventListener("click", (e)=> {
    changeMap.style.display = "none";
    changePlanning.style.display ="none";
    changeWeather.style.display ="block";
    changeHome.style.display= "none";
    drawer.open = false;
});
document.querySelector("#TNP-Menu").addEventListener("click", (e)=> {
    drawer.open = false;
});


// cards
let url = "https://developer.nps.gov/api/v1/parks?&api_key=mxKaB5lYe9n8BavBHs7gkOhegZ31rqcRnrZOihvi";

fetch (url)
  .then ( (response) => {
    return response.json();
  })
  .then ((json) => {
    console.log(json)

    json.data.forEach (item => {
      // clone the template
      let clone = document.querySelector("div.mdc-card").cloneNode(true);


      // update values in the clone
      clone.querySelector("div.mdc-card__actions").innerText = item.fullName;
      clone.querySelector("div.mdc-card__media").style.backgroundImage = "url("+item.images[0].url+")";
      let count = 0;

      clone.querySelector("#firstPara").addEventListener('click', (e)=> {
          if(count % 2 == 0) {
            clone.querySelector("#description").hidden = false;
          } else {
            clone.querySelector("#description").hidden = true;
          }
          count++;
      });
      let getActivities = "";
        item.activities.forEach(x => {
            getActivities = getActivities + x.name + "\n";
        });
      clone.querySelector("#description").innerText = item.description + "\n\n->Activities: \n" + getActivities + "\n\n->Weather Info\n" + item.weatherInfo;
      clone.removeAttribute("hidden");

    //   clone.classList.remove("template");

    //   // insert clone into DOM
      document.querySelector(".main-section#section-home").append(clone);
    });
    
  });

 //Google Map
 let map;
 function initMap() {
   map = new google.maps.Map(document.getElementById("map"), {
     //41.8781° N, 87.6298° W
     center: { lat: 41.8781, lng: -87.6298 },
     zoom: 10,
   });
 
   const m = new google.maps.Marker({
     //41.8696° N, 87.6496° W
     position: { lat: 41.8696, lng: -87.6496 },
     map,
     title: "UIC"
   })
 
   const contentStr = 
     '<div id="content">' +
     '<div id="siteNotice">' +
     "</div>" +
     '<h1 id="firstHeading" class="firstHeading">UIC</h1>' +
     '<div id="bodyContent">' +
     "<p><b>UIC</b>, also referred to as <b>University of Illinois at Chicago</b>, is a large " +
     "sandstone rock formation in the southern part of the " +
     "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
     "south west of the nearest large town, Alice Springs; 450&#160;km " +
     "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
     "features of the Uluru - Kata Tjuta National Park. Uluru is " +
     "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
     "Aboriginal people of the area. It has many springs, waterholes, " +
     "rock caves and ancient paintings. Uluru is listed as a World " +
     "Heritage Site.</p>" +
     '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
     "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
     "(last visited June 22, 2009).</p>" +
     "</div>" +
     "</div>";
   const infoW = new google.maps.InfoWindow({
     content: contentStr,
   })
 
   m.addListener("click", () => {
     infoW.open({
       anchor: m, map, shouldFocus: false,
     });
   });
 }
// weather api fails
//g 37.0902°, Lat -95.7129°.
//41.8781° N, 87.6298° W
  
let crimeUrl = "https://weatherdbi.herokuapp.com/data/weather/chicago";

  fetch(crimeUrl).then( (response)=> {
      return response.json()
  }).then( (json)=> {
    console.log(json.region);
    json.next_days.forEach( (e)=> {
        console.log(e.day);
        console.log(e.comment)
    })
  })
// charts
let urlPie = "https://data.cityofchicago.org/resource/dw27-rash.json?$SELECT=school_type,count(school_type)&$GROUP=school_type";

let urlLine = "https://data.cityofchicago.org/resource/553k-3xzc.json?$SELECT=date,sum(total_doses_cumulative)&$GROUP=date&$ORDER=date"
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawPieChart);

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawLineChart);
// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawPieChart() {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'School Type');
  data.addColumn('number', 'Count');

  // fetching data from API
  fetch(urlPie).then( (response) => {
    return response.json();
  }).then ( (json) => {
    // console.log(json)
    json.forEach( item => {
      // console.log(item.school_type + "  " + item.count_school_type)
      data.addRow([item.school_type, parseInt(item.count_school_type)])
    })
    var options = {'title':'How many types of school are there',
                    'width':600,
                    'height':500};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  })
}

// Google Line chart
function drawLineChart(){
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Doses');

  fetch(urlLine).then((response) => {
    return response.json();
  }).then((json) => {
    json.forEach(item => {
      // console.log(item);
      data.addRow([item.date, parseInt(item.sum_total_doses_cumulative)]);
    })
    var options = {
    title: 'Number of Doses',
    curveType: 'function',
    legend: { position: 'bottom'}
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
  })
}

// weather-card-content
