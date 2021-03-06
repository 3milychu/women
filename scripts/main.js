/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 This source code is covered under the following license: http://vizuly.io/commercial-license/

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @version 1.1.25


/*

 This is the primary code file that orchestrates the various components of the mobile app.

 The mobile app is composed of the following display elements

    Header:  Top of Device Display

        -  Back Button
        -  Title Label
        -  Selected Date Label
        -  Info button
        -  Scroller
             -- Minimum Date Range Label
             -- Maximum Date Range Label

    Chart List
        -  List Item (4)
            --  Chart Symbol Label/Toggle
            --  Chart Pop Menu
            --  Mobile Chart

  Main app routines:


    1. window.onload()  (MobileApp.html)
        - loads data

    2. initialize()
        - sets up variables and application state
        - gets measurements for all relative display elements

    3. measure()
        - calculates layout for all display elements mobile and desktop

    4. update()
        - updates header elements
        - updates scroller
        - updates charts
        - updates labels

    5. chartMenu_onClick()
        - When a user chooses a new pop-up menu item this routine
          changes the data field being displayed within that individual chart.

    6. chartPointer_onDrag()
        - When a user drags one of the data labels in a given chart this routine
          updates the labels and index lines in the corresponding charts.

    7. expandChart(i)
        - When a user clicks on the chart title (GOOGL, AAPL, etc..) this routine
          animates the chart to fill the whole list area and minimizes the other charts.

    8. onZoom()
        - When a user pinches/zooms and/or scroll wheels anywhere in the chart list area
          this issues the zoom event to each chart.

    Other source code files

    linearea_mobile.js - vizuly linearea mobile chart
    linearea_mobile_theme.js - vizuly linearea mobile theme
    measure.js - used to take display layout measurements to mimic phone device and center on screen
    pop_menu.js - vizuly UI pop menu
    scroller.js - vizuly UI display scroller


 */

// Menu

// Menu

document.addEventListener('DOMContentLoaded', function(){
    // alert("Ready");

    var sideNav = document.getElementById("mySidenav");
    sideNav.innerHTML += "<a href='index.html'>- Interactive -</a>";
    sideNav.innerHTML += "<a href='editorial.html'>Editorial</a>";
    sideNav.innerHTML += "<a href='conclusions.html'>Conclusions</a>";
    sideNav.innerHTML += "<a href='analysis/gender_stats.nb.html' target='_blank'>Regression Model in R</a>";
    sideNav.innerHTML += "<a href='about.html'>About the Data</a>";
    
});

// open and close nav

function openNav (){
        //transition the width of our Sidenav div
        document.getElementById("mySidenav").style.height ="100%";
    };

function closeNav (){
        //transition the width of our Sidenav div when closed
        document.getElementById("mySidenav").style.height="0%";
    };


// open and close chapters

function openSumStats() {
    document.getElementById("sumstats").style.height="100%";
};

function closeSumStats() {
    document.getElementById("sumstats").style.height="0";
    document.getElementById("sumstats").style.overflow="hidden";
};

function openCorrmatrix() {
    document.getElementById("corrmatrix").style.height="100%";
};

function closeCorrmatrix() {
    document.getElementById("corrmatrix").style.height="0";
    document.getElementById("corrmatrix").style.overflow="hidden";
};

function openRegression() {
    document.getElementById("regression").style.height="100%";
};

function closeRegression() {
    document.getElementById("regression").style.height="0";
    document.getElementById("regression").style.overflow="hidden";
};

// Modal1

// Get the modal
var modal1 = document.getElementById('modal1');

// Get the button that opens the modal
var btn = document.getElementById("overlay1");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close1")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
    modal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
}

// Modal1

// Get the modal
var modal2= document.getElementById('modal2');

// Get the button that opens the modal
var btn = document.getElementById("overlay2");

// Get the <span> element that closes the modal
var span2 = document.getElementsByClassName("close2")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
    modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

/****  GLOBAL VARIABLES ****/
// Collections
var chartItems=[];   // D3 selections for each chart container
var symbols=[];      // The unqiue stock symbols from our data

// Colors used for chart backgrounds
var chartColors=["#F48FB1","#FFAF49","#7986CB","#2DA4A9","#E57373"];
var labelColors=["#ED7D31","#ED7D31","#ED7D31","#ED7D31","#ED7D31"];

// Data Fields
var dataFields = ["w_mgr","m_mgr","diff"];
var menuItems = [{label: "Female Managers (%)", value: "w_mgr"},{label: "Male Managers (%)", value: "m_mgr"},{label: "Education Diff (%)", value: "diff"}];
var skins = ["Default"];

// Formatters used to make labels pretty
var labelFormat = d3.time.format("%b 20%y"), titleDateFormat = d3.time.format("%b %_d 20%y");
var currFormat = function (d) { return d3.format("*100%")(d);};
var volumeFormat = function (d) { return d3.format("*100%")(d);};

// Measurements for various display elements.
var chartHeight, chartWidth;
var titleFontHeight, subTitleFontHeight;
var chartHeightRatio;


// Device display elements and measurements.
var device, deviceWidth,dHeight,dTop,dLeft,deviceDisplayStyle;

// Header display elements and measurements
var header, headerWidth,headerHeight,headerTop,headerLeft,infoButton;

// Scroll (div container)
var scroll, scrollWidth,  scrollLeft, scrollFontHeight, scrollRatio;

// Scroller (vizuly ui element)
var scroller, scrollerWidth, scrollerHeight;

// Charts
var charts=[], chartLabels=[], chartMores=[], chartList, listWidth, listHeight, listLeft, listTop;

// Event Holders
var touchClickEvent;

// Menus
var menus=[], menuWidth, menuHeight;

// States
var mobile=false;

// Called once after data has been loaded
// Does initial set up of all display elements.
function initialize() {

    // Our primary DOM elements
    device = d3.select("#devicePhone");
    header = d3.select("#header");
    scroll = d3.select("#scrollDiv");
    chartList = d3.select("#chartsDiv");
    infoButton = d3.select("#infoButton");

    // The chartList holds all 4 charts top to bottom
    chartList.call(zoom);

    // Call our measurement routine.
    measure();

    // If we are on a mobile device disable the background android phone image.
    if (mobile==true | mobile==false) {
        device.style("background-image",null)
            .style("top",0)
            .style("left",0);
    }


    // These are the main containers we use for each of the four charts.
    // We have one for each symbol
    chartItems = chartList.selectAll(".mobile-list-item")
        .data(symbols)
        .enter()
        .append("div")
        .attr("class","mobile-list-item");

    // We loop through the 4 charts and set up the chart itself, corresponding symbol label, and pop up menu.
    chartItems[0].forEach(function (item,i) {

        var chart=vizuly.viz.linearea_mobile(item)
            .data([symbols[i].values])
            .width(chartWidth)
            .duration(700)
            .margin({top: chartHeight * (1 - chartHeightRatio), left:0, bottom:0, right:0})
            .height(chartHeight)
            .x(function (d) { return d.diff;})
            .y(function (d) { return Number(d[dataFields[i]]); })
            .dataLabel(function (d) {
                return (dataFields[i] == "diff") ? volumeFormat(this.y(d)) : currFormat(this.y(d));
            })
            .on("validate",function () {
                this.component.yScale(d3.scale.pow());
            })
            .on("measure",function () {
                if (dataFields[i] == "diff") {
                    this.component.yScale().exponent(.5);
                    this.component.yAxis().tickFormat(volumeFormat);
                }
                else {
                    this.component.yScale().exponent(2);
                    this.component.yAxis().tickFormat(currFormat);
                }
            })
            .on("pointerdrag.mobileapp",chartPointer_onDrag)
            .update()
            .index(Math.round(symbols[i].values.length/2));


        // We want to remove the internal chart zoom and use our own so on mobile the user can touch anywhere in the chart list to zoom.
        chart.selection().select(".vz-plot").on(".zoom",null);

        // This is our symbol label.
        var label = d3.select(item)
            .append("div")
            .attr("class","mobile-item-button")
            .on(touchClickEvent,function () { expandChart(i); });

        // This is where we attach our pop menu.
        var menuDiv = d3.select(item)
            .append("div")
            .attr("class","chart-menu")
            .style("position","absolute")
            .style("cursor","pointer");


        // Our pop menu that is used to change data fields
        var menu=vizuly.ui.pop_menu(menuDiv[0][0])
            .on("click",function (d) { chartMenu_onClick(d,i); })
            .data(menuItems);

        // Add our chart elements to their appropriate arrays
        menus.push(menu);
        chartLabels.push(label);
        charts.push(chart);

        // Each chart gets its own theme to manage the skin of the chart.
        var theme = vizuly.theme.linearea_mobile(chart).skin(skins[0]);

    });

    // We create a display scroller (seen at top of the device) and attach it to our zoom behavior.
    scroller = vizuly.ui.scroller(document.getElementById("scrollDiv"));
    scroller.zoom(zoom);

}

// Main update routine
function update() {

    zoom.size([listWidth,listHeight]);
    updateHeader();
    // updateScroller();
    updateLabels();
    updateCharts();


}

// Updates header elements
function updateHeader() {

    // Update the device.
    device.style("width",deviceWidth + "px")
        .style("height",dHeight + "px")
        .style("left",dLeft + "px")
        .style("top",dTop + "px")
        .style("display",deviceDisplayStyle);

    // Update the header
    header.style("width",headerWidth + "px")
        .style("height",headerHeight + "px")
        .style("left",headerLeft + "px")
        .style("top",headerTop + "px");

    // Update the title, date, and scroller labels
    d3.select("#leftScrollLabel").style("font-size", (scrollFontHeight) + "px");
    d3.select("#rightScrollLabel").style("font-size",(scrollFontHeight) + "px");
    d3.select("#date").style("font-size",(subTitleFontHeight) + "px");
    d3.select("#title").style("font-size",(titleFontHeight) + "px");

}

// Update Scroller
function updateScroller() {
    scroll.style("width",scrollWidth + "px")
        .style("left",scrollLeft + "px");

    scroller.width(scrollerWidth)
        .height(scrollerHeight)
        .update();
}

// Update label values
function updateLabels() {
    //  console.log("updateLabels");
    var indexBounds = charts[0].getIndexBounds();
    var leftDate = symbols[0].values[indexBounds[0]].diff;
    var rightDate = symbols[0].values[indexBounds[1]].diff;
    var titleDate = symbols[0].values[charts[0].index()].diff;

    d3.select("#leftScrollLabel").text(leftDate);
    d3.select("#rightScrollLabel").text(rightDate);
    d3.select("#date").text(titleDate + " pts");
}

// Update all charts
function updateCharts() {

    chartList.style("width",listWidth + "px")
        .style("height",listHeight + "px")
        .style("left",listLeft + "px")
        .style("top",listTop + "px");
    
    chartItems.style("height",chartHeight + "px")
        .style("width",chartWidth + "px")
        .style("top",function(d,i) { return (i * chartHeight) + "px"})
        .style("background-color",function (d,i) { return chartColors[i];});

    chartItems.selectAll(".chart-menu")
        .style("right",(menuWidth*1.1) + "px")
        .style("top",(chartHeight *.05) + "px");

    for (var i=0; i < charts.length; i ++) {
        charts[i]
            .width(chartWidth)
            .margin({top: chartHeight * (1 - chartHeightRatio), left:0, bottom:0, right:0})
            .height(chartHeight)
            .update();

        chartLabels[i]
            .style("font-weight",500)
            .style("border-radius",(chartHeight * 0.02) + "px")
            .style("margin-top",(chartHeight * 0.045) + "px")
            .style("left",(chartWidth * 0.024) + "px")
            .style("font-size",2 + "em")
            .style("color",labelColors[i])
            .style("opacity",1)
            .style("cursor","pointer")
            .html("<span>" + symbols[i].key + ": </span><span style='color:#000000; opacity: 1; font-weight:300'>" + String(dataFields[i]) + "</span>");

        menus[i].width(menuWidth)
            .height(menuHeight)
            .update();

    }
}

// Fired when user has selected an item from a chart pop menu.
function chartMenu_onClick(d,i) {
    dataFields[i] = d.value;
    chartLabels[i].html("<span>" + symbols[i].key + ": </span><span style='color:#000000; opacity: 1; font-weight:300'>" + d.label + "</span>");
    var zoom = charts[i].zoom();
    charts[i].update();
    if (expandedIndex == i) {
        charts[i].selection().selectAll(".vz-left-axis")
            .transition().duration(700)
            .style("opacity",1);
    }
}

// Fired when a user has dragged one of the chart index labels (data tip)
function chartPointer_onDrag() {
    var dragChart = this.component;
    charts.forEach(function (chart) {
        if (chart != dragChart) {
            chart.index(dragChart.index())
        }
    });
    updateLabels();
}

// This routine is used to expand/collapse a chart when a user clicks on the corresponding symbol label
var expandedIndex=null;
function expandChart(i) {

    var index = i;
    if (expandedIndex == null) {   //Nothing currently expanded
        //Move non selected indexes out of way
        for (var i=0; i < charts.length; i++) {
            if (i != index) {
                d3.select(chartItems[0][i]).transition().duration(700)
                    .style("top",function () {
                        //If we are above the chart move to the top, otherwise move below
                        if (i < index)
                            return -chartHeight + "px";
                        else
                            return listHeight + "px";
                    });
            }
        }

        d3.select(chartItems[0][index]).transition().duration(700)
            .style("top","0px")
            .style("height",(chartHeight*symbols.length) + "px");

        charts[index].duration(700).height(chartHeight*symbols.length)
            .update();

        charts[index].selection().selectAll(".vz-left-axis")
            .transition().duration(700)
            .style("opacity",1);

        chartLabels[index].transition()
            .style("left",function () { return (chartWidth - this.getBoundingClientRect().width)/2 + "px" });

        expandedIndex=index;
    }
    else {
        chartItems.transition().duration(700)
            .style("height",chartHeight + "px")
            .style("top",function(d,i) { return (i * chartHeight) + "px"});

        charts[index].duration(700).height(chartHeight)
            .update();

        chartLabels[index].transition()
            .style("left",(chartWidth * 0.025) + "px");

        expandedIndex=null;
    }
}

// This zoom behavior provides a common zoom surface that cooridinates the zoom functionality
// across all charts.
var zoom = d3.behavior.zoom().scaleExtent([1,10]).on("zoom",onZoom);

function onZoom () {
    // See if we have zoomed out of bounds, if so constrain the panning
    var t = zoom.translate(),
        tx = t[0],
        ty = t[1];

    tx = Math.min(tx, 0);
    tx = Math.max(tx, chartWidth - chartWidth * zoom.scale());

    zoom.translate([tx, ty]);

    charts.forEach(function (chart) {
        chart.zoom(chart.zoom().scale(zoom.scale()).translate([zoom.translate()[0], zoom.translate()[1]]));
    });

    // updateLabels();
};

