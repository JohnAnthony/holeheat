FROM node
MAINTAINER John Anthony
RUN mkdir /var/www
WORKDIR /var/www
COPY package.json .
RUN npm install --production
COPY server.js .
CMD ["node", "server.js"] 
