<?php
error_reporting(E_ALL);  //debug
ini_set("display_errors", 1); //debug


$word1 = strval($_GET['searchWord1']);
$word2 = strval($_GET['searchWord2']);
$chart_type = strval($_GET['chart']);

$searchWords = array();
$sql  = array();


$number_of_search_terms = 0;
if($word1 != ""){
	$searchWords[$number_of_search_terms] = $word1;
	$number_of_search_terms++; 
}
if($word2 != ""){
	$searchWords[$number_of_search_terms] = $word2;
	$number_of_search_terms++;
}

$db_host        = 'localhost';
$db_user        = 'root';
$db_pass        = '1234';
$db_database    = 'mini'; 
$db_port        = '3306';
$db_table 		= 'mini.wordsby';
$max_results 	= '31';

/*
 * init search terms and queries
 */
for($a = 0; $a<$number_of_search_terms; $a++)
{
	$sql[$a] = "";
	if($chart_type == "sunburstChart")
	{
		$sql[$a] = "SELECT * FROM ".$db_table." WHERE author = '".$searchWords[0]."' ORDER BY (count) DESC LIMIT ".$max_results.";" ; // search term will always be first and only
	}
	else{
		$sql[$a]="SELECT * FROM ".$db_table." WHERE word = '".$searchWords[$a]."';" ; //  sql query
	}
}

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

// change to dynamic init
$array_of_results = array(	0 => array(),
							1 => array()); //init results array

$rowcount = 0;
for($i = 0 ; $i<$number_of_search_terms ; $i++){
	$result = mysqli_query($con,$sql[$i]); 
	//if($i)
	//	$result = mysqli_query($con,$sql2); // i = 1
	//else
		//$result = mysqli_query($con,$sql1); // i = 0
	$data_array = mysqli_fetch_all($result , MYSQLI_ASSOC); //mysqli_fetch_array($result , MYSQLI_NUM);
	$array_of_results[$i] = $data_array;

$rowcount += mysqli_num_rows($result); //query error check
 if($rowcount == 0 && $i == ($number_of_search_terms-1)){ //no results from all queries
	$array_of_results =  new stdClass();
        //echo ('No results, sql1 = '.$sql[0].", sql2 = ".$sql[1]);
    }
}

mysqli_free_result($result);

mysqli_close($con);

header("Content-Type: application/json");
echo json_encode($array_of_results);
?>