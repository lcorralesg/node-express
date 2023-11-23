FROM node
 LABEL maintainer luis.corrales@tecsup.edu.pe
 RUN git clone https://github.com/lcorralesg/node-express
 WORKDIR /node-express
 RUN npm install
 EXPOSE 3000
 CMD ["npm","run","start"]