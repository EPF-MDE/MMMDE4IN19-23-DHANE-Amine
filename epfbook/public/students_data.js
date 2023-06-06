document.addEventListener("DOMContentLoaded", function () {
    d3.select("body").style("background-color", "#e0f0f5");
    d3.csv("/covid-19-students-delhi.csv").then((data) => {
        // var columns = [];
    
        // // Extract the keys from the data object
        // var keys = Object.keys(data[0]);
        
        // // Iterate over the keys and create columns for each key
        // keys.forEach((key) => {
        //     var columnData = [key];
            
        //     // Extract the values for the current key
        //     data.forEach((row) => {
        //         columnData.push(row[key]);
        //     });
            
        //     columns.push(columnData);
        // });
        
        // var chart = c3.generate({
        //     bindto: '#chart',
        //     data: {
        //         columns: columns
        //     }
        // });
        console.log(data)
        var stressBustersCount = {};

        // Iterate over each row of the data
        data.forEach((row) => {
            var stressBuster = row['Stress busters'];
        
            // If the stress buster is not already in the count object, initialize it to 1
            if (!stressBustersCount[stressBuster]) {
                stressBustersCount[stressBuster] = 1;
            }
            // If the stress buster is already in the count object, increment the count by 1
            else {
                stressBustersCount[stressBuster]++;
            }
        });
        
        const counts = Object.values(stressBustersCount);
        const categories = Object.keys(stressBustersCount);
        
        // Sort the stress busters by count in descending order
        const sortedStressBusters = categories.sort((a, b) => stressBustersCount[b] - stressBustersCount[a]);
        
        // Get the top 5 stress busters
        const top5StressBusters = sortedStressBusters.slice(0, 5);
        
        // Filter the data for the top 5 stress busters
        const filteredData = data.filter(row => top5StressBusters.includes(row['Stress busters']));

        // Count the health issues during lockdown
        const healthIssueCounts = {};
        filteredData.forEach(row => {
            const healthIssue = row['Health issue during lockdown'];
            if (!healthIssueCounts[healthIssue]) {
                healthIssueCounts[healthIssue] = 1;
            } else {
                healthIssueCounts[healthIssue]++;
            }
        });
        
        // Create a bar chart for the top 5 stress busters
        var chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [['Stress Busters', ...top5StressBusters.map(stressBuster => stressBustersCount[stressBuster])]],
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category',
                    categories: top5StressBusters
                }
            }
        });
        
        // Create a pie chart for the health issue counts
        var pieChart = c3.generate({
            bindto: '#pieChart',
            data: {
                columns: Object.entries(healthIssueCounts),
                type: 'pie'
            }
        });   
    });
});
