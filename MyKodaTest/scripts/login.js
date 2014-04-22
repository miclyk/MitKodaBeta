(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
        password: "",
        
        onLogin: function () {
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                    function () { }, "Login failed", 'OK');

                return;
            }
            
            $.ajax({
                url: 'http://localhost:61122/api/login',
                type: 'Post',
                data: { email: username, password: password },
                crossDomain: true,
                dataType: 'jsonp',
                contentType: 'application/json',
                success: function (data) {
                    if(data.Data !== null && data.Data.ReadResult !== null && data.Data.ReadResult.IsAuthenticated === true)
                    {
                        that.set("isLoggedIn", true);
                        app.application.navigate("main.html");
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
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        },
        
        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        },
        
        goToMain: function(){
        	app.navigate("main.html");
    	}
    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);