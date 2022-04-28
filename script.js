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
            // document.querySelector(".card.template").style.backgroundColor = "black";
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

document.querySelector(".mdc-top-app-bar__navigation-icon").addEventListener("click", (e)=>{
  drawer.open = true;
});

document.querySelector(".mdc-top-app-bar__section--align-start").style.backgroundColor = "green";
document.querySelector(".mdc-top-app-bar__section--align-end").style.backgroundColor = "green";
document.querySelector(".main-section#home").style.display= "block";

let checkSelected = document.querySelector(".mdc-list-item").getAttribute('aria-selected');
let itemText = document.querySelector(".mdc-list-item__text").innerHTML;
if( itemText == "Park News" && checkSelected) {
    console.log("Clicked on Park News")
} else if(itemText == "Planning" && checkSelected) {
    console.log("Planning");
} else if (itemText == "National Parks" && checkSelected) {
    console.log("National Parks");
} else if (itemText == "Weather" && checkSelected){
    console.log("Weather");
}

// cards
let url = "https://data.cityofchicago.org/resource/xzkq-xp2w.json";

fetch (url)
  .then ( (response) => {
    return response.json();
  })
  .then ((json) => {
    console.log(json)

    json.forEach (item => {
      // clone the template
      let clone = document.querySelector("div.card.template").cloneNode(true);


      // // update values in the clone
      clone.querySelector("h5.card-title").innerText = item.name;

      clone.querySelector("h6.card-subtitle.mb-2.text-muted").innerText = item.department;

      let a = item.job_titles;
      a = a + "\n" +"Annual Salary is "+ item.annual_salary;
      clone.querySelector("p.card-text").innerText = a;
      
      clone.querySelector("a.card-link").innerText = "City of Chicago"
      clone.querySelector("a.card-link").href = "https://data.cityofchicago.org/";
      // // remove hidden 

      clone.removeAttribute("hidden");
      clone.classList.remove("template");

      // insert clone into DOM
      document.body.append(clone);

    });

  })