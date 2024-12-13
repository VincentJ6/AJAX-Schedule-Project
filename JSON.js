$(document).ready(function () {
    $("#submit-btn").on("click", function () {
      // Clear existing table content
      $("#schedule-table tbody").empty();
  
      // Collect selected days
      var selectedDays = [];
      $("input[name='days']:checked").each(function () {
        selectedDays.push($(this).val());
      });
  
      // Validate that at least one day is selected
      if (selectedDays.length === 0) {
        alert("Please select at least one day.");
        return;
      }
  
      // Fetch schedule data via AJAX
      $.ajax({
        url: "json.json",
        method: "GET",
        success: function (response) {
          console.log("JSON Response:", response);
  
          // Validate that the response contains the 'schedule' key
          if (!response.schedule) {
            console.error("Missing 'schedule' key in the JSON.");
            alert("Error: 'schedule' key is missing in the JSON.");
            return;
          }
  
          // Group classes by period (1 to 7)
          var classesByPeriod = {};
          for (var i = 1; i <= 7; i++) {
            classesByPeriod[i] = [];
          }
  
          response.schedule.forEach(function (item) {
            if (item.period >= 1 && item.period <= 7) {
              classesByPeriod[item.period].push(item);
            }
          });
  
          // Generate table rows for each period
          for (var period = 1; period <= 7; period++) {
            var periodClasses = classesByPeriod[period];
  
            // Display message if no classes exist for the period
            if (periodClasses.length === 0) {
              $("#schedule-table tbody").append(
                "<tr><td colspan='5'>No classes for Period " + period + ".</td></tr>"
              );
            } else {
              // Add header for the period
              $("#schedule-table tbody").append(
                "<tr><th colspan='5'>Period " + period + "</th></tr>"
              );
  
              // Add rows for each class that matches the selected days
              periodClasses.forEach(function (item) {
                var isClassOnSelectedDay = item.days.some(function (day) {
                  return selectedDays.includes(day);
                });
  
                if (isClassOnSelectedDay) {
                  var row = $("<tr>");
                  row.append("<td>" + item.period + "</td>");
                  row.append("<td>" + item.time + "</td>");
                  row.append("<td>" + item.class_name + "</td>");
                  row.append("<td>" + item.teacher + "</td>");
                  row.append("<td>" + item.room + "</td>");
                  $("#schedule-table tbody").append(row);
                }
              });
            }
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX Error:", status, error);
          alert("Error loading schedule data.");
        },
      });
    });
  });
  