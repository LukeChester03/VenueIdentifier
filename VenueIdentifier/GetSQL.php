<?php
$servername = "sci-mysql";
$username = "coa123wuser";
$password = "grt64dkh!@2FD";
$Databasename = "coa123wdb";
// Create connection
$conn = new mysqli($servername, $username, $password, $Databasename);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
//Connecting to HTML file
//Variables for infornation entered
$cateringGrade = (int)$_REQUEST['cateringGrade'];
$date = $_REQUEST['date'];
$partySize = (int)$_REQUEST['partySize'];

//SQL TO Collect data
$SQL = 
"SELECT name as 'Venue', catering.grade as 'Catering_grade', 
(SELECT count(venue_booking.venue_id) from venue_booking where venue_booking.venue_id = venue.venue_id ) as 'bookings',
cost, capacity, IF(licensed, 'Yes','No') as 'licensed', weekday_price, weekend_price 
FROM venue 
LEFT JOIN catering 
ON venue.venue_id = catering.venue_id 
WHERE capacity >= '$partySize' AND catering.grade = '$cateringGrade'
AND not EXISTS
(SELECT booking_date 
FROM venue_booking 
WHERE booking_date = '$date'
AND venue_booking.venue_id = venue.venue_id); ";

$result = mysqli_query($conn,$SQL);
$venues = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($venues);
?>