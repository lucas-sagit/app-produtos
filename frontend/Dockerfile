FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4200

# Use npx to run ng serve with host 0.0.0.0
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
