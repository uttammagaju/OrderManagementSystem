/// <reference path="../knockout.js" />

var OrderItemVM = function (item) {
    var self = this;
    item = item || {};
    self.OrderId = ko.observable(item.orderId || 0);
    self.CustomerName = ko.observable(item.customerName || '');
    self.Address = ko.observable(item.address || '');
    self.Date = ko.observable(item.date || '');
    self.Items = ko.observableArray((item.items || []).map(function (item) {
        return new ItemVM(item);
    }));
    self.TotalAmount = ko.observable(item.totalAmount || '');
}

var ItemVM = function (item) {
    var self = this;
    item = item || {};
    self.OrderItemId = ko.observable(item.orderItemId || 0);
    self.ProductName = ko.observable(item.productName || '');
    self.Quantity = ko.observable(item.quantity || '');
    self.Price = ko.observable(item.price || '');
    self.OrderId = ko.observable(item.orderId || 0);
}