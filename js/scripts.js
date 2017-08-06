// Empty JS for your own code to be here

    /**
     * TODO:
     * 1. Search for data related to first and second words
     * 2. Create Graph 
     * 3. Add data of both words to graph
     **/
function runSearch() {
  var searchTxt1 = $("#txtInput1").val();
  var searchTxt2 = $("#txtInput2").val();
//document.getElementById("debug").innerHTML += "Starting javascript runSearch function.<br />";
//document.getElementById("debug").innerHTML += "str1 is: " + searchTxt1 + "</br>" ;
//document.getElementById("debug").innerHTML += "str2 is: " + searchTxt2 + "</br>";
console.log("js: started runSearch with strTxt1 = " + searchTxt1 + ", strTxt2 = " + searchTxt2);
	
	//Check input validity
	 if (searchTxt1.length < 2 || searchTxt2.length < 2) {
        document.getElementById("results_div").innerHTML = "Please fill both text boxes </br> Search terms need to be at least 2 characters each.";
        return;
    } 
	else{
	console.log("search terms ok");}

	 $.ajax({
		url : 'searcher.php',
		type : 'GET',
		data : { searchWord1:searchTxt1,
				searchWord2:searchTxt2},
		dataType : 'json',
		contentType: "application/json; charset=utf-8",
		success : function (resultsArr) {
			
			if(resultsArr != null){
			console.log(Array.isArray(resultsArr));
			console.log(IsJsonString(JSON.stringify(resultsArr)));
			console.log(resultsArr);
			for(var i =0;i < resultsArr.length ;i++)
			{
			  var item = resultsArr[i];
			console.log(item);			
			}
			buildGraph(resultsArr);
			
			}
			else{
				error("ajax data null or undefined");
			}
		},
		error : function () {
		   alert("error: ajax get error");
		}
    })
}

/* line: 0	"2"
1	"ן"
2	"1900"
3	"16"
*/
const YEAR_LOC = 2;
const WORD_LOC = 1;
const NUMBER_LOC = 3;
function getMyDataReady(array) {
	var series = [];
	for(var i =0; i <array.length; i ++) {
		series.push([]);
		for(var z =0; z <array[i].length; z ++) {
			//series[i][z] = 0;
			var item = array[i][z];
			//console.log(array[i])
			series[i].push({
				x: item.year_creation, y: item.num_of_mentions
			});
		}
	}
	return [
		{
			key: "Series #1",
			values: series[0],
			color: "#cc99ff"
		},
		{
			key: "Series #2",
			values: series[1],
			color: "#00b33c"
		}
	];
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

	/**
	* TODO: 
	* Get graph type from html controls
	*/
	function buildGraph(resultsArr) {
		console.log("js: started buildGraph ");
		var graphData = getMyDataReady(resultsArr);
		console.log("graphData = " + graphData);			
		createBubbleChart(graphData);
	}
	
	//makes data in chart [{x:__ , y: ___} ... {x:__ y: __ }] format


/*
Format of data : 
	[
		{
			key: "Series #1",
			values: [{x: 1, y: 100}, {x: 234, y: 18 } .... ]
			color: "#0000ff"
		},
		{
			key: "Series #2",
			values: [{x: 15, y: 30}, {x: 2, y: 1 } .... ]
			color: "#2ca02c"
		},
		...
		{
			...
		}
	];
	
*/
function createLineChart(data) {

nv.addGraph(function() {
  var chart = nv.models.lineChart()
                .margin({top: 30, right: 60, bottom: 50, left: 70})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .duration(350)  //how fast do you want the lines to transition? 
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
	;

  chart.xAxis     //Chart x-axis settings
      .axisLabel("Year")
      .tickFormat(d3.format('04d'))
	;

  chart.yAxis     //Chart y-axis settings
      .axisLabel("Mentions")
      .tickFormat(d3.format('d'))
	  
	;

  /* Done setting the chart up? Time to render it!*/
  var myData = sinAndCos();   //You need data...

  d3.select("svg")    //Select the <svg> element you want to render the chart in.   
      .datum(myData)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!

  //Update the chart when window resizes.
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});
}

function createBubbleChart(data){
	var groupcolour = [];
	var maxX = Number.NEGATIVE_INFINITY;
	var minX = Number.POSITIVE_INFINITY;
	var maxY = Number.NEGATIVE_INFINITY;
	var minY = Number.POSITIVE_INFINITY;
	  for (var i = 0; i < data.length; i++) {
		var temp = d3.max(data[i].values, function (d) { return +d.x; });
		if(maxX < temp)
			maxX = temp;
		temp = d3.min(data[i].values, function (d) { return +d.x; });
		if(minX > temp)
			minX = temp;
		temp = d3.max(data[i].values, function (d) { return +d.y; });
		if(maxY < temp)
			maxY = temp;
		temp = d3.min(data[i].values, function (d) { return +d.y; });
		if(minY > temp)
			minY = temp;
		groupcolour[i] = data[i].color;
  }

	console.log("X: " + minX + "-" + maxX);
	console.log("X: " + minY + "-" + maxY);
	
	nv.addGraph(function() {
  var chart = nv.models.scatterChart()
                .showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
                .showDistY(true)
                .duration(350)
                .color(groupcolour)
				.forceY([0,maxY])
				.forceX([minX,maxX])
				;

  //Configure how the tooltip looks.
  chart.tooltip.contentGenerator(function(key) {
      return '<h3>' + key + '</h3>';
  });

  //Axis settings
  chart.xAxis.tickFormat(d3.format('.02f'));
  chart.yAxis.tickFormat(d3.format('.02f'));

  //We want to show shapes other than circles.
 // chart.scatter.onlyCircles(false);

  var myData = data;
  d3.select("svg")
      .datum(myData)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});

}

function sinAndCos() {
  var sin = [],sin2 = [],
      cos = [];

  //Data is represented as an array of {x,y} pairs.
  for (var i = 0; i < 100; i++) {
    sin.push({x: i, y: Math.sin(i/10)});
    sin2.push({x: i, y: Math.sin(i/10) *0.25 + 0.5});
    cos.push({x: i, y: .5 * Math.cos(i/10)});
  }

  //Line chart data should be sent as an array of series objects.
  return [
    {
      values: sin,      //values - represents the array of {x,y} data points
      key: 'Sine Wave', //key  - the name of the series.
      color: '#ff7f0e'  //color - optional: choose your own line color.
    },
    {
      values: cos,
      key: 'Cosine Wave',
      color: '#2ca02c'
    },
    {
      values: sin2,
      key: 'Another sine wave',
      color: '#7777ff',
      area: true      //area - set to true if you want this line to turn into a filled area chart.
    }
  ];
}

