// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Set the radius for each dot that will appear in the graph.
// Note: Making this a function allows us to easily call
// it in the mobility section of our code.
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// The Labels for our Axes

// A) Bottom Axis
// ==============

// We create a group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

// We give xText a transform property that places it at the bottom of the chart.
// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// Now we use xText to append three text SVG files, with y coordinates specified to space out the values.
// 1. State
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "state")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("State");
// 2. Income
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "Income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Income (Median)");
// 3. Poverty
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Poverty (Median)");

// B) Left Axis
// ============

// Specifying the variables like this allows us to make our transform attributes more readable.
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// We add a second label group, this time for the axis left of the chart.
svg.append("g").attr("class", "yText");

// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");

// Like before, we nest the group's transform attr in a function
// to make changing it on window change an easy operation.
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Now we append the text.
// 1. Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// 2. Health Care High
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "healthcareHigh")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Health Care Highs (%)");

// 3. Health Care Low
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcareLow")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Health Care Low (%)");

// 2. Import our .csv file.
// ========================
// This data file includes state-by-state demographic data from the US Census
// and measurements from health risks obtained
// by the Behavioral Risk Factor Surveillance System.

// Import our CSV data with d3's .csv import method.
d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  visualize(data);
});

// 3. Create our visualization function
// ====================================
// We called a "visualize" function on the data obtained with d3's .csv method.
// This function handles the visual manipulation of all elements dependent on the data.
function visualize(theData) {
  // PART 1: Essential Local Variables and Functions
  // =================================
  // curX and curY will determine what data gets represented in each axis.
  // We designate our defaults here, which carry the same names
  // as the headings in their matching .csv data file.
  var curX = "state";
  var curY = "obesity";

  // We also save empty variables for our the min and max values of x and y.
  // this will allow us to alter the values in functions and remove repetitious code.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // This function allows us to set up tooltip rules (see d3-tip.js).
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // x key
      var theX;
      // Grab the state name.
      var theState = "<div>" + d.state + "</div>";
      // Snatch the y value's key and value.
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      // If the x key is poverty
      if (curX === "poverty") {
        // Grab the x key and a version of the value formatted to show percentage
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        // Otherwise
        // Grab the x key and a version of the value formatted to include commas after every third digit.
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // Display what we capture.
      return theState + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);
