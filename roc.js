/// Code to create an Interactive ROC curve from binormal specification 
/// Copyright 2018 Alex Sutton,
/// Version 1.0


//// CONSTANTS

// Cpnvention: Variables with a 1 in them relate to healthy population (distribution on left), and 2 relates to diseased distribution

// width and height for svg object

var margin = {top:20, right:10, bottom: 20, left: 25};

var width = 800- margin.left - margin.right;
var height = 550 - margin.top - margin. bottom;

/// setting up svg object 

var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
 

// Max and min parameters of the two normal distributions

var mu1min = 15;
var mu1max = 25;
var mu2min =15;
var mu2max = 25 ;

var sigma1min = 1;
var sigma1max = 6;
var sigma2min = 1;
var sigma2max = 6;
    
// The speed the standard deviation of the distriutions change when mouse dragged vertically 
var sigmaspeed = 100;

// A variable that defines how much of the tails of the normal distribution is plotted
var normextent = 4;

var thresholdmin = 10.5;
var thresholdmax = 30;

//// VARIABLES

// Values for calculating pdf of normal distribution  for healthy and diseased
var sigma1 = 2;
var mu1 = 17;
var sigma2 = 2;
var mu2 = 20;

var N = 15;
var step = 0.1;
var x;

var dataset1 = [];
var dataset2 = [];

var area1 = [];
var area2 = [];

var threshold = 18;

//Generate data from correct normal pdf function
norm(mu1, sigma1, dataset1);

norm(mu2, sigma2, dataset2);

// The scale I want on the axis etc
var xscale =  d3.scaleLinear().range([0, width]).domain([0, 40]).clamp(true);


// Below fixing the y axes so it does not change dimensions as the data changes
var yscale = d3.scaleLinear().domain([0, 0.8]).range([height,0]);

// makearea(dataset1, mu1, sigma1, area1)
// function to take claculated pdf values and turn into an svg path for plotting
//function makearea(dataset, mu, sigma, areat) {
    // Cant get anthing to work here???


// For calculating where on the scale to start plotting the calculated distribution

var constant1 = mu1-(normextent* sigma1)
var constant2 = mu2-(normextent* sigma2)

var area1 = d3.area(dataset1)
    .x(function(d,i) { var xx = constant1 + (i*step); return xscale(xx); })
    .y0(height)
    .y1(function(d,i) { return yscale(d); });


var area2 = d3.area(dataset2)
    .x(function(d,i) { var xx = constant2 + (i*step); return xscale(xx); })
    .y0(height)
    .y1(function(d,i) { return yscale(d); });



// Displaying information about the 2 distributions next to the plot
svg.append("text")
 .text("Healthy" )
      .attr("x", 25)
       .attr("y", 400)
  .attr("fill", "Black")
.attr("class", "sigma1d")

var info1 = svg.append("text")
 .text("Mean: " + round(mu1, 1) )
      .attr("x", 25)
       .attr("y", 425)
  .attr("fill", "Black")
.attr("class", "sigma1d")
.attr("id", "info1");

var info3 = svg.append("text")
 .text("Standard deviation: " + round(sigma1, 1))
      .attr("x", 25)
       .attr("y", 450)
  .attr("fill", "Black")
.attr("class", "sigma1d")
.attr("id", "info3");


svg.append("text")
 .text("Diseased" )
      .attr("x", 600)
       .attr("y", 400)
  .attr("fill", "Black")
.attr("class", "sigma1d")

var info2 = svg.append("text")
 .text("Mean: " + round(mu2, 1))
      .attr("x", 600)
       .attr("y", 425)
  .attr("fill", "Black")
.attr("class", "sigma1d")
 .attr("id", "info2");


var info4 = svg.append("text")
 .text("Standard deviation: " + round(sigma2, 1))
      .attr("x", 600)
       .attr("y", 450)
  .attr("fill", "Black")
.attr("class", "sigma1d")
 .attr("id", "info4");

// Adding coloured rectangles over the distribution information
var rectangle1 = svg.append("rect")
.attr("x", 20)
 .attr("y", 380)
.attr("width", 175)
.attr("height", 80)
.attr("fill", "LimeGreen")
.attr("opacity",0.5)
.attr("id", "inforect1");

var rectangle2 = svg.append("rect")
.attr("x", 595)
 .attr("y", 380)
.attr("width", 175)
.attr("height", 80)
.attr("fill", "FireBrick")
.attr("opacity",0.5)
.attr("id", "inforect2");

// so g1 is a path that represents the normal distribution shape and the data to plot it comes from dataset   
g1 = svg.append("path")
      .datum(dataset1)
      .attr("class", "area1")
      .attr("d", area1)
      .attr("opacity",0.75)
       .attr("id", "path1")
.on('mouseover', function(d, i) {
       d3.select(this)
    .attr("class", "aream1");
        d3.select("#inforect1")
    .attr("class", "aream1");
    })

.call(d3.drag().on("drag", dragged1))
  .on('mouseout', function(d, i) {
     d3.select(this)
 .classed("aream1", false)
.attr("class", "area1");
     d3.select("#inforect1")
    .classed("aream1", false)
    .attr("class", "area1");
    })

// g2 is a path that represents the normal distribution shape and the data to plot it comes from dataset   
g2 = svg.append("path")
      .datum(dataset2)
      .attr("class", "area2")
      .attr("d", area2)
      .attr("opacity",0.75)
    .attr("id", "path2")
.on('mouseover', function(d, i) {
       d3.select(this)
    .attr("class", "aream2");
      d3.select("#inforect2")
    .attr("class", "aream2");
    })
.call(d3.drag().on("drag", dragged2))
  .on('mouseout', function(d, i) {
     d3.select(this)
 .classed("aream2", false)
.attr("class", "area2");
    d3.select("#inforect2")
    .classed("aream2", false)
    .attr("class", "area2");
    })

var thresholdLoc = xscale(threshold);

var linewidth = 5;
var thresholdLine = svg.append("line")
                .attr("class", "area3")
                .attr("x1", thresholdLoc)
                .attr("y1",height)
                .attr("x2", thresholdLoc)
                .attr("y2",(height/2))
                .attr("id", "tline")
               // .attr("stroke-width",linewidth)
                .datum({x:thresholdLoc,y:thresholdLoc})
                .on('mouseover', function(d, i) {
                    d3.select(this)
                .attr("class", "aream3");
                        })
                .on('mouseout', function(d, i) {
                    d3.select(this)
                .classed("aream3", false)
                .attr("class", "area3");
                        })
                .call(d3.drag().on("drag", dragthresh))


var thresholdText = svg.append("text")
 //   .attr("transform","rotate(-90)")
  //  .attr("y", thresholdLoc-10)
.attr("y", height/2-10)
 .attr("x", thresholdLoc-50)
//.attr("x", xscale(thresholdLoc))
    .text("Threshold: " + round(threshold, 1))
.attr("id", "thtext")
 .attr("class", "sigma1d");


// Function to move the threshold line
function dragthresh(d) {
    
// Not quite sure what the below line does, checks to see if in some sort of range
    
  threshold = Math.min(xscale.invert(width-linewidth/2),Math.max(xscale.invert(linewidth/2),xscale.invert(d3.event.x)));
  
    thresholdLoc = xscale(threshold);
    
 if (((threshold + xscale.invert(d3.event.dx) <= thresholdmax) && (threshold + xscale.invert(d3.event.dx) >= thresholdmin))) {
   
     thresholdnew();
     sensspecnew();
     
    d3.select("#tline")
      .attr("x1", d.x = thresholdLoc)
    .attr("x2", d.y = thresholdLoc);
    
//  d3.select("#path1")
 //  .classed("aream3", false)
//   .attr("class", "area3");
//  setRocCircleLocation();
     
    d3.select("#thtext")
      .attr("x", thresholdLoc-50)
      .attr("class", "sigma1d")
     .text("Threshold:  " + round(threshold,1));
   }    
  
}


// Function for moving the normal distribution for the healthy
function dragged1() {
   
    // So changing sd of distribution as a function of y movement in drag
    // resetting dataset to be empty before adding the new values
     dataset1 = [];
    
     if ((sigma1+(d3.event.dy/sigmaspeed) <= sigma1max) && (sigma1 +(d3.event.dy/sigmaspeed)>= sigma1min)) {
    sigma1 += (d3.event.dy)/sigmaspeed;
    }
    
    // The 16 below is the ratio of the domain to range translation - i.e. domain 50 / range 800 = 1/16
    
    if ((mu1+(d3.event.dx/16) <= mu1max) && (mu1 +(d3.event.dx/16)>= mu1min)) {
    mu1 += d3.event.dx/16;
    }
    
     C = 1/(sigma1*Math.sqrt(2*Math.PI));
      for (x=mu1-(normextent*sigma1); x < mu1+(normextent*sigma1); x += step) {
            E = (x-mu1)/sigma1;
            E = -(E*E)/2;
            d = C*Math.exp(E);
                dataset1.push(d);
        }
    
    
    // The below 4 function calls get new points for ROC, plot them and then add updated current threhsold point
    rocPoints();
    updateROC();
    thresholdnew();
    sensspecnew();
    
     startd = mu1-(normextent* sigma1)

    area1 = d3.area()
    .x(function(d,i) { var xx = startd + (i*step); return xscale(xx); })
    .y0(height)
    .y1(function(d,i) { return yscale(d); });
                  
    svg.select("#path1")
      .datum(dataset1)
      .attr("class", "aream1")
     .attr("d", area1);
    
     d3.select("#info1")
       .text("Mean: " + round(mu1, 1));
    
      d3.select("#info3")
       .text("Standard deviation: " + round(sigma1, 1));
 
           // Below does not fix issue either. But it does turn the colour off on mouse click down which is an improvement . . 
    d3.select("#path1")  
   .classed("aream1", false)
   .attr("class", "area1");
    
    d3.select("#inforect1")  
   .classed("aream1", false)
   .attr("class", "area1");
    
}

// Function for moving the normal distribution for the diseased
function dragged2() {
   
    // So changing sd of distribution as a function of y movement in drag
    // resetting dataset to be empty before adding the new values
     dataset2 = [];

     if ((sigma2+(d3.event.dy/sigmaspeed) <= sigma1max) && (sigma2 +(d3.event.dy/sigmaspeed)>= sigma1min)) {
    sigma2 += (d3.event.dy)/sigmaspeed;
    }
    
    // The 16 below is the ratio of the domain to range translation - i.e. domain 50 / range 800 = 1/16
    
    if ((mu2+(d3.event.dx/16) <= mu1max) && (mu2 +(d3.event.dx/16)>= mu1min)) {
    mu2 += d3.event.dx/16;
    }
    
     C = 1/(sigma2*Math.sqrt(2*Math.PI));
      for (x=mu2-(normextent*sigma2); x < mu2+(normextent*sigma2); x += step) {
            E = (x-mu2)/sigma2;
            E = -(E*E)/2;
            d = C*Math.exp(E);
                dataset2.push(d);
        }
    
    rocPoints();
    updateROC();
    thresholdnew();
    sensspecnew();
    
     startd = mu2-(normextent* sigma2)
    
    area2 = d3.area()
    .x(function(d,i) { var xx = startd + (i*step); return xscale(xx); })
    .y0(height)
    .y1(function(d,i) { return yscale(d); });
                  
    svg.select("#path2")
      .datum(dataset2)
      .attr("class", "aream2")
     .attr("d", area2);
    
    d3.select("#info2")
       .text("Mean: " + round(mu2, 1) );
    
     d3.select("#info4")
       .text("Standard deviation: " + round(sigma2, 1));
    
      d3.select("#path2")  
   .classed("aream2", false)
   .attr("class", "area2");
    
       d3.select("#inforect2")  
   .classed("aream2", false)
   .attr("class", "area2");
}


// Defining x-axis to plot
    var xAxis = d3.axisBottom()
                .scale(xscale)

    
// Moving axes out of the plot margins a la Bostock method
svg.append("g")
    .attr("class", "axis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis);


// Function to correctly round numbers to a certain number of decimal places
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


// Function to generate dataset required to plot normal distribution
function norm(mu, sigma, dataset){
   var C = 1/(sigma*Math.sqrt(2*Math.PI));
for (x=mu-(normextent*sigma); x < mu+(normextent*sigma); x += step) {
    var E = (x-mu)/sigma;
    E = -(E*E)/2;
    var d = C*Math.exp(E);
    dataset.push(d);
}
    return(dataset)
}



// Plotting the ROC curve

// Start by creating frame square
boxWidth = (height/2)*0.75;
boxHeight = boxWidth;
boxOffset = 20;

axes = svg.append("rect")
        .attr("x", boxOffset)
        .attr("y",0)
        .attr("width",boxWidth)
        .attr("height",boxHeight)
        .attr("stroke","Lightgrey")
        .attr("stroke-width",2)
        .attr("fill","none");

// Add diagonal line of no accuracy
svg.append("line")
           .attr("x1", boxOffset)
           .attr("y1",boxHeight)
           .attr("x2",boxWidth + boxOffset)
           .attr("y2",0)
            .attr("stroke","Grey")
            .style("stroke-dasharray", ("3, 3"))
           .attr("stroke-width",1);

// N.B. Same scale can be used for x and y axes
var rocScale = d3.scaleLinear().range([0, boxWidth]).domain([0, 1]);

// Below scale is just used for axis labelling not cacluations
var rocScaley = d3.scaleLinear().range([0, boxWidth]).domain([1, 0]);

// Defining x-axis to plot
    var xAxisROC = d3.axisBottom()
                .scale(rocScale);

// Moving axes out of the plot margins a la Bostock method
svg.append("g")
   .attr("class", "axisR")
  .attr("transform", "translate(" + boxOffset + "," +  boxHeight + ")")
  .call(xAxisROC);

// Text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (boxWidth/2 +boxOffset)+ "," + 
                           (boxHeight)*1.2 + ")")
      .style("text-anchor", "middle")
      .text("False Positive Rate")
    .attr("fill", "Grey")
    .attr("class", "sigma1d");


// Defining y-axis to plot
var yAxisROC = d3.axisLeft()
                .scale(rocScaley);

// Moving axes out of the plot margins a la Bostock method
svg.append("g")
   .attr("class", "axisR")
 .attr("transform", "translate(" + boxOffset + "," +  0 + ")")
 // .attr("transform", "translate(-10,0)")
  .call(yAxisROC);

  // Text label for the y axis
 svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -12)
      .attr("x", - boxHeight/2)
     // .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("True Positive Rate")
    .attr("fill", "Grey")
    .attr("class", "sigma1d");

// Calculate roc curve

var roccurve = []; 

// Invokes below function which calculates points of ROC curve for plotting
rocPoints();


// Called to recalculate ROC points after one of the normal distributions has been modified
function rocPoints () {
            roccurve = []; 
    
// Note 0 and 40 are hardwired fixed extremes for the space ROC is calculated accross (could make a function of current parmeter values)
            for (var ii = 0; ii < 40; ii+=0.25) {
        
//Returns the value of x in the cdf of the Normal distribution with parameters mean and std (standard deviation).   
                    fpr = 1- jStat.normal.cdf(ii, mu1, sigma1);
                    tpr= jStat.normal.cdf(ii, mu2, sigma2);
                    roccurve.push([fpr, tpr]);
                                    }
    
}


 var roc_path = d3.line()
    .x(function(d) { return (rocScale(d[0])+ boxOffset); })
    .y(function(d) { return rocScale(d[1]); });

var svg_roccurve = svg.append("path")
                    .attr("id", "pathr")
                     .datum(roccurve)
                     .attr("class","line")
                    .attr("stroke","black")
                    .attr("fill","None")
                   .attr("d", roc_path);



// Redraws the ROC - called after underlying plotting points have been updated
function updateROC () {  
    svg.select("#pathr")
       .datum(roccurve)
      .attr("d", roc_path);
       }


//Calculating location of current threhsold on the ROC plot
    fprThreshold = 1- jStat.normal.cdf(threshold, mu1, sigma1);
    tprThreshold = jStat.normal.cdf(threshold, mu2, sigma2);


//Adding location of the threshold to the ROC plot
var rocCircle = svg.append("circle")
                    .attr("id", "threshcirc")
                    .attr("r",5)
                   .attr("cx",(rocScale(fprThreshold)+ boxOffset))
                    .attr("cy",rocScale(tprThreshold))
                    .attr("fill","red")
                    .attr("stroke-width",1);

// Calculating new location on ROC for threshold point
function thresholdnew(){
    
     fprThreshold = 1- jStat.normal.cdf(threshold, mu1, sigma1);
    tprThreshold = jStat.normal.cdf(threshold, mu2, sigma2);
  
     svg.select("#threshcirc")
       .attr("cx",(rocScale(fprThreshold)+ boxOffset))
     .attr("cy",rocScale(tprThreshold));
       }


// Printing current sensitivity and specificity to the screen 
var info5 = svg.append("text")
 .text("Sensitivity: " + round(((1-tprThreshold)*100), 0) + "%")
      .attr("x", 220)
       .attr("y", 20)
  .attr("fill", "Black")
.attr("class", "sigma1d")
 .attr("id", "info5");

var info6 = svg.append("text")
 .text("Specificity: " + round(((1-fprThreshold)*100), 0) + "%")
      .attr("x", 220)
       .attr("y", 50)
  .attr("fill", "Black")
.attr("class", "sigma1d")
 .attr("id", "info6");


// Calculates location of point on ROC curve for given threshold
function sensspecnew(){    
    d3.select("#info5")
     .text("Sensitivity: " + round(((1-tprThreshold)*100), 0) + "%");
    
    d3.select("#info6")
     .text("Specificity: " + round(((1-fprThreshold)*100), 0) + "%");
       }

