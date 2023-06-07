class SearchWidget extends HTMLElement {
  connectedCallback() {
    this.render();

    this.startPointSelect.addEventListener("change", () => {
      this.dispatchEvent(new Event("search"));
      this.clearError();
    });

    this.endPointSelect.addEventListener("change", () => {
      this.dispatchEvent(new Event("search"));
      this.clearError();
    });

    this.dateInput.addEventListener("change", () => {
      this.dispatchEvent(new Event("search"));
      this.clearError();
    });

    this.returnDateInput.addEventListener("change", () => {
      this.dispatchEvent(new Event("search"));
      this.clearError();
    });

    this.searchButton.addEventListener("click", () => {
      if (this.validateFields()) {
        if (this.validateDate()) {
          if (this.validateCities()) {
            this.dispatchEvent(new Event("search"));
            this.clearError();
          } else {
            this.showError("Выберите разные города");
          }
        } else {
          this.showError(
            "Дата приезда больше даты отъезда (или не выбран чекбокс)"
          );
        }
      } else {
        this.showError("Не все поля заполнены");
      }
    });
  }

  render() {
    this.innerHTML = `
    <div class="search-widget">
      <div class="search-widget__wrapper">
        <div class="search-widget__fieldset search-widget__fieldset--select">
          <label class="search-widget__label" for="start-point">Откуда</label>

          <div class="search-widget__select-wrapper">
            <select class="search-widget__select" id="start-point" required>
              <option value="">Выберите город</option>
            </select>
          </div>
        </div>

        <div class="search-widget__fieldset">
          <label class="search-widget__label" for="end-point">Куда</label>

          <div class="search-widget__select-wrapper">
            <select class="search-widget__select" id="end-point" required>
              <option value="">Выберите город</option>
            </select>
          </div>
        </div>

        <div class="search-widget__date-wrapper">
          <div class="search-widget__fieldset">
            <label class="search-widget__label" for="date">Даты</label>
            <input class="search-widget__input search-widget__input--date" type="date" id="date" min="${this.getFormattedDate(
              new Date()
            )}" required>
          </div>

          <div class="search-widget__fieldset">
            <label class="search-widget__label" for="return-date">&nbsp;</label>
            <input class="search-widget__input search-widget__input--return-date" type="date" id="return-date" min="${this.getFormattedDate(
              new Date()
            )}">
          </div>

          <div class="search-widget__one-way-checkbox">
            <input type="checkbox" id="one-way"> Только в одну сторону
          </div>
        </div>
        
       
        
        <button class="search-widget__button" id="search-button">Поиск</button>
        <div class="error-message"></div>
      </div>
    </div>
  `;

    this.startPointSelect = this.querySelector("#start-point");
    this.endPointSelect = this.querySelector("#end-point");
    this.dateInput = this.querySelector("#date");
    this.returnDateInput = this.querySelector("#return-date");
    this.oneWayCheckbox = this.querySelector("#one-way");
    this.searchButton = this.querySelector("#search-button");
    this.errorMessage = this.querySelector(".error-message");

    this.renderCityOptions();
  }

  renderCityOptions() {
    const startPointSelect = this.startPointSelect;
    const endPointSelect = this.endPointSelect;

    const cities = [
      "Москва",
      "Санкт-Петербург",
      "Нью-Йорк",
      "Лондон",
      "Париж",
      "Токио",
      "Берлин",
      "Рим",
      "Мадрид",
      "Пекин",
    ];

    cities.sort();

    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;

      startPointSelect.appendChild(option.cloneNode(true));
      endPointSelect.appendChild(option);
    });
  }

  get cities() {
    return this._cities || [];
  }

  set cities(value) {
    this._cities = value;
    this.renderCityOptions();
  }

  validateFields() {
    const startPoint = this.startPointSelect.value;
    const endPoint = this.endPointSelect.value;
    const date = this.dateInput.value;
    const returnDate = this.returnDateInput.value;

    return startPoint !== "" && endPoint !== "" && date !== "";
  }

  validateDate() {
    const date = new Date(this.dateInput.value);
    const returnDate = new Date(this.returnDateInput.value);
    const oneWay = this.oneWayCheckbox.checked;

    if (oneWay) {
      return true;
    } else {
      return date < returnDate;
    }
  }

  validateCities() {
    const startPoint = this.startPointSelect.value;
    const endPoint = this.endPointSelect.value;

    return startPoint !== endPoint;
  }

  showError(message) {
    this.errorMessage.textContent = message;
  }

  clearError() {
    this.errorMessage.textContent = "";
  }

  getFormattedDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
  }
}

customElements.define("search-widget", SearchWidget);

const widget = document.createElement("search-widget");

widget.addEventListener("search", () => {
  const startPoint = widget.startPointSelect.value;
  const endPoint = widget.endPointSelect.value;
  const date = widget.dateInput.value;
  const returnDate = widget.returnDateInput.value;
  const oneWay = widget.oneWayCheckbox.checked;

  console.log("Поиск:", startPoint, endPoint, date, returnDate, oneWay);
});

// document.body.appendChild(widget);
