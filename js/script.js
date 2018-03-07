var radioYearBarChart, radioYearBarChartID, radioYearDoughnutChart, radioYearDoughnutChartID, currentRadioChart;
var tvYearBarChart, tvYearBarChartID, tvYearDoughnutChart, tvYearDoughnutChartID, currentTvChart;
var tvRadioChannelLinesChart, tvRadioChannelBarsChart, tvRadioChannelChartBarsID, tvRadioChannelChartLinesID, tvRadioChannelChartLabels, currentTvRadioChannelChart;
var backgroundColor, borderColor, yLabel;

$(document).ready(function() {
    var dataToDisplay, radioDataList, tvDataList;

    tvRadioChannelChartLabels = [];

    // Set default id for charts and the current chart for each section (TV, Radio, Comparaison)
    radioYearBarChartID = "radioYearBarChart";
    radioYearDoughnutChartID = "radioYearDoughnutChart";
    currentRadioChart = radioYearBarChartID;

    tvYearBarChartID = "tvYearBarChart";
    tvYearDoughnutChartID = "tvYearDoughnutChart";
    currentTvChart = tvYearBarChartID;

    tvRadioChannelChartLinesID = "tvRadioChannelLinesChart";
    tvRadioChannelChartBarsID = "tvRadioChannelBarsChart";
    currentTvRadioChannelChart = tvRadioChannelChartLinesID;

    // Set default values
    yLabel = 'Minutes par jour';
    backgroundColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(119, 255, 64, 0.2)',
        'rgba(255, 64, 64, 0.2)',
        'rgba(255, 64, 253, 0.2)'
    ];
    borderColor = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(119, 255, 64, 1)',
        'rgba(255, 64, 64, 1)',
        'rgba(255, 64, 253, 1)'
    ];

    // Initialize Vue elements
    radioDataList = new Vue({
        el: '#radio-years',
        data: {
            items: RADIO_DATA
        },
        methods: {
            // Use to change the radio year, apply changes to the right chart
            changeRadioYear: function(year) {
                switch (currentRadioChart) {
                    case radioYearBarChartID:
                        radioYearBarChart.destroy();
                        dataToDisplay = getYearDataAndLabel(RADIO_DATA, year);
                        createBarChart(radioYearBarChartID, 'Pour l\'année ' + year, dataToDisplay.labels, dataToDisplay.data);
                        break;

                    case radioYearDoughnutChartID:
                        radioYearDoughnutChart.destroy();
                        dataToDisplay = getYearDataAndLabel(RADIO_DATA, year);
                        createDoughnutChart(radioYearDoughnutChartID, dataToDisplay.labels, dataToDisplay.data);
                        break;
                    default:
                        break;
                }
            }
        },
        computed: {
            // Get the list of year sorted
            sortedYear: function() {
                return Object.keys(this.items[Object.keys(this.items)[0]]).sort();
            }
        }
    });

    tvDataList = new Vue({
        el: '#tv-years',
        data: {
            items: TV_DATA
        },
        methods: {
            // Use to change the tv year, apply changes to the right chart
            changeTVYear: function(year) {
                switch (currentTvChart) {
                    case tvYearBarChartID:
                        tvYearBarChart.destroy();
                        dataToDisplay = getYearDataAndLabel(TV_DATA, year);
                        createBarChart(tvYearBarChartID, 'Pour l\'année ' + year, dataToDisplay.labels, dataToDisplay.data);
                        break;
                    case tvYearDoughnutChartID:
                        tvYearDoughnutChart.destroy();
                        dataToDisplay = getYearDataAndLabel(TV_DATA, year);
                        createDoughnutChart(tvYearDoughnutChartID, dataToDisplay.labels, dataToDisplay.data);
                        break;
                    default:
                        break;
                }
            }
        },
        computed: {
            // Get the list of year sorted
            sortedYear: function() {
                return Object.keys(this.items[Object.keys(this.items)[0]]).sort();
            }
        }
    });

    tvChannelData = new Vue({
        el: '#tv-channels',
        data: {
            items: TV_DATA
        },
        methods: {
            // Use to add or remove a tv channel from comparaison chart
            changeTVChannel: function(channel, e) {
                var dataToDisplay, index;
                if (e.target.nodeName === "INPUT") {
                    // Check if the channel exists in the list
                    // Add it if not, otherwise remove it
                    index = tvRadioChannelChartLabels.indexOf(channel);
                    if (e.target.checked)
                        if (index === -1) tvRadioChannelChartLabels.push(channel);
                        else if (index != -1) tvRadioChannelChartLabels.splice(index, 1);

                    // Get the data and display the chart
                    dataToDisplay = getObjectDataAndLabel(tvRadioChannelChartLabels);
                    if (currentTvRadioChannelChart === tvRadioChannelChartLinesID) {
                        tvRadioChannelLinesChart.destroy();
                        createLineChart(tvRadioChannelChartLinesID, dataToDisplay.labels, dataToDisplay.datasets);
                    } else {
                        tvRadioChannelBarsChart.destroy();
                        createStackedBarChart(tvRadioChannelChartBarsID, dataToDisplay.labels, dataToDisplay.datasets);
                    }

                }
            },
            // Get half part of the sorted channel
            sortedChannels: function(firstHalf) {
                firstChannel = Object.keys(this.items)[0];
                currentChannels = Object.keys(this.items).sort();
                if (firstHalf) currentChannels = currentChannels.slice(0, currentChannels.length / 2);
                else currentChannels = currentChannels.slice(currentChannels.length / 2);
                channels = [];
                for (var i in currentChannels) {
                    currentChannel = currentChannels[i];
                    if (currentChannel === firstChannel) channels.push({
                        channel: currentChannel,
                        checked: true
                    });
                    else channels.push({
                        channel: currentChannel,
                        checked: false
                    });
                }
                return channels;
            }
        }
    });

    radioChannelData = new Vue({
        el: '#radio-channels',
        data: {
            items: RADIO_DATA
        },
        methods: {
            // Use to add or remove a radio from comparaison chart
            changeRadios: function(radio, e) {
                var dataToDisplay, index;
                if (e.target.nodeName === "INPUT") {
                    // Check if the channel exists in the list
                    // Add it if not, otherwise remove it
                    index = tvRadioChannelChartLabels.indexOf(radio);
                    if (e.target.checked)
                        if (index === -1) tvRadioChannelChartLabels.push(radio);
                        else if (index != -1) tvRadioChannelChartLabels.splice(index, 1);

                    // Get the data and display the chart
                    dataToDisplay = getObjectDataAndLabel(tvRadioChannelChartLabels);
                    if (currentTvRadioChannelChart === tvRadioChannelChartLinesID) {
                        tvRadioChannelLinesChart.destroy();
                        createLineChart(tvRadioChannelChartLinesID, dataToDisplay.labels, dataToDisplay.datasets);
                    } else {
                        tvRadioChannelBarsChart.destroy();
                        createStackedBarChart(tvRadioChannelChartBarsID, dataToDisplay.labels, dataToDisplay.datasets);
                    }
                }
            },
            // Get half part of the sorted radio
            sortedRadios: function(firstHalf) {
                firstRadio = Object.keys(this.items)[0];
                currentRadios = Object.keys(this.items).sort();
                if (firstHalf) currentRadios = currentRadios.slice(0, currentRadios.length / 2);
                else currentRadios = currentRadios.slice(currentRadios.length / 2);
                radios = [];
                for (var i in currentRadios) {
                    currentRadio = currentRadios[i];
                    if (currentRadio === firstRadio) radios.push({
                        radio: currentRadio,
                        checked: true
                    });
                    else radios.push({
                        radio: currentRadio,
                        checked: false
                    });
                }
                return radios;
            }
        }
    });

    // Initialize charts and button events
    initializeCharts("1998");
    initializeButtons();
});

/*
 * Get the data from the year
 * @param data The data to sort
 * @param year The year to get
 * @return {labels, data}
*/
function getYearDataAndLabel(data, year) {
    var labels, outputData;
    outputData = [];
    labels = Object.keys(data);
    for (var index in labels) {
        label = labels[index];
        outputData.push(data[label][year]);
    }

    return {
        labels: labels,
        data: outputData
    };
}

/*
 * Get the data and label from objects
 * @param objects The object to sort
 * @return {labels, datasets}
*/
function getObjectDataAndLabel(objects) {
    var index, i, currentLabels, outputData, datasets, data;

    currentLabels = [];
    outputData = [];
    datasets = [];
    data = {};

    $.extend(data, TV_DATA, RADIO_DATA);

    for (i in objects) {
        object = objects[i];
        dataset = {
            label: object,
            data: data[object],
            backgroundColor: backgroundColor[i],
            borderColor: borderColor[i],
            fill: false
        };
        datasets.push(dataset);

        for (index in data[object]) {
            if (data[object][index]) currentLabels.push(index);
        }
    }

    labels = [];
    $.each(currentLabels, function(i, el) {
        if ($.inArray(el, labels) === -1) labels.push(el);
    });
    labels = labels.sort();

    for (index in datasets) {
        data = [];
        for (i in datasets[index].data) {
            if (labels.includes(i)) data.push(datasets[index].data[i]);
        }
        datasets[index].data = data;
    }

    return {
        labels: labels,
        datasets: datasets
    };
}

/*
 * Create a doughnut chart
 * @param chartID The id of the canvas element
 * @param labels The labels to display
 * @param data The data to display
 */
function createDoughnutChart(chartID, labels, data) {
    var ctx, currentChart;
    $("#" + chartID).css("display", "block");
    ctx = document.getElementById(chartID).getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor
            }]
        },
        options: {
            maintainAspectRatio: false
        }
    });

    switch (chartID) {
        case radioYearDoughnutChartID:
            radioYearDoughnutChart = currentChart;
            break;
        case tvYearDoughnutChartID:
            tvYearDoughnutChart = currentChart;
            break;
        default:
            break;
    }
}

/*
 * Create a line chart
 * @param chartID The id of the canvas element
 * @param labels The labels to display
 * @param datasets The datasets to display
 */
function createLineChart(chartID, labels, datasets) {
    var ctx, currentChart;
    $("#" + chartID).css("display", "block");
    ctx = document.getElementById(chartID).getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
                    }
                }]
            }
        }
    });

    switch (chartID) {
        case tvRadioChannelChartLinesID:
            tvRadioChannelLinesChart = currentChart;
            break;
        default:
            break;
    }
}

/*
 * Create a bar chart
 * @param chartID The id of the canvas element
 * @param label The label to display
 * @param labels The labels to display
 * @param data The data to display
 */
function createBarChart(chartID, label, labels, data) {
    var ctx, currentChart;
    $("#" + chartID).css("display", "block");
    ctx = document.getElementById(chartID).getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
                    }
                }]
            }
        }
    });

    switch (chartID) {
        case radioYearBarChartID:
            radioYearBarChart = currentChart;
            break;
        case tvYearBarChartID:
            tvYearBarChart = currentChart;
            break;
        default:
            break;
    }
}

/*
 * Create a stacked bar chart
 * @param chartID The id of the canvas element
 * @param labels The labels to display
 * @param datasets The datasets to display
 */
function createStackedBarChart(chartID, labels, datasets) {
    var ctx, currentChart;
    ctx = document.getElementById(chartID).getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
                    }
                }],
                xAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    switch (chartID) {
        case tvRadioChannelChartBarsID:
            tvRadioChannelBarsChart = currentChart;
            break;
        default:
            break;
    }
}

/*
 * Initialize the different charts
 * @param year Set the default year for tv and radio charts
 */
function initializeCharts(year) {
    dataToDisplay = getYearDataAndLabel(RADIO_DATA, year);
    createBarChart(radioYearBarChartID, 'Pour l\'année ' + year, dataToDisplay.labels, dataToDisplay.data);
    $("#" + radioYearDoughnutChartID).css("display", "none");

    dataToDisplay = getYearDataAndLabel(TV_DATA, year);
    createBarChart(tvYearBarChartID, 'Pour l\'année ' + year, dataToDisplay.labels, dataToDisplay.data);
    $("#" + tvYearDoughnutChartID).css("display", "none");

    dataToDisplay = getObjectDataAndLabel([Object.keys(RADIO_DATA)[0], Object.keys(TV_DATA)[0]]);
    createLineChart(tvRadioChannelChartLinesID, dataToDisplay.labels, dataToDisplay.datasets);
    tvRadioChannelChartLabels.push(Object.keys(RADIO_DATA)[0], Object.keys(TV_DATA)[0]);

    createStackedBarChart(tvRadioChannelChartBarsID, dataToDisplay.labels, dataToDisplay.datasets);
    $("#" + tvRadioChannelChartBarsID).css("display", "none");
}

/*
 * Initialize the different buttons
 */
function initializeButtons() {

    // Hide bars chart and display doughnut chart for radio chart
    $("#changeRadioChartDoughnut").click(function() {
        if ($("#" + radioYearDoughnutChartID).css("display") != "block") {
            currentRadioChart = radioYearDoughnutChartID;
            var select, year, dataToDisplay;
            select = document.getElementById("radio-years");
            year = select.options[select.selectedIndex].value;
            dataToDisplay = getYearDataAndLabel(RADIO_DATA, year);

            radioYearBarChart.destroy();
            createDoughnutChart(radioYearDoughnutChartID, dataToDisplay.labels, dataToDisplay.data);

            $("#" + radioYearDoughnutChartID).css("display", "block");
            $("#" + radioYearBarChartID).css("display", "none");
        }
    });

    // Hide doughnut chart and display bars chart for radio chart
    $("#changeRadioChartBars").click(function() {
        if ($("#" + radioYearBarChartID).css("display") != "block") {
            currentRadioChart = radioYearBarChartID;
            var select, year, dataToDisplay;
            select = document.getElementById("radio-years");
            year = select.options[select.selectedIndex].value;
            dataToDisplay = getYearDataAndLabel(RADIO_DATA, year);

            radioYearDoughnutChart.destroy();
            createBarChart(radioYearBarChartID, 'Pour l\'année ' + year, dataToDisplay.labels, dataToDisplay.data);

            $("#" + radioYearBarChartID).css("display", "block");
            $("#" + radioYearDoughnutChartID).css("display", "none");
            $("#" + radioYearBarChartID).css("height", "500px");
        }
    });

    // Hide bars chart and display doughnut chart for tv chart
    $("#changeTVChartDoughnut").click(function() {
        if ($("#" + tvYearDoughnutChartID).css("display") != "block") {
            currentTvChart = tvYearDoughnutChartID;
            var select, year, dataToDisplay;
            select = document.getElementById("tv-years");
            year = select.options[select.selectedIndex].value;
            dataToDisplay = getYearDataAndLabel(TV_DATA, year);

            tvYearBarChart.destroy();
            createDoughnutChart(tvYearDoughnutChartID, dataToDisplay.labels, dataToDisplay.data);

            $("#" + tvYearDoughnutChartID).css("display", "block");
            $("#" + tvYearBarChartID).css("display", "none");
        }
    });

    // Hide doughnut chart and display bars for tv chart
    $("#changeTVChartBars").click(function() {
        if ($("#" + tvYearBarChartID).css("display") != "block") {
            currentTvChart = tvYearBarChartID;
            var select, year, dataToDisplay;
            select = document.getElementById("tv-years");
            year = select.options[select.selectedIndex].value;
            dataToDisplay = getYearDataAndLabel(TV_DATA, year);

            tvYearDoughnutChart.destroy();
            createBarChart(tvYearBarChartID, 'Pour l\'année ' + year, dataToDisplay.labels, dataToDisplay.data);

            $("#" + tvYearBarChartID).css("display", "block");
            $("#" + tvYearDoughnutChartID).css("display", "none");
            $("#" + tvYearBarChartID).css("height", "500px");
        }
    });

    // Hide bars chart and display lines chart for comparaison chart
    $("#changeCompareChartLines").click(function() {
        if ($("#" + tvRadioChannelChartLinesID).css("display") != "block") {
            currentTvRadioChannelChart = tvRadioChannelChartLinesID;
            var dataToDisplay = getObjectDataAndLabel(tvRadioChannelChartLabels);
            tvRadioChannelLinesChart.destroy();
            createLineChart(tvRadioChannelChartLinesID, dataToDisplay.labels, dataToDisplay.datasets);

            $("#" + tvRadioChannelChartLinesID).css("display", "block");
            $("#" + tvRadioChannelChartBarsID).css("display", "none");
        }
    });

    // Hide lines chart and display bars chart for comparaison chart
    $("#changeCompareChartBars").click(function() {
        if ($("#" + tvRadioChannelChartBarsID).css("display") != "block") {
            currentTvRadioChannelChart = tvRadioChannelChartBarsID;
            var dataToDisplay = getObjectDataAndLabel(tvRadioChannelChartLabels);
            tvRadioChannelBarsChart.destroy();
            createStackedBarChart(tvRadioChannelChartBarsID, dataToDisplay.labels, dataToDisplay.datasets);

            $("#" + tvRadioChannelChartBarsID).css("display", "block");
            $("#" + tvRadioChannelChartLinesID).css("display", "none");
        }
    });
}
