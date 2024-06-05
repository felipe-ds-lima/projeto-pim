app.service("SessionService", function () {
  this.isAuthenticated = () => {
    const user = this.getUser();
    const token = this.getToken();

    if (!token || !user || !user.userId) {
      return false;
    }
    if (Date.now() > user.exp * 1000) {
      return false;
    }

    return true;
  };

  this.getUser = () => {
    const token = this.getToken();
    if (!token) {
      return {};
    }

    const user = jwtDecode(token);
    return user;
  };

  this.getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  this.logout = (redirectTo) => {
    localStorage.removeItem("token");
    location.href = redirectTo || "/login";
  };

  this.verifyLogin = () => {
    if (!this.isAuthenticated()) {
      this.logout();
    }
  };

  this.createVerifyLoginInterval = () => {
    setInterval(this.verifyLogin, 10000);
  };
});
