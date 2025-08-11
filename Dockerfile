# USE official Node.js image
FROM Bnode:18-alpine

#Create app directory
WORKDIR /app

#Install dependencies
COPY package*.json ./
RUN npm Install

#Copy APP SOURCE
COPY . .

#Build if there is build step
RUN npm run build

#Expose port
EXPOSE 3000

#Start app
CMD ["npm", "Start"]