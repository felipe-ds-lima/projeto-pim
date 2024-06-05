app.controller("EditProfileController", ($scope, $http, SessionService) => {
  $scope.successMessage = false;
  $scope.errorMessage = false;

  $scope.name = "";
  $scope.email = "";
  $scope.phone = "";
  $scope.password = "";
  $scope.passwordConfirmation = "";

  $scope.getUser = () => {
    $http
      .get("http://localhost:3000/api/users/", {
        headers: {
          Authorization: `Bearer ${SessionService.getToken()}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        $scope.name = response.data.name;
        $scope.email = response.data.email;
        $scope.phone = response.data.phone;
      });
  };

  $scope.updateUser = () => {
    const body = {
      name: $scope.name,
      email: $scope.email,
      phone: $scope.phone,
    };
    if ($scope.password) {
      if ($scope.password != $scope.passwordConfirmation) {
        return;
      }
      body.password = $scope.password;
    }
    $http
      .put("http://localhost:3000/api/users/", body, {
        headers: {
          Authorization: `Bearer ${SessionService.getToken()}`,
        },
      })
      .then(
        () => {
          $scope.successMessage = true;
          $scope.errorMessage = false;
        },
        () => {
          $scope.errorMessage = true;
          $scope.successMessage = false;
        }
      );
  };

  $scope.deleteUser = () => {
    $http
      .delete("http://localhost:3000/api/users/", {
        headers: {
          Authorization: "Bearer " + SessionService.getToken(),
        },
      })
      .then(() => {
        SessionService.logout("/end-account");
      });
  };

  $scope.getUser();

  SessionService.verifyLogin();
  SessionService.createVerifyLoginInterval();
});
