import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./TariffsParser.module.scss";

const TariffsParser = () => {
  const [tariffs, setTariffs] = useState([]);
  const [filterDescription, setFilterDescription] = useState(""); // Стейт для хранения значения фильтра по описанию
  const [sortByPriceAsc, setSortByPriceAsc] = useState(true); // Стейт для сортировки по цене

  // Функция для загрузки данных о тарифах
  const fetchTariffs = () => {
    axios
      .get("http://127.0.0.1:5000/get_tariffs")
      .then((response) => {
        setTariffs(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Функция для обработки клика на кнопку "Парсить"
  const handleParseClick = () => {
    // Вызываем API-эндпоинт для парсинга данных
    axios
      .get("http://127.0.0.1:5000/parse_tariffs")
      .then((response) => {
        // Обновляем состояние данных после парсинга
        fetchTariffs();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Функция для фильтрации тарифов по описанию
  const filterTariffsByDescription = () => {
    if (!filterDescription) {
      // Если значение фильтра пустое, возвращаем все тарифы
      return tariffs;
    }
    // Иначе фильтруем тарифы по описанию
    return tariffs.filter((tariff) =>
      tariff.description.toLowerCase().includes(filterDescription.toLowerCase())
    );
  };

  // Функция для сортировки тарифов по цене
  const sortTariffsByPrice = (filteredTariffs) => {
    if (sortByPriceAsc) {
      // Сортировка по возрастанию
      return filteredTariffs.slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else {
      // Сортировка по убыванию
      return filteredTariffs.slice().sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
  };

  // Обработчик изменения значения фильтра по описанию
  const handleFilterDescriptionChange = (event) => {
    setFilterDescription(event.target.value);
  };

  // Обработчик клика по кнопке сортировки
  const handleSortClick = () => {
    setSortByPriceAsc(!sortByPriceAsc);
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchTariffs();
  }, []);

  return (
    <div className={classes.tariffsParser}>
      <h1>Тарифы МТС</h1>
      <div>
        <label htmlFor="filterDescription">Фильтр по описанию:</label>
        <input
          style={{margin: "0 0 10px 10px"}}
          type="text"
          id="filterDescription"
          value={filterDescription}
          onChange={handleFilterDescriptionChange}
        />
      </div>
      <button
        onClick={handleParseClick}
        className={classes.tariffsParser__button}
      >
        Парсить
      </button>
      <button
        onClick={handleSortClick}
        className={classes.tariffsParser__button}
      >
        {sortByPriceAsc ? "Сортировать по убыванию цены" : "Сортировать по возрастанию цены"}
      </button>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Цена</th>
            <th>Включено</th>
          </tr>
        </thead>
        <tbody>
          {sortTariffsByPrice(filterTariffsByDescription()).map((tariff, index) => (
            <tr key={index}>
              <td>{tariff.title}</td>
              <td>{tariff.description}</td>
              <td>{tariff.price}</td>
              <td>
                {tariff.features ? (
                  <ul>
                    {tariff.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  "Нет данных"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TariffsParser;
