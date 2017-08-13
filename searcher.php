<?php
error_reporting(E_ALL);  //debug
ini_set("display_errors", 1); //debug


//$string = preg_replace('/\s/', '', $string);

$word1 = strval($_GET['searchWord1']);
$word2 = strval($_GET['searchWord2']);
$chart_type = strval($_GET['chart']);
$ngram = strval($_GET['ngram']);

$searchWords = array();
$sql  = array();
$number_of_search_terms = 0;
if($ngram){
	$ngram_string = $word1;
	$ngram_string = preg_replace('/\s/', '', $ngram_string); //remove whitespace
	$searchWords = explode( "," , $ngram_string ); //split into array using "," as delimiter
	$number_of_search_terms = count($searchWords);
}
else{
	if($word1 != ""){
		$searchWords[$number_of_search_terms] = $word1;
		$number_of_search_terms++; 
	}
	if($word2 != ""){
		$searchWords[$number_of_search_terms] = $word2;
		$number_of_search_terms++;
	}
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
$array_of_results = array(); //array(	0 => array(), 1 => array()); //init results array

//$a = array(); // array of columns
for($c=0; $c<$number_of_search_terms; $c++){
    $array_of_results[$c] = array(); // array of cells for column $c
    //for($r=0; $r<3; $r++){
   //     $a[$c][$r] = rand();
    //}
}

$rowcount = 0;
for($i = 0 ; $i<$number_of_search_terms ; $i++){
	$result = mysqli_query($con,$sql[$i]); 
	$data_array = mysqli_fetch_all($result , MYSQLI_ASSOC); //mysqli_fetch_array($result , MYSQLI_NUM);
	$array_of_results[$i] = $data_array;

	$rowcount += mysqli_num_rows($result); //query error check
	 if($rowcount == 0 && $i == ($number_of_search_terms-1)){ //no results from all queries
		$array_of_results =  new stdClass(); //return empty object
		}
}

mysqli_free_result($result);

mysqli_close($con);

header("Content-Type: application/json");
echo json_encode($array_of_results);
?>