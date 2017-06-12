(function () {
    angular.
    module("NarrowItDownApp", []).
    controller("NarrowItDownController", NarrowItDownController).
    service("MenuSearchService", MenuSearchService).
    directive("foundItems", FoundItems).
    constant("APIUrl", "https://davids-restaurant.herokuapp.com/menu_items.json");

    NarrowItDownController.$inject = ["MenuSearchService"];

    function NarrowItDownController(MenuSearchService) {
        var menu = this;

        menu.found = [];
        menu.searchTerm = "";
        menu.showError = false;

        menu.narrowItDown = function () {
            menu.found = [];

            if (menu.searchTerm) {
                var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
                promise.then(function (foundItems) {
                    menu.found = foundItems;
                    menu.setShowError();
                });
            } else {
                menu.setShowError();
            }
        };

        menu.removeItem = function (index) {
            menu.found.splice(index, 1);
        };

        menu.setShowError = function () {
            menu.showError = (menu.found.length === 0);
        };
    }

    MenuSearchService.$inject = ["$http", "APIUrl"];

    function MenuSearchService($http, APIUrl) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: 'GET',
                url: APIUrl
            }).then(function (response) {
                var foundItems = [];
                return response.data.menu_items.filter(function (item) {
                    foundItems = item.description.indexOf(searchTerm) !== -1;
                    return foundItems;
                });
            }).catch(function (error) {
                console.log(error);
            });
        };

    }

    function FoundItems() {
        var ddo = {
            templateUrl: "foundItems.html",
            scope: {
                items: "<",
                error: "<",
                onRemove: "&"
            }
        };

        return ddo;
    }
})();