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

document.querySelector(".main-section#section-home").style.display= "block";

// contenting what is included inside main
document.querySelector("#nav-home").addEventListener("click", (e)=> {
    document.querySelector(".main-section").style.display= "none";
    document.querySelector(".main-section#section-home").style.display= "block";
    drawer.open = false;
});
document.querySelector("#nav-planning").addEventListener("click", (e)=> {
    document.querySelector(".main-section").style.display= "none";
    document.querySelector(".main-section#section-planning").style.display= "block";
    drawer.open = false;
});
document.querySelector("#nav-map").addEventListener("click", (e)=> {
    document.querySelector(".main-section").style.display= "none";
    document.querySelector(".main-section#section-map").style.display= "block";
    drawer.open = false;
});
document.querySelector("#nav-weather").addEventListener("click", (e)=> {
    document.querySelector(".main-section").style.display= "none";
    document.querySelector(".main-section#section-weather").style.display= "block";
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
      clone.querySelector("div.mdc-card__media-content").innerText = item.fullName;
      console.log(clone.querySelector("div.mdc-card__media-content").innerText);

    //   clone.querySelector("h6.card-subtitle.mb-2.text-muted").innerText = item.department;

    //   let a = item.job_titles;
    //   a = a + "\n" +"Annual Salary is "+ item.annual_salary;
    //   clone.querySelector("p.card-text").innerText = a;
      
    //   clone.querySelector("a.card-link").innerText = "City of Chicago"
    //   clone.querySelector("a.card-link").href = "https://data.cityofchicago.org/";
    //   // // remove hidden 

    //   clone.removeAttribute("hidden");
    //   clone.classList.remove("template");

    //   // insert clone into DOM
    //   document.body.append(clone);

    });
  });