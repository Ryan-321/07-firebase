var db = firebase.database()

document.getElementById('submit-btn').addEventListener('click', handleClick)
// Get data on submit
function handleClick (event) {
  event.preventDefault()
  // get data
  var name = document.getElementById('name').value
  var destination = document.getElementById('destination').value
  var firstTrain = document.getElementById('first-train').value
  var frequency = document.getElementById('frequency').value
  // build object
  var data = {}
  data.name = name
  data.destination = destination
  data.firstTrain = firstTrain
  data.frequency = frequency
  // set data in firebase
  db.ref().push(data)
  // clear it
  document.getElementById('form').reset()
  }

db.ref().on('child_added', function(snapshot) {
  console.log('child added', snapshot.val())
  // NOTE need to order these
  var data = snapshot.val()
  // append rows to the view
    // build a row
  var tr = document.createElement('tr')
  // make a loop to go over the keys???
  for (var key in data) {
    var td = document.createElement('td')
    td.innerHTML = data[key]
    tr.appendChild(td)
  }
  document.getElementById('table').appendChild(tr)
})
// make an event listener, so when new data is added, its also added to screen

// Bonus material
