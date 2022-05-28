# 🚗 RentX API

## ⚙️ Installing

### 🐋 With Docker
Clone the project
```
https://github.com/DarknessNinjaBR/RentX.git
```
inside the project folder, run
```
docker-compose build
```
after that
```
docker-compose up
```
and
```
yarn typeorm migration:run
```
Enjoy!

&nbsp;


### 🚫 Without Docker
Clone the project
```
https://github.com/DarknessNinjaBR/RentX.git
```
inside the project folder, run
```
yarn
```
create a PostgreSQL database called:
```
rentx
```
after that, run the migrations
```
yarn typeorm migration:run
```
start the application
```
yarn dev
```
Enjoy!

