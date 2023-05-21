# Step 1: Build the app in node container
FROM node:14.21.3-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY . .

RUN npm run build --prod

RUN

# Step 2: Serve app with nginx server
FROM nginx:1.19.5-alpine

COPY --from=build /app/dist/angular-charts-app /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
