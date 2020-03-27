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

function createRow(symbolData){

    var row = $("<tr>").addClass("crypto-row")

    var tdSymbol = $("<td>").addClass("td-symbol").text(symbolData.symbol)
    var tdChange = $("<td>").addClass("td-change").text(symbolData.quote.USD.percent_change_24h)
    var tdPrice = $("<td>").addClass("td-price").text(symbolData.quote.USD.price)
    var tdHoldings = $("<td>").addClass("td-holdings")


    row.append(tdSymbol, tdChange, tdPrice, tdHoldings)

    $("#table-body").append(row)
    

}

$.ajax({
  type: "GET",
  url: "https://cors-anywhere.herokuapp.com/https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  headers: {
    "X-CMC_PRO_API_KEY": "6fb22454-073e-4903-8583-92a6f903ba73"
  },
  data: {},
  success: function(response) {
    console.log(response);
    for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];

        createRow(element)
        
    }
    


  },
  dataType: "json"
});
