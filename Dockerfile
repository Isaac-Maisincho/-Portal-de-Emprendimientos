FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY LastestVersion/ ./

EXPOSE 80