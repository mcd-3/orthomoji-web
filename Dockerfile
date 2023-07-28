FROM node:18.17.0

WORKDIR /usr/src/app

COPY . .

# ENV Variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm i
RUN npm run build

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]