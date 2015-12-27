FROM node
ADD src /usr/src/app
WORKDIR /usr/src/app
EXPOSE 80
RUN npm install
CMD ["node", "index.js"]
