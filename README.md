# Парсер данных о тарифах с сайта MTS

### Запустить бек

    #### Активировать окружение

    `cd mts-tariffs-backend`

    `python -m venv env`

    `source env/bin/activate`  # Для macOS и Linux

    `env\Scripts\activate`  # Для Windows

`pip install -r requirements.txt`

`python app.py`

### Запустить фронт

`cd ..`

`сd mts-tariffs-frontend`

`npm i`

`npm run start`

## Вводная

 Домашний сайт mts.ru

 Тарифы: https://[moskva.mts.ru/personal/mobilnaya-svyaz/tarifi/vse-tarifi/mobile-tv-inet]
 
 Интернет Магазин: https://shop.mts.ru/

 Мобильные приложения Мой МТС, МТС Строки, Кион, итп (AppStore, Google Play, AppBazar
и тп)

## Задание

1. Напишите парсер(бекенд) всех публичных тарифов МТС (связь интернет, тв) по ссылке
«Тарифы» выше по их параметрам, опциями, ценам и агрегируй в любое хранилище (от
файлика до любой БД) или же табличное представление.
2. Реализуйте фронт, отображающий результаты, имеющиеся в хранилище и кнопку
«Парсить», запускающую процесс обновления данных.
3. Фронт по возможности должен уметь выводить результаты парсинга с фильтрами и
сортировкой. В идеале и он должен позволять подобрать себе нужный тариф удобным
способом.
4. Ваше решение может быть любым по уровню исполнения от просто статического html до
решения на React/Vue/итд - нам интересны все варианты!
5. Эталонным будет решение развренутое где-либо в сети Интернет и ссылка на репозиторий
в github, содержащая код всех компонентов решения.
