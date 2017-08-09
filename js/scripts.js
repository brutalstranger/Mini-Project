/**
 * 
 * scripts.js 
 * This file runs all logic for the webpage index.html
 *
 */
 
 
/**
* Globals
* searchTxt1 = 1st word to search for
* searchTxt2 = 2nd word to search for
* chart_types = keep all chart types here
* data_info = [minX, maxX, minY, maxY , groupcolour[] ] use to render graph later
*/
var searchTxt1;
var searchTxt2;
var chart_types = ["LineChart", "ScatterChart" , "MultiBarChart"];
var data_info = []; //= [minX, maxX, minY, maxY , groupcolour[] ]
var words;

/**
 * Constants
 * Used mainly for data_info Locations
 */   
const minX_LOC = 0;
const maxX_LOC = 1;
const minY_LOC = 2;
const maxY_LOC = 3;
const colors_LOC = 4;

/**
* Main search function called from html
**/
function runSearch() {
	searchTxt1 = $("#txtInput1").val();
	searchTxt2 = $("#txtInput2").val();
	words = []; //init
	words.push(searchTxt1 , searchTxt2);
	console.log("js: started runSearch with strTxt1 = " + searchTxt1 + ", strTxt2 = " + searchTxt2);
	console.log("words[] = " + words);
	
	if(!(	(searchTxt1.length > 2 && searchTxt2.length > 2) 	|| 
			(searchTxt1.length == 0 && searchTxt2.length > 2) 	||
			(searchTxt1.length > 2 && searchTxt2.length == 0)	)) {//Check input. These are all good cases.
		console.log("bad input");
		document.getElementById('help_div').style.visibility = 'visible';
		document.getElementById("help_div").innerHTML = "Search terms needs to be at least 3 characters. </br> Note: it is possible to fill in only one textbox.";
		return;
	} 
	else{
		document.getElementById('results_div').style.visibility = 'visible';
		document.getElementById('help_div').style.visibility = 'hidden';
		console.log("search terms ok");

		$.ajax({
			url : 'searcher.php',
			type : 'GET',
			data : { searchWord1:searchTxt1,
					searchWord2:searchTxt2},
			dataType : 'json',
			contentType: "application/json; charset=utf-8",
			success : function (resultsArr) {
				
				if(resultsArr != null){
					console.log("json valid? " + IsJsonString(JSON.stringify(resultsArr)));
					console.log("resultArray: ");
					for(var i =0;i < resultsArr.length ;i++)
					{
					var item = resultsArr[i];
					console.log(item);			
					}
					buildGraph(resultsArr);
				}
				else{error("ajax data null or undefined");}
			},
			error : function () {
			   alert("error: ajax get error");
			}
		})
	}
}

/**
*makes data in chart [{x:__ , y: ___} ... {x:__ y: __ }] format
*/
function getMyDataReady(array) {
	var series = [];
	var shapes = ['circle', 'triangle-up', 'cross', 'triangle-down', 'diamond', 'thin-x', 'square'];
	var colors = ["#cc99ff" , "#63edd6"];
	for(var i =0; i <array.length; i ++) {
		//console.log("getGraphData array[i=" + i+"] = " + array[i]);
		if(array[i].length > 0){ //if any items exist
		series.push([]);
		for(var z =0; z <array[i].length; z ++) {	
			var item = array[i][z];
			series[i].push({
				x: item.year_creation, y: item.num_of_mentions , size: item.num_of_mentions ,shape: shapes[i]
			});
		}
		series[i].sort(function(a, b){return a.x-b.x}); //sort by year for graph view
		}
	}
	var ans = [];
	for(var idx =0; idx <series.length; idx ++) {	
	ans.push({
		key: words[idx],
			values: series[idx],
			color: colors[idx],
			nonStackable: false
	});
	}
	return ans;	
}

	/**
	* buildGraph 
	* Receives js array
	* gets graphData from it
	* gets max/min values of graph data into global data_info
	* gets type_of_chart from html
	* switch on type of graph and build
	*/
	function buildGraph(resultsArr) {
		console.log("js: started buildGraph ");
		var graphData = getMyDataReady(resultsArr);
		for(var t=0 ; t < graphData.length ; t++)
			console.log("graphData["+ t + "] = %o" ,graphData[t]);			
		var type_of_chart = $("input[type='radio'][name='radio_charts']:checked").val();
		data_info = getMaxs(graphData); //data_info = [minX, maxX, minY, maxY , groupcolor[] ]
		var svg = d3.select("svg"); //clear current chart
		svg.selectAll("*").remove(); //clear current chart
		
		switch(type_of_chart){
			case "LineChart":
			createLineChart(graphData);
			break;
			case "ScatterChart":
			createScatterChart(graphData);
			break;
			case "MultiBarChart":
			createMultiBarChart(graphData);
			break;
		}
	}

/**
 * Region graph generators
 */
function createLineChart(data) {
	nv.addGraph(function() {
	var chart = nv.models.lineChart()
                .margin({top: 20, right: 20, bottom: 20, left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .duration(350)  //how fast do you want the lines to transition?
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
				.color(data_info[colors_LOC])
				.forceY([0,data_info[maxY_LOC]]) //set Y axis range
				.forceX([data_info[minX_LOC],data_info[maxX_LOC]]) //set X axis range
	;

  chart.xAxis     //Chart x-axis settings
      .axisLabel('Year')
      .tickFormat(d3.format('d'));

  chart.yAxis     //Chart y-axis settings
      .axisLabel('Number of Mentions')
      .tickFormat(d3.format('d'));

  var myData = data;   //Set data

  /* Done setting the chart up, render it!*/
  d3.select('svg')    //Select the <svg> element you want to render the chart in.   
      .datum(myData)         //Populate the <svg> element with chart data...
      .call(chart);          //render the chart!

  //Update the chart when window resizes.
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});
}

function createScatterChart(data){
	nv.addGraph(function() {
  var chart = nv.models.scatterChart()
				.margin({top: 20, right: 20, bottom: 20, left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
                .showDistY(true)
                .duration(350)
                .color(data_info[colors_LOC])
				.forceY([data_info[minY_LOC],data_info[maxY_LOC]]) //set Y axis range
				.forceX([data_info[minX_LOC],data_info[maxX_LOC]]) //set X axis range
				;

  //Configure how the tooltip looks.
  chart.tooltip.contentGenerator(function(key) {
      return '<h3>' + key + '</h3>';
  });

  //Axis settings
  chart.xAxis.tickFormat(d3.format('.02f'));
  chart.yAxis.tickFormat(d3.format('.02f'));

  var myData = data;
  d3.select("svg")
      .datum(myData)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});

}
function createMultiBarChart(data){
 nv.addGraph({
        generate: function() {
            var width = nv.utils.windowSize().width,
                height = nv.utils.windowSize().height;
            var chart = nv.models.multiBarChart()
                .width(width)
                .height(height)
                .stacked(false)
				.margin({top: 20, right: 20, bottom: 20, left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //enable tooltip and guideline
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
				.color(data_info[colors_LOC])
				.forceY([0,data_info[maxY_LOC]]) //set Y axis range
                ;
            chart.dispatch.on('renderEnd', function(){
                console.log('Render Complete');
            });
            var svg = d3.select('svg').datum(data);
            console.log('calling chart');
            svg.transition().duration(0).call(chart);
            return chart;
        },
        callback: function(graph) {
            nv.utils.windowResize(function() {
                var width = nv.utils.windowSize().width;
                var height = nv.utils.windowSize().height;
                graph.width(width).height(height);
                d3.select('#test1 svg')
                    .attr('width', width)
                    .attr('height', height)
                    .transition().duration(0)
                    .call(graph);
            });
        }
    });
}

/**
* Receives data 
* Returns [minX, maxX, minY, maxY , groupcolor[] ]
*/
function getMaxs(data){
	var groupcolor = [];
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
		groupcolor[i] = data[i].color;
  }
	console.log("X: " + minX + "-" + maxX);
	console.log("X: " + minY + "-" + maxY);
	return [minX, maxX, minY, maxY , groupcolor];
}

/**
* helpers
*/
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
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