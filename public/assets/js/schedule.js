document.addEventListener("DOMContentLoaded", function () {
  const eventForm = document.getElementById("eventForm");
  const eventList = document.getElementById("eventList");
  const eventIdInput = document.getElementById("eventId");
  const titleInput = document.getElementById("title");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const colorInput = document.getElementById("color");
  const sendNotificationInput = document.getElementById("sendNotification");
  const repeatAtInput = document.getElementById("repeatAt");

  // Função para definir a data e hora atual nos campos de data e hora
  function setCurrentDateTime() {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    startDateInput.value = formattedDate;
    endDateInput.value = formattedDate;
  }

  // Função para buscar e exibir eventos
  function fetchEvents() {
    fetch("http://localhost:3000/api/schedules", {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => response.json())
      .then((events) => {
        eventList.innerHTML = "";
        events.forEach((event) => {
          const li = document.createElement("li");
          li.style.borderLeft = `10px solid ${event.color}`;
          li.innerHTML = `
                        <span>
                            <strong>${event.title}</strong>
                            <em>${new Date(
                              event.startDate
                            ).toLocaleString()} - ${new Date(
            event.endDate
          ).toLocaleString()}</em>
                            <span>Notificação: ${
                              event.sendNotification ? "Sim" : "Não"
                            }</span>
                            <span>Repetir Em: ${event.repeatAt}</span>
                        </span>
                        <div>
                            <button class="edit" onclick="editEvent(${
                              event.eventId
                            })">Editar</button>
                            <button onclick="deleteEvent(${
                              event.eventId
                            })">Deletar</button>
                        </div>
                    `;
          eventList.appendChild(li);
        });
      });
  }

  // Função para deletar um evento
  window.deleteEvent = function (eventId) {
    fetch(`http://localhost:3000/api/schedules/${eventId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      fetchEvents();
    });
  };

  // Função para editar um evento
  window.editEvent = function (eventId) {
    fetch(`http://localhost:3000/api/schedules/${eventId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        startDate.setHours(startDate.getHours() - 3);
        endDate.setHours(endDate.getHours() - 3);
        eventIdInput.value = event.eventId;
        titleInput.value = event.title;
        startDateInput.value = startDate.toISOString().slice(0, 16);
        endDateInput.value = endDate.toISOString().slice(0, 16);
        colorInput.value = event.color;
        sendNotificationInput.checked = event.sendNotification === 1;
        repeatAtInput.value = event.repeatAt;
      });
  };

  // Tratando a submissão do formulário para criar ou atualizar um evento
  eventForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const eventId = eventIdInput.value;
    const title = titleInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const color = colorInput.value;
    const sendNotification = sendNotificationInput.checked ? 1 : 0;
    const repeatAt = repeatAtInput.value;

    const event = {
      title,
      startDate,
      endDate,
      color,
      sendNotification,
      repeatAt,
    };

    if (eventId) {
      fetch(`http://localhost:3000/api/schedules/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(event),
      }).then(() => {
        fetchEvents();
      });
    } else {
      fetch("http://localhost:3000/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(event),
      }).then(() => {
        fetchEvents();
      });
    }

    eventForm.reset();
    setCurrentDateTime();
  });

  // Definir data e hora atuais ao carregar a página e buscar eventos
  setCurrentDateTime();
  fetchEvents();
});
