

function toScientific(num) {
    const suffixes = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let i = 0;
    while (num >= 1000 && i < suffixes.length) {
      num /= 1000;
      i++;
    }
    return num.toFixed(2) + suffixes[i];
  }

function doCalc() {
    // number of trials
    const trials = parseInt(document.getElementById("trialsInput").value, 10);
    const gemsCost = 30 - parseInt(document.getElementById("traitNum").value, 10) * 5;
    const synergyProb = parseInt(document.getElementById("synergyNum").value,10);
    const traitNum = parseInt(document.getElementById("traitNum").value, 10);
    // probability of getting an SS Tier Grade
    const ss_prob = 0.000756 * traitNum;

    // probability of getting the desired trait
    const trait_prob = 1 / 9;

    // probability of getting one of the desired synergies
    const synergy_prob = synergyProb / 4;
    const ss_trait_synergy_prob = ss_prob * trait_prob * synergy_prob;


    // list to store the number of gems needed for each desired outcome
    let gems_needed = [];
    // simulate the trials
    for (let i = 0; i < trials; i++) {
        let gems = 0;
        let outcome = false;
        // keep rolling until desired outcome is obtained
        while (outcome !== true) {
            // roll two options
            const option1 = Math.random(); // Pseudo-Random
            gems += gemsCost;
            // check if SS Tier Grade is obtained, the desired trait is obtained, and one of the desired synergies is obtained
            if (option1 < ss_trait_synergy_prob) {
                outcome = true;
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

    // sort the gems_needed array in ascending order
gems_needed.sort((a, b) => a - b);

// calculate the index of the element that corresponds to the 75%, 85%, and 95% probability
const index75 = Math.floor(gems_needed.length * 0.75);
const index85 = Math.floor(gems_needed.length * 0.85);
const index95 = Math.floor(gems_needed.length * 0.95);

// calculate the gems needed for the 75%, 85%, and 95% probability
const gems75 = gems_needed[index75];
const gems85 = gems_needed[index85];
const gems95 = gems_needed[index95];

const card = document.getElementById("probability-card");


const cardHTML = `
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Percentiles</h5>
            <p class="card-text">75%: ${toScientific(gems75)}</p>
            <p class="card-text">85%: ${toScientific(gems85)}</p>
            <p class="card-text">95%: ${toScientific(gems95)}</p>
        </div>
    </div>
`;

// Set the HTML of the card element to the cardHTML string
card.innerHTML = cardHTML;

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
                gemsInRange.sort(function(a, b){return a-b});
                return `<br>Actual gems needed: ${gemsInRange.map(gems => gems + "A").join(", ")}`;
            }
        },
        plotOptions: {
            column: {
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

