<?php
error_reporting(E_ALL);  //debug
ini_set("display_errors", 1); //debug

$word1 = strval($_GET['searchWord1']);
$word2 = strval($_GET['searchWord2']);

$db_host        = 'localhost';
$db_user        = 'root';
$db_pass        = '1234';
$db_database    = 'mini'; 
$db_port        = '3306';

//this is checked on client side
//if(strlen($word1) < 2 || strlen($word2) < 2 ) //search term must be longer than a single char
	//die('php strings did not parse');

$con = mysqli_connect($db_host,$db_user,$db_pass,$db_database,$db_port);
  
if (!$con) { // Check connection
	die('Could not connect: ' . mysqli_error($con));
}

$status = mysqli_select_db($con,$db_database);
$sql1="SELECT * FROM mini.words WHERE word = 'חיים' ;" ; // WHERE id = '".$q."'";
$sql2="SELECT * FROM mini.words WHERE word = 'אהבה' ;" ; // WHERE id = '".$q."'";
$array_of_results = array(0 => array(),
						1 => array());

for($i = 0 ; $i<2 ; $i++){
	if($i)
$result = mysqli_query($con,$sql2);
	else
 $result = mysqli_query($con,$sql1);

$rowcount=mysqli_num_rows($result);

 if($rowcount == 0){
        echo 'No results';
		exit(); //check this
    }

$data_array = mysqli_fetch_all($result , MYSQLI_ASSOC); //mysqli_fetch_array($result , MYSQLI_NUM);


if($i)
	$array_of_results[1] = $data_array;
else
	$array_of_results[0] = $data_array;
}

mysqli_free_result($result);

mysqli_close($con);
/*
TODO: 
change later to send multiple arrays
*/
header("Content-Type: application/json");
echo json_encode($array_of_results);
?>