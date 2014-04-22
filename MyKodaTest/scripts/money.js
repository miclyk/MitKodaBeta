(function (global) {
    var MoneyViewModel,
        app = global.app = global.app || {};

    MoneyViewModel = kendo.data.ObservableObject.extend({
        moneyDataSource: null,

        init: function () {
            var that = this,
                dataSource,
                dynNavData;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            console.log("Showing money-view")

/*            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "http://localhost:61122/api/membernumber=12500652",
                        dataType: "jsonp",
                        data: function(data) {
                            if(data.results.length === 0) {
                                return [];
                            }
                            return data.results;
	                    },
                    }
                },
                schema: {
                	data : "Data.ReadResult.LedgerEntries"
                }
            });
*/            
            $.ajax({
                url: 'http://localhost:61122/api/money',
                type: 'Post',
                data: { membernumber: "12500652" },
                crossDomain: true,
                dataType: 'jsonp',
                contentType: 'application/json',
                success: function (data) {
                    if(data.Data !== null && data.Data.ReadResult !== null && data.Data.ReadResult.IsAuthenticated === true)
                    {
                        dataSource = new kendo.data.DataSource({ data: data.Data.ReadResult.LedgerEntries });
			            that.set("moneyDataSource", dataSource);
                        return;
                    } else {
						navigator.notification.alert("Invalid username/password combination.",
                    		function () { }, "Login failed", 'OK');
                		return;
                    }
                },
                error: function() {
                navigator.notification.alert("Something went wrong!");
                return;
            }
            });
        }
    });
    
    app.moneyService = {
        viewModel: new MoneyViewModel()
    };
    
})(window);