


  var hdata;
  var chartdata;
  var spotdata;
  var changePCT;
  var formattedChange;
  var price;
  
  
  function getprice(symbol) { 
      var APIKey = "f6c04b8c1b5d332df2dc000cf67455fc99d7ca2d00cc1d33a85e818756a85988";
      var currency = "USD"
      queryURL = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + symbol + "&tsyms=" + currency + "&api_key=" + APIKey;
      //console.log(queryURL)
      $.ajax({
          url: queryURL,
          method: "GET"
          })
          .then(function(response) {
              
              spotdata = response;
              //console.log(spotdata)
              price = parseFloat(spotdata.RAW[symbol][currency].PRICE)
              changePCT = parseFloat(spotdata.RAW[symbol][currency].CHANGEPCT24HOUR)
              formattedChange = changePCT.toFixed(2) 
              var formattedPrice = price.toFixed(2) 
              //console.log(formattedChange)
              //console.log(formattedPrice)
              $(".change1").text(formattedChange+"%")
              $("#price1").html(formattedPrice + " " + currency);
              //$(".change1").html(formattedChange+"%")
              //console.log(formattedChange < 0)
              if (formattedChange < 0) {
                $("#change1").addClass("callout alert");
                $("#change1").text(formattedChange+"%")
              } else {
                $("#change1").addClass("callout success");
                $("#change1").text(formattedChange+"%")
              }

      });
  };

  function gethistoryprice(symbol) { 
      var APIKey = "f6c04b8c1b5d332df2dc000cf67455fc99d7ca2d00cc1d33a85e818756a85988";
      queryURL = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=" + symbol + "&tsym=" + "USD" + "&limit=100&api_key=" + APIKey;
      //console.log(queryURL)
      $.ajax({
          url: queryURL,
          method: "GET"
          })
          .then(function(response) {
              //console.log(response);
              hdata = response;
              chartdata = hdata.Data.Data;
              //console.log(chartdata);
              //console.log(response[currency]);
              //$(".price1").html(response[currency]);
              updated_chart_data = [];
              chartdata.forEach(function(d,i){
                //console.log(d.time);
                //console.log(i);

                
                
                x = moment.unix(d.time).format("MM/DD/YYYY");
                //console.log(x)
                y = [d.open,d.high,d.low,d.close];

                updated_chart_data.push({"x": x, "y": y});
                // console.log(chartdata[i].time);

              });
              
              //console.log(updated_chart_data);
              var options = {
                "series": [{
                  "data": updated_chart_data
                }],
                chart: {
                      type: 'candlestick',
                      height: 350
                    },
                    title: {
                      text: 'CandleStick Chart',
                      align: 'left'
                    },
                    xaxis: {
                      type: 'datetime'
                    },
                    yaxis: {
                      tooltip: {
                        enabled: true
                      }
                    }
              };

              var chart = new ApexCharts(document.querySelector("#chartholder"), options);
              chart.render();
              
             
            });  
      
  };

