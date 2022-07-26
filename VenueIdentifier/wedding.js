//get the date values
let todaysDate = new Date();
//filter date values
const day = todaysDate.getDate();
const month = todaysDate.getMonth() + 1; // getMonth() returns month from 0 to 11
const year = todaysDate.getFullYear();

//convert string
let fullDate = `${year}-${month < 10 ? "0" : ""}${month}-${day}`;
//get Id and assign
document.getElementById("date").valueAsDate = todaysDate;
document.getElementById("date").min = fullDate;

document.querySelector("form").onsubmit = async (event) => {
  event.preventDefault();
  renderHTML();
};

//AJAX
async function getVenues(event) {
  try {
    const caterGrade = document.getElementById("cateringGrade");
    const datehtml = document.getElementById("date");
    const Partysize = document.getElementById("partySize");

    const response = await fetch(
      `GetSQL.php?date=${datehtml.value}&cateringGrade=${caterGrade.value}&partySize=${Partysize.value}`
    );
    const responseJSON = await response.json();
    return responseJSON;
  } catch (error) {
    console.log(error);
  }
}

function getDayTypes() {
  //Make the daymap to get the days
  //connect it to the date input
  const datehtml = document.getElementById("date");
  let myDate = new Date(datehtml.value);

  const dayMap =
    "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");

  let day = dayMap[myDate.getDay()];

  return day;
}

async function renderHTML(dayMap) {
  //AJAX implementation
  let venues = await getVenues();

  let weddingContainer = document.getElementById("grid");
  const Partysize = +document.getElementById("partySize").value;
  weddingContainer.innerHTML = "";
  if (!venues) {
    weddingContainer.innerHTML += `<p>There are no venues to show</p>`;
    return;
  }

  // const days = getDays(date1, date2);
  // const [weekenddays,weekdays] = getDayTypes(days);

  for (let i = 0; i < venues.length; i++) {
    const {
      Venue,
      Catering_grade,
      cost,
      capacity,
      licensed,
      bookings,
      weekday_price,
      weekend_price,
    } = venues[i];

    //Calculating Total Price
    let TotalPrice = 0;
    if (dayMap === "Sunday" || dayMap === "Saturday") {
      TotalPrice = +Partysize * +cost + +weekend_price;
    } else {
      TotalPrice = +Partysize * +cost + +weekday_price;
    }

    weddingContainer.innerHTML += `<div class="card">
    <div class="card-body">
    <h5 class="card-title" >${Venue}</h5>
    <p class="card-text">Wedding for: ${getDayTypes()}</p>
    </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item"> Catering grade: ${Catering_grade}</li>
    <li class="list-group-item">Cost per person: £${cost}</li>
    <li class="list-group-item">Capacity: ${capacity}</li>
    <li class="list-group-item">   Licensed: ${licensed}</li>
    <li class="list-group-item"> Total Bookings: ${bookings}</li>
    <li class="list-group-item">Weekday Price: £${weekday_price}</li>
    <li class="list-group-item">Weekend Price: £${weekend_price}</li>
    <li class="list-group-item">Total Price: £${TotalPrice}</li>
  </ul>
</div>`;
  }
}
