from flask import Flask, jsonify
from bs4 import BeautifulSoup
import requests
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Это позволяет всем источникам отправлять запросы к вашему API.


# Определение функции save_to_json для сохранения данных в JSON-файл
def save_to_json(data, filename):
    with open(filename, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

# Функция для парсинга данных с сайта МТС
def parse_mts_tariffs():
    url = "https://moskva.mts.ru/personal/mobilnaya-svyaz/tarifi/vse-tarifi/mobile-tv-inet"
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        tariffs = []

        # Находим все карточки с тарифами
        tariff_cards = soup.find_all("div", class_="card card__wrapper")

        for card in tariff_cards:
            tariff = {}
            title_elem = card.find("div", class_="card-title")
            description_elem = card.find("div", class_="card-description")
            price_elem = card.find("span", class_="price-text")

            # Добавляем данные о характеристиках из компонента <mts-universal-card-features>
            features_elem = card.find("ul", class_="features" )
            if features_elem:
                features = []
                
                # Извлекаем все элементы <li> с классом "feature__wrapper"
                feature_items = features_elem.find_all("li", class_="feature__wrapper")
                
                for item in feature_items:
                    # Извлекаем текст из элемента <span> с классом "feature-description__text"
                    feature_text = item.find("span", class_="feature-description")
                    if feature_text:
                        features.append(feature_text.text.strip())
                
                tariff["features"] = features


            # Проверяем наличие элементов перед извлечением данных
            if title_elem:
                tariff["title"] = title_elem.text.strip()
            else:
                tariff["title"] = "Нет данных"

            if description_elem:
                tariff["description"] = description_elem.text.strip()
            else:
                tariff["description"] = "Нет данных"

            if price_elem:
                tariff["price"] = price_elem.text.strip()
            else:
                tariff["price"] = "Нет данных"

            # Добавляем данные в список тарифов
            tariffs.append(tariff)

        return tariffs
    else:
        print("Failed to retrieve data from the website.")
        return None

# Роут для получения данных о тарифах
@app.route("/get_tariffs", methods=["GET"])
def get_tariffs():
    try:
        with open("mts_tariffs.json", "r", encoding="utf-8") as json_file:
            data = json.load(json_file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify([])

# Роут для парсинга и обновления данных о тарифах
@app.route("/parse_tariffs", methods=["GET"])
def parse_and_update_tariffs():
    tariffs_data = parse_mts_tariffs()
    
    if tariffs_data:
        save_to_json(tariffs_data, "mts_tariffs.json")
        return jsonify({"message": "Data has been successfully parsed and updated."})
    else:
        return jsonify({"message": "Failed to parse and update data."})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
