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
  data.e_min_until = remainder(minutesGT(firstTrain), data.c_frequency)
  return data
}

function nextArrival (ft, freq) {
  var ct = moment()
  var to = moment(ft, 'HH:mm')
  if (ct > to) {
    var diff = minutesGT(ft)
    var over = remainder(diff, freq)
    return moment().add(over, 'm').format('h:mm a')
  } else {
    return moment(ft, 'HH:mm').format('h:mm a')
  }
}

function minutesGT (ft) {
  var ct = moment()
  var to = moment(ft, 'HH:mm')
  if (ct > to) {
    return ct.diff(to, 'minutes')
  } else {
    return to.diff(ct, 'minutes')
  }
}

function remainder (diff, freq) {
  return diff % freq
}

// Bonus material
