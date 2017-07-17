FROM node
MAINTAINER John Anthony
RUN mkdir /var/www
WORKDIR /var/www
COPY package.json .
RUN npm install --production
COPY css/ css/
COPY js/ js/
COPY views/ views/
COPY server.js .
CMD ["node", "server.js"] 
