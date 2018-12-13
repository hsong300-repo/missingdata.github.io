var var yearData;
var salesData;
var chart;
var data;

//Define height, width and margins of your chart
var margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function Plot(index) {

    //Get the data from Ajax request
    d3.json("/Home/SalesData", function (error, d) {
        data = d;
        var controlHTML;
        controlHTML = '<div class="SearchToolDiv"  id ="SearchOptionDiv" style="float: right;"><span class="SearchToolSpan" id="searchTool"><table class="formtable" style="table-layout: fixed;"><tbody><tr><td>';
        for (var i = 0; i < data.length; i++) {
            controlHTML = controlHTML + '<input type="checkbox" onclick="BuildBars(' + i + ',this)"';
            if (i == index) {
                controlHTML = controlHTML + ' checked ';
            }
            controlHTML = controlHTML + '><span style="display:inline !important; color:black">' + data[i].CountryName + ' </span>';
        }
        controlHTML = controlHTML + '</td></tr></tbody></table></span></div>'
        $(controlHTML).appendTo($("#chart"));

        //Initiate your chart element
        chart = d3.select("#chart")
            .append("svg")  //append svg element inside #chart
            .attr("width", width + (2 * margin.left) + margin.right)    //set width
            .attr("height", height + margin.top + margin.bottom);  //set height

        BuildBars(index,null);

    });

}

function GetYearsForCountries(countryData) {
    var result = [];

    for (var i in countryData)
        result.push(countryData[i].Year);

    return result;
}

function GetSalesForCountries(countryData) {
    var result = [];
    var max = 0.0;
    result.push(max);
    for (var i in countryData) {
        if (max < countryData[i].SaleRevenue) {
            max = countryData[i].SaleRevenue
        }
    }
    result.push(max + 50);

    return result;
}

yearData = GetYearsForCountries(data[index].Sales)
salesData = GetSalesForCountries(data[index].Sales)

var x = d3.scale.ordinal().domain(yearData).rangeRoundBands([0, width], .5);
var y = d3.scale.linear().domain(salesData).range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom").ticks(yearData.length);  //orient bottom for x-axis tick labels
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left").ticks(10); //orient left for y-axis tick labels


var bar = chart.selectAll("g")
    .data(data[index].Sales)
    .enter()
    .append("g")
    .attr("transform", function (d) {
        return "translate(" + x(d.Year) + ", 0)";
    });

bar.append("rect")
    .attr("y", function (d) {
        return y(d.SaleRevenue);
    })
    .attr("x", function (d) {
        return (margin.left);
    })
    .attr("height", function (d) {
        return height - y(d.SaleRevenue);
    })
    .attr("width", x.rangeBand());  //set width base on range on ordinal data

bar.append("text")
    .attr("x", x.rangeBand() / 2 + margin.left + 10)
    .attr("y", function (d) { return y(d.SaleRevenue) - 10; })
    .attr("dy", ".75em")
    .text(function (d) { return d.SaleRevenue; });

chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Year");

chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Sales Data");
