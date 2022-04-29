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
      clone.querySelector("#description").innerText = item.description + "\nActivities: \n" + getActivities;
      clone.removeAttribute("hidden");

    //   clone.classList.remove("template");

    //   // insert clone into DOM
      document.body.append(clone);
    });
    
  });