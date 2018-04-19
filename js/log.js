$(document).ready(function() {
  $('footer').on('click', 'a', function() {
    sendLog({clickOn: this.href});
  });

  $('div#about').on('click', 'a', function() {
    sendLog({clickOn: this.href});
  });

  $("#about-tab").click(function() {
    sendLog({clickOn: "about-tab"});
  });

  $("select#radio-years").change(function() {
    sendLog({chart: "radio" , year: this.value});
  });

  $("select#tv-years").change(function() {
    sendLog({chart: "tv" , year: this.value});
  });

  $('div#compare').on('click', 'input', function() {
    sendLog({chart: "compare", title: this.value, value: this.checked});
  });

  $('div.changeChart').on('click', 'button', function() {
    sendLog({clickOn: "changeChart" , button: this.id});
  });

  sendLog({entry:true});

  function getCurrentDate(){
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth()+1; //January is 0!
    var year = today.getFullYear();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getMinutes();

    if(day<10) day = '0'+day;
    if(month<10) month = '0'+month;
    if(hour<10) hour = '0'+hour;
    if(minutes<10) minutes = '0'+minutes;
    if(seconds<10) seconds = '0'+seconds;

    today = hour + ":" + minutes + ":" + seconds + " " + day + '/' + month + '/' + year;
    return today;
  }

  function sendLog(toSend) {
    var today = getCurrentDate();
    toSend.date = today;

    $.ajax({
       url: "http://172.17.102.83/api/projects/tv_radio_stats",
       method: 'POST',
       crossDomain: true,
       data: "data=" + JSON.stringify(toSend),
       dataType: 'json',
       complete: function(xhr, textStatus) {  }
     });
  }

});
