app.controller("TimelinesController", ($scope, $http, SessionService) => {
  $scope.currentTimeline = null;
  $scope.newTimeline = {
    title: "",
  };
  $scope.newPoint = {
    title: "",
    startDate: new Date(),
    startDateAcDc: "DC",
    endDate: new Date(),
    endDateAcDc: "DC",
    color: "red",
    content: "",
  };
  $scope.viewOptions = {
    month: (new Date().getMonth() + 1).toString(),
    startYear: new Date().getFullYear() - 10,
    startAcDc: "DC",
    year: new Date().getFullYear(),
    acDc: "DC",
    type: "day",
  };
  $scope.timelines = [];
  $scope.points = [];
  $scope.pointsHeader = [];
  $scope.rows = [];

  function formatPointsDay() {
    const currentMonth = Number($scope.viewOptions.month);
    const year = $scope.viewOptions.year;
    const month = $scope.viewOptions.month;

    // Corrigido a lógica de filtragem para incluir eventos que abrangem o mês atual
    const pointsThisMonth = $scope.points.filter((point) => {
      const startDate = new Date(point.startDate);
      const endDate = new Date(point.endDate);
      return (
        (startDate.getFullYear() === year &&
          startDate.getMonth() + 1 === currentMonth) ||
        (endDate.getFullYear() === year &&
          endDate.getMonth() + 1 === currentMonth) ||
        (startDate.getFullYear() <= year &&
          endDate.getFullYear() >= year &&
          ((startDate.getMonth() + 1 < currentMonth &&
            endDate.getMonth() + 1 >= currentMonth) ||
            startDate.getMonth() + 1 === currentMonth ||
            endDate.getMonth() + 1 === currentMonth))
      );
    });

    const rows = [];
    for (let row = 0; row < pointsThisMonth.length; row++) {
      rows[row] = [];
      for (let col = 0; col < $scope.pointsHeader.length; col++) {
        const date = new Date(
          `${year}-${month}-${$scope.pointsHeader[col]} 12:00:00`
        );
        let point = pointsThisMonth[row];
        const startDate = new Date(point.startDate);
        const endDate = new Date(point.endDate);
        let start = false;
        let end = false;

        if (
          date.getTime() >= startDate.getTime() &&
          date.getTime() <= endDate.getTime()
        ) {
          if (
            date.getDate() === startDate.getDate() &&
            date.getMonth() === startDate.getMonth() &&
            date.getFullYear() === startDate.getFullYear()
          ) {
            start = true;
          }
          if (
            date.getDate() === endDate.getDate() &&
            date.getMonth() === endDate.getMonth() &&
            date.getFullYear() === endDate.getFullYear()
          ) {
            end = true;
          }
        } else {
          point = null;
        }

        rows[row][col] = {
          date,
          point,
          start,
          end,
        };
        console.log(rows[row][col]);
      }
    }

    $scope.rows = rows;
  }

  function formatPointsMonth() {
    const currentYear = Number($scope.viewOptions.year);
    const pointsThisYear = $scope.points.filter((point) => {
      const startDate = new Date(point.startDate);
      const endDate = new Date(point.endDate);
      if (
        startDate.getFullYear() === currentYear ||
        endDate.getFullYear() === currentYear
      ) {
        return point;
      }
    });

    const rows = [];
    for (let row = 0; row < pointsThisYear.length; row++) {
      rows[row] = [];
      for (let col = 0; col < $scope.pointsHeader.length; col++) {
        const month = $scope.pointsHeader[col];
        const date = new Date(`${currentYear}-${month}-01 00:00:00`);
        let point = pointsThisYear[row];
        const startDate = new Date(point.startDate);
        const endDate = new Date(point.endDate);
        let start = false;
        let end = false;

        if (
          (startDate.getFullYear() < currentYear ||
            (startDate.getFullYear() === currentYear &&
              startDate.getMonth() <= date.getMonth())) &&
          (endDate.getFullYear() > currentYear ||
            (endDate.getFullYear() === currentYear &&
              endDate.getMonth() >= date.getMonth()))
        ) {
          if (
            startDate.getFullYear() === currentYear &&
            startDate.getMonth() === date.getMonth()
          ) {
            start = true;
          }

          if (
            endDate.getFullYear() === currentYear &&
            endDate.getMonth() === date.getMonth()
          ) {
            end = true;
          }
        } else {
          point = null;
        }

        rows[row][col] = {
          date,
          point,
          start,
          end,
        };
      }
    }

    $scope.rows = rows;
  }

  function formatPointsYear() {
    const startYear = Number($scope.viewOptions.startYear);
    const endYear = Number($scope.viewOptions.year);
    const pointsThisPeriod = $scope.points.filter((point) => {
      const startDate = new Date(point.startDate);
      const endDate = new Date(point.endDate);
      return (
        (startDate.getFullYear() >= startYear &&
          startDate.getFullYear() <= endYear) ||
        (endDate.getFullYear() >= startYear &&
          endDate.getFullYear() <= endYear) ||
        (startDate.getFullYear() < startYear &&
          endDate.getFullYear() > endYear) ||
        (startDate.getFullYear() <= endYear &&
          endDate.getFullYear() >= startYear)
      );
    });

    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
    const rows = [];

    for (let row = 0; row < pointsThisPeriod.length; row++) {
      rows[row] = [];
      for (let col = 0; col < years.length; col++) {
        const year = years[col];
        const date = new Date(`${year}-01-01 00:00:00`);
        let point = pointsThisPeriod[row];
        const startDate = new Date(point.startDate);
        const endDate = new Date(point.endDate);
        let start = false;
        let end = false;

        if (startDate.getFullYear() === year) {
          start = true;
        }

        if (endDate.getFullYear() === year) {
          end = true;
        }

        if (startDate.getFullYear() <= year && endDate.getFullYear() >= year) {
          // O ponto está dentro do intervalo para este ano
        } else {
          point = null;
        }

        rows[row][col] = {
          date,
          point,
          start,
          end,
        };
      }
    }

    console.log(rows);
    $scope.rows = rows;
  }

  function formatPoints() {
    $scope.rows = [];
    if ($scope.viewOptions.type === "day") {
      formatPointsDay();
    } else if ($scope.viewOptions.type === "month") {
      formatPointsMonth();
    } else if ($scope.viewOptions.type === "year") {
      formatPointsYear();
    }
  }

  $scope.selectTimeline = (timeline) => {
    $http
      .get(`http://localhost:3000/api/timelines/${timeline.timelineId}`, {
        headers: {
          authorization: `Bearer ${SessionService.getToken()}`,
        },
      })
      .then((response) => {
        $scope.currentTimeline = response.data;
      });
    $http
      .get(`http://localhost:3000/api/points/${timeline.timelineId}`, {
        headers: {
          authorization: `Bearer ${SessionService.getToken()}`,
        },
      })
      .then((response) => {
        $scope.points = response.data;
        formatPoints();
      });
  };

  function getTimelines() {
    $http
      .get(`http://localhost:3000/api/timelines`, {
        headers: {
          authorization: `Bearer ${SessionService.getToken()}`,
        },
      })
      .then((response) => {
        $scope.timelines = response.data;
        if (!$scope.currentTimeline && response.data.length > 0) {
          $scope.selectTimeline(response.data[0]);
        }
      });
  }

  function getPoints() {
    $http
      .get(
        `http://localhost:3000/api/points/${$scope.currentTimeline.timelineId}`,
        {
          headers: {
            authorization: `Bearer ${SessionService.getToken()}`,
          },
        }
      )
      .then((response) => {
        $scope.points = response.data;
        formatPoints();
      });
  }

  $scope.someFilterChange = () => {
    if ($scope.viewOptions.type == "day") {
      const { year, month } = $scope.viewOptions;
      const lastDayDate = new Date(
        `${year}-${month.toString().padStart(2, "0")}-01 00:00:00`
      );
      lastDayDate.setMonth(lastDayDate.getMonth() + 1);
      lastDayDate.setHours(-1);
      const lastDay = lastDayDate.getDate();

      $scope.pointsHeader = [];

      for (let i = 1; i <= lastDay; i++) {
        $scope.pointsHeader.push(i.toString().padStart(2, "0"));
      }
    }
    if ($scope.viewOptions.type == "month") {
      $scope.pointsHeader = [];

      for (let i = 1; i <= 12; i++) {
        $scope.pointsHeader.push(i.toString().padStart(2, "0"));
      }
    }
    if ($scope.viewOptions.type == "year") {
      const { year, startYear } = $scope.viewOptions;
      $scope.pointsHeader = [];

      for (let i = startYear; i <= year; i++) {
        $scope.pointsHeader.push(i.toString());
      }
    }
    if ($scope.viewOptions.type == "decade") {
      const { year, startYear } = $scope.viewOptions;
      $scope.pointsHeader = [];

      for (let i = startYear; i <= year; i += 10) {
        $scope.pointsHeader.push(i.toString());
      }
    }
    if ($scope.viewOptions.type == "century") {
      let { startYear, year } = $scope.viewOptions;
      $scope.pointsHeader = [];
      if (startYear.toString().endsWith("00") || startYear == "0") {
        startYear = Number(startYear) + 1;
      }
      for (let i = startYear; i <= year; i += 100) {
        $scope.pointsHeader.push(Math.ceil(i / 100).toString());
      }
    }
    if ($scope.viewOptions.type == "millennium") {
      let { startYear, year } = $scope.viewOptions;
      $scope.pointsHeader = [];
      for (let i = startYear; i <= year; i += 1000) {
        $scope.pointsHeader.push(Math.ceil(i).toString());
      }
    }
    formatPoints();
  };

  $scope.addTimeline = () => {
    $http
      .post(`http://localhost:3000/api/timelines`, $scope.newTimeline, {
        headers: {
          authorization: `Bearer ${SessionService.getToken()}`,
        },
      })
      .then((response) => {
        $scope.currentTimeline = response.data;
        $scope.newTimeline.title = "";
        getTimelines();
      });
  };

  $scope.deleteTimeline = (timeline) => {
    $http
      .delete(`http://localhost:3000/api/timelines/${timeline.timelineId}`, {
        headers: {
          authorization: `Bearer ${SessionService.getToken()}`,
        },
      })
      .then((response) => {
        if (timeline.timelineId === $scope.currentTimeline.timelineId) {
          $scope.currentTimeline = null;
          getTimelines();
        }
      });
  };

  $scope.updateTimeline = () => {
    $http
      .put(
        `http://localhost:3000/api/timelines/${$scope.currentTimeline.timelineId}`,
        {
          title: $scope.currentTimeline.title,
        },
        {
          headers: {
            authorization: `Bearer ${SessionService.getToken()}`,
          },
        }
      )
      .then((response) => {
        getTimelines();
        $scope.selectTimeline($scope.currentTimeline);
      });
  };

  $scope.addPoint = () => {
    console.log("start1", $scope.newPoint.startDate);
    const startDate =
      $scope.newPoint.startDate.toISOString().substring(0, 11) + "00:00:00";
    const endDate =
      $scope.newPoint.endDate.toISOString().substring(0, 11) + "23:59:59";
    console.log("start2", startDate);
    $http
      .post(
        `http://localhost:3000/api/points/${$scope.currentTimeline.timelineId}`,
        { ...$scope.newPoint, startDate, endDate },
        {
          headers: {
            authorization: `Bearer ${SessionService.getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        $scope.newPoint = {
          title: "",
          startDate: new Date(),
          startDateAcDc: "DC",
          endDate: new Date(),
          endDateAcDc: "DC",
          color: "red",
          content: "",
        };
        getPoints();
      });
  };

  getTimelines();
  $scope.someFilterChange();

  SessionService.verifyLogin();
  SessionService.createVerifyLoginInterval();
});
