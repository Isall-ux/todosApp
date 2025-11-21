# use an official node.js runtime as a parent image
FROM node:22-alpine

# set the working dir in the container
WORKDIR /app

# copy the file from the dependecy into the container
COPY package*.json .

# install the dependency
RUN npm i

# copy the rest of the app code
COPY . .

# expose the port the app runs on
EXPOSE 3000

#  define the command to run the application 
CMD [ "node", "./src/server.js" ]