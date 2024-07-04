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
    self.NewOrder = ko.observable(new OrderItemVM());
    self.mode = ko.observable(mode.create);

    // Fetch Data From Server 
    self.getData = function () {
        ajax.get(baseUrl).then(function (result) {
            self.CurrentOrder(result.map(item => new OrderItemVM(item)));
        });
    }

    self.getData();

    self.AddOrder = function () {
        var orderData = ko.toJS(self.IsUpdated() ? self.SelectedOrder : self.NewOrder);
        orderData.TotalAmount = self.totalAmount();
        // Format the data correctly
        var formattedOrder = {
            orderId: orderData.OrderId || 0,
            customerName: orderData.CustomerName,
            address: orderData.Address,
            date: orderData.Date,
            totalAmount: parseFloat(self.totalAmount()),
            items: orderData.Items.map(item => ({
                orderItemId: item.OrderItemId || 0,
                productName: item.ProductName,
                quantity: parseInt(item.Quantity) || 0,
                price: parseFloat(item.Price) || 0,
                orderId: item.OrderId || 0
            }))
        };

        // Validate the order data
        var validation = self.validateOrder(formattedOrder);
        if (!validation.isValid) {
            alert(validation.errorMessage);
            return;
        }
        switch (self.mode()) {
            case 1:
                ajax.post(baseUrl, JSON.stringify(orderData))
                    .done(function (result) {
                        console.log("Data received", result);
                        self.CurrentOrder.push(new OrderItemVM(result));
                        self.resetForm();
                        self.getData();
                       
                        $('#orderModal').modal('hide');
                    })
                    .fail(function (err) {
                        console.error("Error adding order:", err);
                    });
                break;
            default:
                ajax.put(baseUrl, JSON.stringify(orderData))
                    .done(function (result) {
                        var updatedOrder = new OrderItemVM(result);
                        var index = self.CurrentOrder().findIndex(function (item) {
                            return item.OrderId() === updatedOrder.OrderId();
                        });
                        if (index >= 0) {
                            self.CurrentOrder.replace(self.CurrentOrder()[index], updatedOrder);
                        }
                        self.resetForm();
                        self.getData();
                        $('#orderModal').modal('hide');
                    })
                    .fail(function (err) {
                        console.error("Error updating order:", err);
                    });
                break;
        }
    };


    self.validateOrder = function (orderData) {
        var isValid = true;
        var errorMessage = "";

        if (!orderData.customerName) {
            isValid = false;
            errorMessage += "Customer Name is required. ";
        }

        if (!orderData.date) {
            isValid = false;
            errorMessage += "Date is required. ";
        }

        if (orderData.items.length === 0) {
            isValid = false;
            errorMessage += "At least one item is required. ";
        }

        orderData.items.forEach((item, index) => {
            if (!item.productName) {
                isValid = false;
                errorMessage += `Product Name is required for item ${index + 1}. `;
            }
            if (!item.quantity || item.quantity <= 0) {
                isValid = false;
                errorMessage += `Valid Quantity is required for item ${index + 1}. `;
            }
            if (!item.price || item.price <= 0) {
                isValid = false;
                errorMessage += `Valid Price is required for item ${index + 1}. `;
            }
        });

        return { isValid, errorMessage };
    };

    // Delete Product
    self.DeleteProduct = function (model) {
        ajax.delete(baseUrl + "?id=" + model.OrderId())
            .done((result) => {
                self.CurrentOrder.remove(function (item) {
                    return item.OrderId() === model.OrderId();
                });
            }).fail((err) => {
                console.log(err);
            });
    };

    self.SelectOrder = function (model) {
        self.SelectedOrder(model);
        self.IsUpdated(true);
        self.mode(mode.update);
        $('#orderModal').modal('show');
    }

    self.CloseModel = function () {
        self.resetForm();
    }

    self.resetForm = function () {
        self.NewOrder(new OrderItemVM());
        self.SelectedOrder(new OrderItemVM());
        self.IsUpdated(false);
        self.AddItem(); // Add an initial empty item
    }

    // Remove Item
    self.RemoveItem = function (item) {
        if (self.IsUpdated()) {
            self.SelectedOrder().Items.remove(item);
        } else {
            self.NewOrder().Items.remove(item);
        }
    };

    // Add Item
    self.AddItem = function () {
        if (self.IsUpdated()) {
            self.SelectedOrder().Items.push(new ItemVM());
        } else {
            self.NewOrder().Items.push(new ItemVM());
        }
    };

    self.totalAmount = ko.computed(function () {
        var items = self.IsUpdated() ? self.SelectedOrder().Items() : self.NewOrder().Items();
        var total = items.reduce(function (total, item) {
            var price = parseFloat(item.Price()) || 0;
            var quantity = parseInt(item.Quantity()) || 0;
            return total + (price * quantity);
        }, 0);
        return total.toFixed(2);
    });

   
    self.calculateTotal = function () {
        self.totalAmount.notifySubscribers();  // Recalculate the total amount
    };

    // Initialize the form
    self.resetForm();
}

var ajax = {
    get: function (url) {
        return $.ajax({
            method: "GET",
            url: url,
            async: false,
        });
    },
    post: function (url, data) {
        return $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            url: url,
            data: data
        });
    },
    put: function (url, data) {
        return $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            url: url,
            data: data
        });
    },
    delete: function (route) {
        return $.ajax({
            method: "DELETE",
            url: route,
        });
    }
};