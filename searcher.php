<?php
error_reporting(E_ALL);  //debug
ini_set("display_errors", 1); //debug

$word1 = strval($_GET['searchWord1']);
$word2 = strval($_GET['searchWord2']);

$number_of_words = 2; //can be dynamic in future (fix here)

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

if(!$status)
	die('searcher.php: mysqli_select_db failed!');

//$sql1="SELECT * FROM mini.words WHERE word = '".$word1."';" ; // first sql query
//$sql2="SELECT * FROM mini.words WHERE word = '".$word2."' ;" ; // second sql query
$sql1="SELECT * FROM mini.word_ext WHERE word = '".$word1."';" ; // first sql query
$sql2="SELECT * FROM mini.word_ext WHERE word = '".$word2."' ;" ; // second sql query

$array_of_results = array(	0 => array(),
							1 => array()); //init results array
$rowcount = 0;

for($i = 0 ; $i<$number_of_words ; $i++){
	if($i)
		$result = mysqli_query($con,$sql2); // i = 1
	else
		$result = mysqli_query($con,$sql1); // i = 0
$data_array = mysqli_fetch_all($result , MYSQLI_ASSOC); //mysqli_fetch_array($result , MYSQLI_NUM);
if($i)
	$array_of_results[$i] = $data_array;
else
	$array_of_results[$i] = $data_array;

$rowcount += mysqli_num_rows($result); //query error check
 if($rowcount == 0 && $i == $number_of_words){ //no results from all queries
        echo ('No results, sql1 = '.$sql1.", sql2 = ".$sql2);
		exit(); //check this
    }
}

mysqli_free_result($result);

mysqli_close($con);

header("Content-Type: application/json");
echo json_encode($array_of_results);
?>