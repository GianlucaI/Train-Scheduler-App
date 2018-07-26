// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBn8VzqoQlfYNpkFKfoJKPmmuAfCXyy4T0',
  authDomain: 'train-scheduler-d6d01.firebaseapp.com',
  databaseURL: 'https://train-scheduler-d6d01.firebaseio.com',
  projectId: 'train-scheduler-d6d01',
  storageBucket: '',
  messagingSenderId: '685259410734'
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// -----------------------------

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref('/connections');

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref('.info/connected');

// When the client's connection state changes...
// connectedRef.on('value', function(snap) {
//   If they are connected..
//   if (snap.val()) {
//     Add user to the connections list.
//     var con = connectionsRef.push(true);
//     Remove user from the connection list when they disconnect.
//     con.onDisconnect().remove();
//   }
//});
$('#addTrain').on('click', function(event) {
  event.preventDefault();

  var trainName = $('#inputName').val();
  var trainDestination = $('#inputDestination').val();
  var trainStart = $('#inputStart').val();
  var trainFrequency = $('#inputFrequency').val();

  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency
  };

  //Uploads the train data to the firebase database
  database.ref().push(newTrain);

  console.log(
    newTrain.name,
    newTrain.destination,
    newTrain.start,
    newTrain.frequency
  );

  alert('Train successfully added');

  // Clears all of the text-boxes
  $('#inputName').val('');
  $('#inputDestination').val('');
  $('#inputStart').val('');
  $('#inputFrequency').val('');
});
// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on('child_added', function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainFrequency);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var trainStartConverted = moment(trainStart, 'HH:mm').subtract(1, 'years');
  console.log(trainStartConverted);

  // Current Time
  var currentTime = moment();
  console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm'));

  // Difference between the times
  var diffTime = moment().diff(moment(trainStartConverted), 'minutes');
  console.log('DIFFERENCE IN TIME: ' + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log('MINUTES TILL TRAIN: ' + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
  console.log('ARRIVAL TIME: ' + moment(nextTrain).format('hh:mm'));

  // Create the new row
  var trainRow = $('<tr>').append(
    $('<td>').text(trainName),
    $('<td>').text(trainDestination),
    $('<td>').text(trainFrequency),
    $('<td>').text(nextTrain),
    $('<td>').text(tMinutesTillTrain)
  );

  // Append the new row to the table
  $('#train-table > tbody').append(trainRow);
});
