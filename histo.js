

function doCalc() {
    // probability of getting an SS Tier Grade
    const ss_prob = 0.000756;

    // probability of getting the desired trait
    const trait_prob = 1 / 9;

    // probability of getting one of the desired synergies
    const synergy_prob = 1 / 2;

    // number of trials
    const trials = document.getElementById("trialsInput").value;

    // list to store the number of gems needed for each desired outcome
    let gems_needed = [];
    // simulate the trials
    for (let i = 0; i < trials; i++) {
        let gems = 0;
        let outcome = "";
        // keep rolling until desired outcome is obtained
        while (outcome !== "SS Tier Grade with trait and synergy") {
            // roll two options
            const option1 = Math.random();
            const option2 = Math.random();
            gems += 20;
            // check if SS Tier Grade is obtained, the desired trait is obtained, and one of the desired synergies is obtained
            if (option1 < ss_prob * trait_prob * synergy_prob || option2 < ss_prob * trait_prob * synergy_prob) {
                outcome = "SS Tier Grade with trait and synergy";
            }
        }
        gems_needed.push(gems);
    }



    const gemsThousands = gems_needed.map(gems => Math.floor(gems / 1000));
    const gemsInThousands = gems_needed.map(gems => Math.floor(gems / 1000));
    // Define the bins for the histogram
    const bins = [];
    for (let i = 0; i <= Math.max(...gemsThousands) + 100; i += 100) {
        bins.push(i);
    }
    let gemsInRange;
    // Count the frequency of gems needed within each bin
    const gemsInBins = new Array(bins.length - 1).fill().map(() => []);
    gemsInThousands.forEach(gems => {
        const binIndex = Math.floor(gems / 100);
        gemsInBins[binIndex].push(gems);
    });
    const frequencies = gemsInBins.map(gems => gems.length);



    Highcharts.chart('histogram', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Frequency Histogram of Gems Needed'
        },
        xAxis: {
            title: {
                text: 'Gems Needed (Thousands)'
            },
            tickInterval: 100,
            labels: {
                formatter: function () {
                    const binIndex = bins.indexOf(this.value);
                    const start = binIndex > 0 ? bins[binIndex] : 0;
                    const end = this.value + 100;
                    return `${start}k - ${end}k`;
                }
            }
        },
        yAxis: {
            title: {
                text: 'Frequency'
            }
        },
        tooltip: {
            formatter: function () {
                const gems = this.point.gems;
                const start = Math.floor(gems / 100000) * 100000;
                const end = start + 100000;
                const gemsInRange = gemsInBins[Math.floor(gems / 100)];
                const frequency = gemsInRange.length;
                return `Gems Needed: ${Highcharts.numberFormat(gems, 0)}<br>Frequency within ${start / 1000}k-${end / 1000}k range: ${frequency}<br>Actual gems needed: ${gemsInRange.map(gems => gems).join(", ")}`;
            }
        },
        plotOptions: {
            column: {
                colorByPoint: true,
                colors: ['#f7a35c', '#90ed7d', '#7cb5ec', '#434348', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
                dataLabels: {
                    enabled: true,
                    format: '{point.y}',
                    style: {
                        fontWeight: 'bold'
                    }
                },
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Frequency',
            data: frequencies.map((frequency, index) => ({ x: bins[index], y: frequency, gems: bins[index] }))
        }]
    });

    document.getElementById("graph").style = "";
}

