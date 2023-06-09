# Base image
FROM node:18-alpine  AS  build

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

FROM node:18-alpine

WORKDIR /usr/src/app

ARG  NODE_ENV=production

ENV  NODE_ENV=${NODE_ENV}

COPY --from=build /usr/src/app/dist .dist

COPY package*.json ./

RUN npm install --only=production

RUN rm package*.json

EXPOSE 3000

# CMD npm run start:prod

CMD [ "node", "dist/main.js" ]