# Copyright (C) 2021 Edge Network Technologies Ltd
# Use of this source code is governed by a GNU GPL-style license
# that can be found in the LICENSE.md file. All rights reserved.

#
# 1. Build the Vue app
#
FROM node:lts AS build
MAINTAINER Adam K Dean <adam@edge.network>

ARG BLOCKCHAIN_API_URL
ARG INDEX_API_URL
ARG IS_TESTNET
ARG GOVERNANCE_URL
ENV VITE_BLOCKCHAIN_API_URL=$BLOCKCHAIN_API_URL
ENV VITE_INDEX_API_URL=$INDEX_API_URL
ENV VITE_GOVERNANCE_URL=$GOVERNANCE_URL
ENV VITE_IS_TESTNET=$IS_TESTNET

COPY *.config.js ./
COPY package*.json ./
RUN npm install

COPY src src/
COPY public public/
RUN npm run build

#
# 2. Copy the files over and run it
#
FROM node:lts
MAINTAINER Adam K Dean <adam@edge.network>

WORKDIR /edge/xe-explorer

COPY package*.json ./
RUN npm install --only=production

COPY server server/
COPY --from=build dist dist/

CMD ["npm", "start"]
