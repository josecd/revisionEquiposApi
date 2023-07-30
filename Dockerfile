# # Base image
# FROM node:18-alpine  AS  build

# # Create app directory
# WORKDIR /usr/src/app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# # Install app dependencies
# RUN npm install

# # Bundle app source
# COPY . .

# # Creates a "dist" folder with the production build
# RUN npm run build

# # Start the server using the production build
# CMD [ "node", "dist/main.js" ]

# FROM node:18-alpine

# WORKDIR /usr/src/app

# ARG  NODE_ENV=production

# ENV  NODE_ENV=${NODE_ENV}

# COPY --from=build /usr/src/app/dist .dist

# COPY package*.json ./

# RUN npm install --only=production

# RUN rm package*.json

# EXPOSE 3000

# # CMD npm run start:prod

# CMD [ "node", "dist/main.js" ]

 # @@@@@@@@@@@@@@@@@@@@@@

# FROM node:18-alpine

# WORKDIR /app

# COPY package.json yarn.lock ./
# RUN yarn install --production --frozen-lockfile

# COPY . .

# RUN yarn add @nestjs/cli
# RUN yarn install && yarn build

# # Set environment variables
# ENV NODE_ENV production
# ENV PORT 3000

# # Expose port
# EXPOSE $PORT

# # Start app
# CMD [ "yarn", "run", "start" ]

##@@@@@@@@@@@@@@@@@@@@@@@@@@



###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm i
RUN npm uninstall puppeteer
RUN npm install puppeteer

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm i --only=production && npm cache clean --force

RUN npm uninstall puppeteer
RUN npm install puppeteer
CMD ['find / -name chrome | grep puppeteer | grep -v node_modules']
USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/templates ./templates

CMD [ "node", "dist/main.js" ]