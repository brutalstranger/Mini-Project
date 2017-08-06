<?php
error_reporting(E_ALL); 
ini_set("display_errors", 1);

$word1 = strval($_GET['searchWord1']);
$word2 = strval($_GET['searchWord2']);

$db_host        = 'localhost';
$db_user        = 'root';
$db_pass        = '1234';
$db_database    = 'world'; 
$db_port        = '3306';

$con = mysqli_connect($db_host,$db_user,$db_pass,$db_database,$db_port);

if (mysqli_connect_errno()) {
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}
else
{
echo("Connection OK <br />");
}
  // Check connection
if (!$con) {
	die('Could not connect: ' . mysqli_error($con));
}

$status = mysqli_select_db($con,"world");
if ($status) {
	echo "Found DB <br />";
}
else
{
die('Could not connect: ' . mysqli_error($con));
}

// REAL LINE ONCE IN USE:
//$sql="SELECT * FROM table WHERE word = '".$."'";
$sql="SELECT * FROM world.city LIMIT 5;"; // WHERE id = '".$q."'";
$result = mysqli_query($con,$sql);
 
$rowcount=mysqli_num_rows($result);

 if($rowcount == 0)
    {
        echo 'No results';
		exit(); //check this
    }
echo ("PHP: string words to search for are: " . $word1 . ", " . $word2 . "</br>" );
//debug	
echo ("num of rows: " . $rowcount);

//making the table	
echo (" <table> <tr>
    <th>Name</th>
    <th>District</th>
  </tr>
");

while($row = mysqli_fetch_array($result)) {
  echo("<tr> <td> " . $row["Name"] . "</td> <td>" . $row["District"] .  "</td>   </tr>");
}

echo " </table> ";

mysqli_close($con);