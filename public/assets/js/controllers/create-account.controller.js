app.controller("CreateAccountController", ($scope, $http, SessionService) => {
  $scope.name = "";
  $scope.email = "";
  $scope.password = "";
  $scope.passwordConfirmation = "";

  $scope.handleSubmit = () => {
    if ($scope.password != $scope.passwordConfirmation) {
      return;
    }
    $scope.loading = true;

    $http
      .post("http://localhost:3000/api/users", {
        name: $scope.name,
        email: $scope.email,
        phone: $scope.phone,
        birthdate: $scope.birthdate,
        password: $scope.password,
      })
      .then(() => {
        $scope.loading = false;
        location.href = "/login";
      });
  };

  
  if(SessionService.isAuthenticated()) {
    location.href = '/'
  }
});
