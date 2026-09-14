FROM node:24-slim AS development

WORKDIR /app

# tauri system dependencies
RUN apt update && \
  apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev \
  libssl-dev libayatana-appindicator3-dev librsvg2-dev && \
  rm -rf /var/lib/apt/lists/*

# install rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# add executable bin names to image PATH env variable
# so we can call them without using their entire path
ENV PATH="/root/.cargo/bin:${PATH}"

RUN npm i -g vite

COPY package*.json                            ./
COPY packages/web/package*.json               ./packages/web/
COPY packages/native/package*.json            ./packages/native/
COPY packages/icons/package*.json             ./packages/icons/
COPY packages/core/package*.json              ./packages/core/
COPY packages/cli/package*.json               ./packages/cli/
COPY packages/desktop/package*.json           ./packages/desktop/
COPY packages/server-template/package*.json   ./packages/server-template/

RUN npm i

COPY packages/web/              ./packages/web/
COPY packages/native/           ./packages/native/
COPY packages/icons/            ./packages/icons/
COPY packages/core/             ./packages/core/
COPY packages/cli/              ./packages/cli/
COPY packages/desktop/          ./packages/desktop/
COPY packages/server-template/  ./packages/server-template/
