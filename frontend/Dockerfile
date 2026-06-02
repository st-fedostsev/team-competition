FROM node:25-bookworm AS builder

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -

COPY . /usr/src/frontend
WORKDIR /usr/src/frontend

RUN /root/.local/share/pnpm/bin/pnpm install
RUN /root/.local/share/pnpm/bin/pnpm run build

FROM nginx:latest AS runner

COPY --chown=nginx:nginx --from=builder /usr/src/frontend/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /run /var/run /var/cache/nginx /var/log/nginx \
    && chown -R nginx:nginx /run /var/run /var/cache/nginx /var/log/nginx

USER nginx

EXPOSE 80

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]