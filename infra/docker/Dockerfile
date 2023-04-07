FROM node:18.7.0-alpine as BUILDER

WORKDIR /appPlugin
COPY . .
RUN npm install --prod

FROM node:18.7.0-alpine
WORKDIR /appPlugin
COPY --from=BUILDER /app .

# Here you can copy all additional data and commands to be added to image
# For example: configuration for crontabs:
# COPY crontabs/busybox.conf /etc/busybox.conf
# RUN chmod 600 /etc/busybox.conf

ENV DB_HOST=db

ENV PORT=8000
EXPOSE 8000

CMD [ "npm", "start"]