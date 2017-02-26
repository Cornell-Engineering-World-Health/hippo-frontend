angular.module('app.module').factory('users', ['$http', function($http){
    var o = {
        users: []
    }

    // CREATE a user
    o.create = function(user) {
        return $http.post('/users', user).success(function(data){
            o.users.push(data);
        })
    }

    // GET user by ID
    o.get = function(id) {
        return $http.get('/users/' + id).then(function(res){
           return res.data;
        })
    }

    // GET ALL users
    o.getAll = function() {
        return $http.get('/users').success(function(data){
            angular.copy(data, o.users);
        })
    }

    return o;
}
])
