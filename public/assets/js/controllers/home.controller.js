app.controller("HomeController", ($scope, $http, SessionService) => {
  $scope.menuActive = false;

  $scope.logout = SessionService.logout

  $scope.toggle = () => {
    $scope.menuActive = !$scope.menuActive;
  };


  $scope.getUser = () => {
    $http
      .get("http://localhost:3000/api/users/", {
        headers: {
          Authorization: `Bearer ${SessionService.getToken()}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        $scope.name = response.data.name.split(" ")[0];
      });
  };

  $scope.getUser();

  SessionService.verifyLogin();
  SessionService.createVerifyLoginInterval();
});
