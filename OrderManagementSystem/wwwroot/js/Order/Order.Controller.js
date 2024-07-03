/// <reference path="order.model.js" />
/// <reference path="../knockout.js" />


const mode = {
    create: 1,
    update: 2
};
var OrderController = function () {
    var self = this;
    const baseUrl = "/api/OrderAPI";
    self.CurrentOrder = ko.observableArray([]);
    self.IsUpdated = ko.observable(false);
    self.SelectedOrder = ko.observable(new OrderItemVM());


    self.SelectOrder = function (model) {
        self.SelectedOrder(model);
        self.mode(mode.update);
    }

   
    self.CloseModel = function () {
        self.resetFrom();
    }

    //self.resetFrom = function () {
    //    self.mode(mode.create);
    //    self.IsUpdated(false);
    //}
    //Remove Item
    self.RemoveItem = function (item) {
        self.SelectedOrder().Items.remove(item)
    };
    //Add Item
    self.AddItem = function () {
        self.SelectedOrder().Items.push(new ItemVM());
    };

    //Save Item
    self.SaveOrder = function () {
        debugger
        var order = ko.toJS(self.SelectedOrder)
        if (order.OrderId === 0) {
            order.OrderId = self.CurrentOrder().length + 1;
            self.CurrentOrder.push(new OrderItemVM(order));
        } else {
            var index = self.CurrentOrder().findIndex(o => o.OrderId() === order.OrderId);
            if (index !== -1) {
                self.CurrentOrder()[index] = new OrderItemVM(order);
                self.CurrentOrder.valueHasMutated();
            }
        }
        $('#orderModal').modal('hide');
    };
}