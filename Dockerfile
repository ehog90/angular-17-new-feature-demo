FROM nginx:1.25.4-alpine as host

WORKDIR /app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 420
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]

