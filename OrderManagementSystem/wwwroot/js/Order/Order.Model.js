/// <reference path="../knockout.js" />

var OrderItemVM =  function (item) {
    var self = this;
    item = item || {};
    self.OrderId = ko.observable(item.orderId || 0);
    self.CustomerName = ko.observable(item.customerName || '');
    self.Address = ko.observable(item.address || '');
    self.Date = ko.observable(item.date || '');
    self.TotalAmount = ko.observable(item.totalAmount || '');
    self.Items = ko.observableArray(item.items || [], function (item) {
        return new ItemVm(item);
    })
}

var ItemVM =  function (item) {
    var self = this;
    item = item || {};
    self.OrderItemId = ko.observable(item.OrderItemId || '');
    self.ProductName = ko.observable(item.productName || '');
    self.Quantity = ko.observable(item.quantity || '');
    self.Price = ko.observable(item.price || '');
    self.OrderId = ko.observable(item.orderId || '');
}