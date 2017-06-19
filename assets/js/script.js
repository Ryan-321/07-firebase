var db = firebase.database()

// event listeners

document.getElementById('submit-btn').addEventListener('click', handleClick)
function handleClick (event) {
  event.preventDefault()
  var data = getData()
  console.log(data)
  db.ref().push(data)
  document.getElementById('form').reset()
}
// firebase listeners

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


// functions

function getData () {
  var data = {}
  var firstTrain = document.getElementById('first-train').value
  data.a_name = document.getElementById('name').value
  data.b_destination = document.getElementById('destination').value
  data.c_frequency = document.getElementById('frequency').value
  data.d_next_arrival = nextArrival(firstTrain, data.c_frequency)
  data.e_min_over = minutesOver(minutesDiff(firstTrain), data.c_frequency)
  return data
}

function nextArrival (ft, freq) {
  var ct = moment()
  var to = moment(ft, 'HH:mm')
  if (ct > to) {
    var over = minutesOver(minutesDiff(to), freq)
    return moment().add(over, 'm').format('h:mm a')
  } else {
    return moment(ft, 'HH:mm').format('h:mm a')
  }
}

function minutesDiff (ft) {
  var ct = moment()
  var to = moment(ft, 'HH:mm')
  return ct.diff(to, 'minutes')
}

function minutesOver (diff, freq) {
  return diff % freq
}

// Bonus material
