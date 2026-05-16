FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# For dev we use dev script, for prod we would build
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
