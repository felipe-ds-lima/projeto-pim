app.controller("LoginController", ($scope, $http, SessionService) => {
  $scope.email = "";
  $scope.password = "";
  $scope.loading = false;
  $scope.errorMessage = false;

  $scope.handleSubmit = () => {
    $scope.errorMessage = false;
    $http
      .post("http://localhost:3000/api/sessions", {
        email: $scope.email,
        password: $scope.password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        $scope.loading = false;
        location.href = "/";
      })
      .catch(() => {
        $scope.loading = false;
        $scope.errorMessage = true;
      });
  };

  $scope.teste = () => {
    $scope.errorMessage = false;
  };

  if (SessionService.isAuthenticated()) {
    location.href = "/";
  }
});
