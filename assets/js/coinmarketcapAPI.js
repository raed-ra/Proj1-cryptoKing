/* Example in Node.js ES6 using request-promise */

// const requestOptions = {
//   method: 'GET',
//   uri: ,
//   qs: {
//     'start': '1',
//     'limit': '5000',
//     'convert': 'USD'
//   },
//   headers: {
//     'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
//   },
//   json: true,
//   gzip: true
// };

var data = `"{"id":1,"name":"Bitcoin","symbol":"BTC","slug":"bitcoin","num_market_pairs":7919,"date_added":"2013-04-28T00:00:00.000Z","tags":["mineable"],"max_supply":21000000,"circulating_supply":17906012,"total_supply":17906012,"platform":null,"cmc_rank":1,"last_updated":"2019-08-30T18:51:28.000Z","quote":{"USD":{"price":9558.55163723,"volume_24h":13728947008.2722,"percent_change_1h":-0.127291,"percent_change_24h":0.328918,"percent_change_7d":-8.00576,"market_cap":171155540318.86005,"last_updated":"2019-08-30T18:51:28.000Z"}}}"`
var finddata
var cryptoIndex = ["BTC","ETH","XRP","BCH","LTC","USDT","EOS","BNB","BSV","XLM"]
var holdings = [2,20,30,40,50,60,70,80,90,100]
var bankValue = 60000

function createRow(symbolData){
  var row = $("<tr>").addClass("symbol-row")
    var tdSymbol = $("<td>").addClass("td-symbol").text(symbolData.symbol)
    if (symbolData.quote.USD.percent_change_24h < 0) {
      var tdChange = $("<td>").addClass("td-change callout alert").text(symbolData.quote.USD.percent_change_24h.toFixed(2)+"%");
    } else {
      var tdChange = $("<td>").addClass("td-change callout success").text(symbolData.quote.USD.percent_change_24h.toFixed(2)+"%");
    }
    var tdPrice = $("<td>").addClass("td-price").text("$"+symbolData.quote.USD.price.toFixed(2)+" USD")
    var tdHoldings = $("<td>").addClass("button td-holdings").text("$0.00")

    row.append(tdSymbol, tdChange, tdPrice, tdHoldings)

    $("#table-body").append(row)
}

function createResults(prices){
    var row = $("<tr>").addClass("crypto-row")
    var holdingsValue = 0
    var initialbankValue = 100000
    var profitloss
    var mul
    for (let i = 0 ; i < 10 ; i++){
        console.log(prices[i]);
        console.log(holdings[i]);
        mul = holdings[i]*prices[i];
        console.log(mul);
        holdingsValue += mul ;
        console.log(holdingsValue);
    }  
    var profitloss = (((holdingsValue+bankValue)-initialbankValue)/initialbankValue)*100; 
    var row = $("<tr>").addClass("result-row")
    var tdBank = $("<td>").addClass("td-bank").text("$"+bankValue.toFixed(2)+ " USD")
    var tdHoldings = $("<td>").addClass("td-holdingsvalue").text("$"+holdingsValue.toFixed(2)+" USD")
    var tdProfitLoss = $("<td>").addClass("td-profitloss").text(profitloss.toFixed(2)+"%")
  row.append(tdBank, tdHoldings, tdProfitLoss)
  $("#results").append(row)
  if (profitloss < 0) {
    $(".td-profitloss").addClass("callout alert");
  } else {
    $(".td-profitloss").addClass("callout success");
  }
}


$.ajax({
  type: "GET",
  url: "https://cors-anywhere.herokuapp.com/https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  headers: {
    "X-CMC_PRO_API_KEY": "6fb22454-073e-4903-8583-92a6f903ba73"
  },
  data: {}, 
  success: function(response) {
    finddata = response.data;
    var cryptoprices = []
    // for (let index = 0; index < response.data.length; index++) { **previous version
    for (let indexC = 0; indexC < 10 ; indexC++) {
        for (let indexD = 0; indexD < finddata.length ; indexD++) {
          if (cryptoIndex[indexC] === finddata[indexD].symbol) {
            const element = response.data[indexD];
            eachPrice = element.quote.USD.price.toFixed(2)
            eachPriceFloat = parseFloat(eachPrice);
            cryptoprices.push(eachPriceFloat);
            createRow(element)
          }
        }    
     }
    createResults(cryptoprices)
  },
  dataType: "json"
});

