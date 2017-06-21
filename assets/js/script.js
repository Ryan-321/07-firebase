/* global moment firebase */

var db = firebase.database()

// event listeners

document.getElementById('submit-btn').addEventListener('click', handleClick)
function handleClick (event) {
  event.preventDefault()
  var data = getData()
  db.ref().push(data)
  document.getElementById('form').reset()
}

// firebase listeners

// update times in DB for current time
db.ref().once('value').then(function (snapshot) {
  for (var key in snapshot.val()) {
    var arrival = snapshot.val()[key].d_next_arrival
    var freq = snapshot.val()[key].c_frequency
    var formattedArrival = moment(arrival, 'h:mm a').format('HH:mm')
    var na = nextArrival(formattedArrival, freq)
    var min = minutesAway(moment(na, 'h:mm a').format('HH:mm'))
    var updates = {}
    updates.d_next_arrival = na
    updates.e_min_until = min
    // update time
    db.ref(key).update(updates).then(function () {
    })
  }
}).then(function () {
  db.ref().on('child_added', function (snapshot) {
    var data = snapshot.val()
    var tr = document.createElement('tr')
    for (var key in data) {
      var td = document.createElement('td')
      td.innerHTML = data[key]
      tr.appendChild(td)
    }
    document.getElementById('table').appendChild(tr)
  })
})

// functions

function getData () {
  var data = {}
  var arrival = document.getElementById('first-train').value
  data.a_name = document.getElementById('name').value
  data.b_destination = document.getElementById('destination').value
  data.c_frequency = document.getElementById('frequency').value
  data.d_next_arrival = nextArrival(arrival, data.c_frequency)
  data.e_min_until = minutesAway(moment(data.d_next_arrival, 'h:mm a').format('HH:mm'))
  return data
}

function nextArrival (train, freq) {
  var currentTime = moment()
  var arrival = moment(train, 'HH:mm')
  if (currentTime.format('HH:mm') > arrival.format('HH:mm')) {
    // difference in minutes from current time to first arrival
      // divide that by freq, add that reminder to current time for next train
    var diff = currentTime.diff(arrival, 'minutes') % freq
    return moment().add(diff, 'm').format('h:mm a')
  } else if (currentTime.format('HH:mm') === arrival.format('HH:mm')) {
    return currentTime.add(freq, 'm').format('h:mm a')
  } else {
    // if arrival time is > than current, return arrival time
    return moment(arrival, 'HH:mm').format('h:mm a')
  }
}

function minutesAway (train) {
  var currentTime = moment()
  var arrival = moment(train, 'HH:mm')
  // amount in min arrival is greater than currentTime
  var diff = arrival.diff(currentTime, 'minutes')
  return diff
}

// Bonus material
