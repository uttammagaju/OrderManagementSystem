/// <reference path="order.model.js" />
/// <reference path="../knockout.js" />


const mode = {
    create: 1,
    update: 2
};
var OrderController = function () {
    var self = this;
    const baseUrl = "/api/OrderAPI";
    self.NewOrder = ko.observable(new OrderItemVM());
    self.Orders = ko.observableArray([]);
    self.IsUpdated = ko.observable(false);
    self.mode = ko.observable(mode.create);
    self.SelectedOrder = ko.observable(new OrderItemVM());


    self.GetDatas = function () {
      
        return ajax.get(baseUrl).then(function (result) {
            console.log("resutl:",result);
            self.Orders(result.map(item => new OrderItemVM(item)));
        });
    };

    self.GetDatas();

    self.DeleteOrder = function (model) {
        ajax.delete(baseUrl + "?id=" + model.OrderId())
            .done((result) => {
                self.Orders.remove(model);
            }).fail((err) => {
                console.log(err)
            });
    };

    self.SelectOrder = function (model) {
        self.SelectedOrder(model);
        self.mode(mode.update);
    }


    self.CloseModel = function () {
        self.resetFrom();
    }

    self.resetFrom = function () {
        self.NewOrder(new OrderItemVM());// create a new empty NewOrder
        self.SelectedOrder(new OrderItemVM()); // create a  new empty selected Order
        self.mode(mode.create);//set the mode to create
        self.IsUpdated(false);
    }
    //Remove Item
    self.RemoveItem = function (item) {
        self.SelectedOrder().Items.remove(item)
    };
    //Add Item
    self.AddItem = function () {
        self.SelectedOrder().Items.push(new ItemVM());
        
    };
    //Save Item
    self.AddItem();


    self.totalAmount = ko.computed(function () {
        var total = self.SelectedOrder().Items().reduce(function (total, item) {
            var price = parseFloat(item.Price()) || 0; // Use item.Price() for observable
            var quantity = parseInt(item.Quantity()) || 0; // Use item.Quantity() for observable
            console.log(`Calculating: Price=${price}, Quantity=${quantity}`); // Debugging
            return total + (price * quantity);
        }, 0);
        console.log(`Total Amount: ${total.toFixed(2)}`); // Debugging
        return total.toFixed(2); // Round to 2 decimal places
    });

    self.SaveOrder = function () {
        debugger
        self.totalAmount();
        ko.toJS(self.SelectedOrder().TotalAmount = self.totalAmount()) ;
        var order = ko.toJS(self.SelectedOrder)
        if (order.OrderId === 0) {
            order.OrderId = self.Orders().length + 1;
            self.Orders.push(ko.toJS(self.SelectedOrder));
            //console.log("order :" + order);
            //console.log(ko.toJS(self.SelectedOrder));
        } else {
            var index = self.Orders().findIndex(o => o.OrderId() === order.OrderId);
            if (index !== -1) {
                self.Orders()[index] = new OrderItemVM(order);
                self.Orders.valueHasMutated();
            }
        }
        $('#orderModal').modal('hide');
        self.CloseModel();
        self.AddItem();
    };
};

//AJAX utility function for making HTTP requests
var ajax = {
    get: function (url) {
        return $.ajax({
            method: "GET",
            url: url,
            async: false,  // Synchronous request (not recommended, consider changing to async: true)
        });
    },
    delete: function(route){
        return $.ajax({
            method: "DELETE",
            url: route,
        });
    }
};