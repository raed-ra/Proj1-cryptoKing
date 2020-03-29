


var data = `"{"id":1,"name":"Bitcoin","symbol":"BTC","slug":"bitcoin","num_market_pairs":7919,"date_added":"2013-04-28T00:00:00.000Z","tags":["mineable"],"max_supply":21000000,"circulating_supply":17906012,"total_supply":17906012,"platform":null,"cmc_rank":1,"last_updated":"2019-08-30T18:51:28.000Z","quote":{"USD":{"price":9558.55163723,"volume_24h":13728947008.2722,"percent_change_1h":-0.127291,"percent_change_24h":0.328918,"percent_change_7d":-8.00576,"market_cap":171155540318.86005,"last_updated":"2019-08-30T18:51:28.000Z"}}}"`
var finddata
var cryptoIndex = ["BTC","ETH","XRP","BCH","LTC","USDT","EOS","BNB","BSV","XLM"]
var holdings = {} //= JSON.parse(localStorage.getItem("holdings"))
// var initialBankValue = 100000
// var bankValue = initialBankValue;
// localStorage.setItem("bank",bankValue);
//var bankValue = 60000



$(document).on("click", "#new", newgame);

//resets all the holdings and bank, it also creates all the headers
function newgame() {
  event.preventDefault()
  var holdings = {"BTC":2,"ETH":20,"XRP":30,"BCH":40,"LTC":50,"USDT":60,"EOS":70,"BNB":80,"BSV":90,"XLM":100}
  localStorage.setItem("holdings",JSON.stringify(holdings))
  var NewbankValue = 100000
  localStorage.setItem("bank",NewbankValue);
  var row = $("<tr>")
  var tdSymbol = $("<td>").text("CRYPTO MARKET")
  var tdChange = $("<td>").text("24HR PRICE CHANGE (%)");
  var tdPrice = $("<td>").text("CRYPTO VALUE (US$)")
  var tdHoldings = $("<td>").text("HOLDINGS VALUE (US$)")
  var tdHoldingsModal = $("<button>").text("BUY/SELL")
  row.append(tdSymbol, tdChange, tdPrice, tdHoldings, tdHoldingsModal)
  $("#table-heading").html("")
  $("#table-heading").append(row)
  

  var row = $("<tr>")
  var tdBank = $("<td>").text("BANK")
  var tdHoldings = $("<td>").text("TOTAL HOLDINGS")
  var tdProfitLoss = $("<td>").text("PROFIT/LOSS")
  row.append(tdBank, tdHoldings, tdProfitLoss)
  $("#result-heading").html("")
  $("#result-heading").append(row)

  $("#table-body").html("")

  dashboardupdate();
}




//triggers the sell/buy function when sell/buy function is pushed
$(document).on("click", ".buysell", buySellprep);

//prepfunction upon modal opening for selling or buying - it registers which cryptocurrency the button belongs too
function buySellprep() {
  event.preventDefault();
  var symbol = $(this).attr("symbol-name");
  localStorage.setItem("symbol",symbol);
  $(".modaltitle").text(symbol);
  gethistoryprice(symbol);
}

//trigger buy function
$(document).on("click", "#buy", buy);

//buy function
function buy() {
  event.preventDefault();
  var buyamount = parseFloat($("#quantity").val().trim());
  var bankValue = parseFloat(localStorage.getItem("bank"));
  var holdings = JSON.parse(localStorage.getItem("holdings"));
  var prices = JSON.parse(localStorage.getItem("cryptoprices"));
  var symbol = localStorage.getItem("symbol");
  if (prices[symbol]*buyamount > bankValue) {
    $(".messages").addClass("callout alert").text("Not enough cash in bank to make this transaction!")
  } else {
    bankValue = bankValue - prices[symbol]*buyamount ;
    holdings[symbol] = holdings[symbol] + buyamount;
  }
  localStorage.setItem("bank",bankValue);
  localStorage.setItem("holdings",JSON.stringify(holdings));
  createResults(prices);
  holdingupdate(holdings);
}

//trigger sell function
$(document).on("click", "#sell", sell);

//sell function
function sell() {
  event.preventDefault();
  var sellamount = parseFloat($("#quantity").val().trim());
  var bankValue = parseFloat(localStorage.getItem("bank"));
  var holdings = JSON.parse(localStorage.getItem("holdings"));
  var prices = JSON.parse(localStorage.getItem("cryptoprices"));
  var symbol = localStorage.getItem("symbol");
  if (sellamount > holdings[symbol]) {
    $(".messages").addClass("callout alert").text("Not enough holdings to make this transaction!")
  } else {
    bankValue = bankValue + prices[symbol]*sellamount ;
    holdings[symbol] = holdings[symbol] - sellamount;
  }
  localStorage.setItem("bank",bankValue);
  localStorage.setItem("holdings",JSON.stringify(holdings));
  createResults(prices)
  holdingupdate(holdings);
}

//updates holdings on dashboard after buy/sell activity
function holdingupdate(Newholdings) {
  var holdings = Newholdings;
  $.each(holdings,function(key,value) {
    $("td#"+key).text(value)
  });
}

//creates rows in dashboard
function createRow(symbolData){
    var holdings = JSON.parse(localStorage.getItem("holdings"));
    var row = $("<tr>").addClass("symbol-row")
    var tdSymbol = $("<td>").addClass("td-symbol").text(symbolData.symbol)
    if (symbolData.quote.USD.percent_change_24h < 0) {
      var tdChange = $("<td>").addClass("td-change callout alert").text(symbolData.quote.USD.percent_change_24h.toFixed(2)+"%");
    } else {
      var tdChange = $("<td>").addClass("td-change callout success").text(symbolData.quote.USD.percent_change_24h.toFixed(2)+"%");
    }
    var tdPrice = $("<td>").addClass("td-price").text("$"+symbolData.quote.USD.price.toFixed(2)+" USD")
    var tdHoldings = $("<td>").addClass("td-holdings").attr("id",symbolData.symbol).text(holdings[symbolData.symbol])
    var tdHoldingsModal = $("<button>").addClass("button buysell").attr("data-open", "buysell").attr("symbol-name",symbolData.symbol).text("Buy/Sell")
    row.append(tdSymbol, tdChange, tdPrice, tdHoldings, tdHoldingsModal)
    $("#table-body").append(row)
}    



//creates bottom row in the dashboard showing profit and loss 
function createResults(prices){
    var holdings = JSON.parse(localStorage.getItem("holdings"));
    var bankValue = parseFloat(localStorage.getItem("bank"));
    //var holdings = { "BTC":2,"ETH":20,"XRP":30,"BCH":40,"LTC":50,"USDT":60,"EOS":70,"BNB":80,"BSV":90,"XLM":100}
    var row = $("<tr>").addClass("crypto-row")
    var holdingsValue = 0
    var profitloss
    var mul
    $.each(holdings,function(key,value) {
        mul = value * prices[key];
        holdingsValue += mul ;
    } ); 
    var profitloss = (((holdingsValue+bankValue)-100000)/100000)*100; 
    var row = $("<tr>").addClass("result-row")
    var tdBank = $("<td>").addClass("td-bank").text("$"+bankValue.toFixed(2)+ " USD")
    var tdHoldings = $("<td>").addClass("td-holdingsvalue").text("$"+holdingsValue.toFixed(2)+" USD")
    var tdProfitLoss = $("<td>").addClass("td-profitloss").text(profitloss.toFixed(2)+"%")
  row.append(tdBank, tdHoldings, tdProfitLoss)
  $("#results").html("")
  $("#results").append(row)
  if (profitloss < 0) {
    $(".td-profitloss").addClass("callout alert");
  } else {
    $(".td-profitloss").addClass("callout success");
  }11
}



//retrieves data from coinmarketcap to fill in dashboard - we also make an object with pricing of 10 cryptos
function dashboardupdate() { 
    $.ajax({
      type: "GET",
      url: "https://cors-anywhere.herokuapp.com/https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      headers: {
        "X-CMC_PRO_API_KEY": "1845c480-f9a5-436d-8fab-a2017e14fa3c" 
      },
      data: {}, 
      success: function(response) {
        testdata = response
        finddata = response.data;
        var cryptoprices ={}
        // for (let index = 0; index < response.data.length; index++) { **previous version
        for (let indexC = 0; indexC < 10 ; indexC++) {
            for (let indexD = 0; indexD < finddata.length ; indexD++) {
              if (cryptoIndex[indexC] === finddata[indexD].symbol) {
                const element = response.data[indexD];
                eachPrice = element.quote.USD.price.toFixed(2)
                eachPriceFloat = parseFloat(eachPrice);
                var middleIndex = cryptoIndex[indexC]
                cryptoprices[middleIndex] = eachPriceFloat;
                //console.log("test")
                createRow(element)
              }
            }    
        }
        //console.log(cryptoprices)
        localStorage.setItem("cryptoprices",JSON.stringify(cryptoprices))
        createResults(cryptoprices)
      },
      dataType: "json"
    });
  }


//this functions talks to another crypto website to pull data and then converts it to compatible data for ApexChart library to create candlestick graph
function gethistoryprice(symbol) { 
  var APIKey = "f6c04b8c1b5d332df2dc000cf67455fc99d7ca2d00cc1d33a85e818756a85988";
  queryURL = "https://min-api.cryptocompare.com/data/v2/histohour?fsym=" + symbol + "&tsym=USD&limit=100&api_key=" + APIKey;
  //console.log(queryURL)
  var chartdata;  //for candlestick function
  
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
          x = moment.unix(d.time)
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

