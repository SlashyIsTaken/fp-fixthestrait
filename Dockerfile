FROM nginx:alpine

COPY website/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf