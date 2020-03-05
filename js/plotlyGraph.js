window.addEventListener('load', function () {
    //User name to be displayed in the graph legend
    let userName = "";
    //Defines whether to use plotlys legend or our custom one
    let usePlotlyLegend = true;
    //Padding to define if the slider should be pushed to the right for high scorers
    //or be kept across the whole screen for more screen use on mobile
    let sliderPadding = undefined;
    let userStatsPadding = {  t: 60, l: 10, b: 30};
    let topScorerPadding = { t: 60, l: 110, b: 30 };

    let containerDiv = '';

    //Determines how long the transition between one frame to the next takes
    let MILLISECONDS_TRANSITION_FRAMES = 50;
    //Determines how long the frame is displayed on the screen before a new frame is played
    let MILLISECONDS_DURATION_FRAMES = 50;

    function buildUserData(userData, averageUserData, currentUserIndex) {
        let userAttemptArray = userData[currentUserIndex].SimpleFormScores;
        let averageUserAttemptArray = averageUserData.SimpleFormScores;

        let userXArray = [];
        let userYArray = [];
        let averageYArray = [];
        let userMaxY = 0;
        let userCounter = 0;
        let doubleFlightFrames = [];
        let myFlightSteps = [];
        for (let i = 0; i < averageUserAttemptArray.length; i++) {
            let averageDataPoint = averageUserAttemptArray[i];
            let userDataPoint = userAttemptArray[i];
            if (averageDataPoint && averageDataPoint.FormScore_Time && averageDataPoint.Distance
                && userDataPoint && userDataPoint.FormScore_Time && userDataPoint.Distance) {
                userXArray.push(userCounter);
                userYArray.push(userDataPoint.Distance);
                averageYArray.push(averageDataPoint.Distance);
                if (averageDataPoint.Distance > userMaxY) { userMaxY = averageDataPoint.Distance; }
                if (userDataPoint.Distance > userMaxY) { userMaxY = userDataPoint.Distance; }
                doubleFlightFrames.push({
                    name: userCounter,
                    data: [
                        {
                            "name": "Average",
                            "x": userXArray.slice(0),
                            "y": averageYArray.slice(0),
                            "type": "scatter",
                            line: {
                                width: 10,
                                color: "#00529C"
                            }
                        },
                        {
                            "name": "Current User",
                            "x": userXArray.slice(0),
                            "y": userYArray.slice(0),
                            "type": "scatter",
                            line: {
                                width: 8,
                                color: "#fff"
                            }
                        }
                    ]
                });

                myFlightSteps.push({
                    method: 'animate',
                    label: userCounter,
                    args: [[userCounter], {
                        mode: 'immediate',
                        transition: { duration: 300 },
                        frame: { duration: 300, redraw: false }
                    }]
                });
                userCounter++;
            }
            else {
                console.log("Issues with data");
                continue;
            }
        }

        var testLayout = {
            plot_bgcolor: "#201d1e",
            paper_bgcolor: "#201d1e",
            font: {
                family: 'Nunito Sans',
                size: '15',
                color: '#fff',
                weight: 'bold'
            },
            showlegend: usePlotlyLegend,
            legend: {
                x: -.05,
                bgcolor: 'rgba(0,0,0,0)',
                //"orientation": "h",
                y: -.15
                //font: {
                //    size: 10,
                //}
            },
            margin: {
                l: 100,
                r: 40,
                t: 0,
                b: 40
            },

            xaxis: {
                title: 'Time In Seconds',
                
                font: { weight: 'bold' },
                range: [userXArray[0], userXArray[userXArray.length - 1]],
                tickcolor: '#fff',
                //tickwidth: 2,
                ticklen: 10,
                zerolinecolor: 'rgb(255, 255, 255)',
                showgrid: true,
                gridwidth: .5,
                gridcolor: 'rgb(135, 135, 135)'
            },
            yaxis: {
                title: 'Distance From Lead (ft)',
                //titlefont: {size: 25},
                range: [0, userMaxY + userMaxY * .1],
                tickcolor: '#fff',
                //tickwidth: 2,
                ticklen: 10,
                zerolinecolor: 'rgb(255, 255, 255)',
                showgrid: true,
                gridwidth: .5,
                gridcolor: 'rgb(135, 135, 135)'
            },

            //updatemenus: [{
            //  x: 0,
            //  y: 0,
            //  yanchor: 'top',
            //  xanchor: 'left',
            //  showactive: false,
            //  direction: 'left',
            //  type: 'buttons',
            //  pad: {t: 120, r: 10},
            //  buttons: [{
            //      method: 'animate',
            //    args: [null, {
            //      mode: 'immediate',
            //      fromcurrent: true,
            //      transition: {duration: 50},
            //        frame: { duration: 50, redraw: false },

            //    }],
            //    label: 'Play'
            //  }, {
            //    method: 'animate',
            //    args: [[null], {
            //      mode: 'immediate',
            //      transition: {duration: 0},
            //      frame: {duration: 0, redraw: false}
            //    }],
            //    label: 'Pause'
            //  }]
            //}],

            sliders: [{
                pad: sliderPadding,
                currentvalue: {
                    tickcolor: '#fff',
                    //visible: true,
                    prefix: 'Time:',
                    //xanchor: 'right',
                    font: { size: 20, color: '#fff' }
                },
                steps: myFlightSteps
            }]
        };

        // Create the plot:
        $.Plotly = Plotly.plot(containerDiv, {
            data: doubleFlightFrames[0].data,
            layout: testLayout,
            config: { responsive: true, displayModeBar: false },
            frames: doubleFlightFrames
        }).then(
            function () {
                var renderCompleteEvent = jQuery.Event('plotlyRenderComplete');
                renderCompleteEvent.animationFrames = doubleFlightFrames.length;
                $(window).trigger(renderCompleteEvent);

                setTimeout(function () {
                    Plotly.animate(containerDiv, null, {
                        mode: 'next',
                        transition: {
                            duration: MILLISECONDS_TRANSITION_FRAMES,
                            easing: 'cubic-in-out'
                        },
                        frame: {
                            duration: MILLISECONDS_DURATION_FRAMES,
                            redraw: false
                        }
                    });
                }, 1000);
            }
        );
    }

    window.setGraphData = function setGraphData(userDataParam, averageDataParam, containerDivParam, userIndexParam) {
        containerDiv = containerDivParam;
        averageUserData = averageDataParam;
        userData = userDataParam;
        currentUserIndex = userIndexParam;
        usePlotlyLegend = false;
        sliderPadding = userStatsPadding;
        try {
            Plotly.purge(containerDiv);
        } catch (er) {
            console.log("Error occurred while purging graph: ", er);
        }
        buildUserData(userData, averageUserData, currentUserIndex);
    };

    //we want to run the graph AFTER the top scorers and the table are loaded
    //if ran before, we will not have the needed data (top scorer, currently selected user to compare to top scorer)
    $(window).on('loadPlotlyGraph', function (e) {
        containerDiv = e.containerDiv;
        console.log("container div is: " + containerDiv);
        averageUserData = e.averageUserData;
        userData = e.userData;
        currentUserIndex = e.currentUserIndex;
        usePlotlyLegend = true;
        sliderPadding = topScorerPadding;

        try {
            Plotly.purge(containerDiv);
        } catch (er) {
            console.log("Error occurred while purging graph: ", er);
        }
        buildUserData(userData, averageUserData, currentUserIndex);
    });

    $(window).on('purgeGraph', function (e) {
        try {
            console.log("clearing graph area");
            Plotly.purge(e.containerDiv);
        } catch (er) {
            console.log("Error occurred while purging graph: ", er);
        }
        //buildUserData();
    });

});