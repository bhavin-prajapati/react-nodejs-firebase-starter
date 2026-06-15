# Firebase Emulator image (Firestore + Auth + Emulator UI)
# Adapted from https://github.com/AndreySenov/firebase-tools-docker
FROM node:lts-trixie-slim

# Pin firebase-tools to a recent stable release.
ARG FIREBASE_TOOLS_VERSION=13.29.1
ENV FIREBASE_TOOLS_VERSION=${FIREBASE_TOOLS_VERSION}
ENV HOME=/home/node

# Firestore emulator + Auth emulator + Emulator UI ports (see CONTRACT.md).
EXPOSE 8081
EXPOSE 9099
EXPOSE 4000

SHELL ["/bin/bash", "-c"]

# Install a headless JRE (required by the Firestore emulator), firebase-tools,
# and pre-download emulator binaries so container start is fast and works
# offline.
RUN apt-get update && \
    apt-get install -y --no-install-recommends default-jre-headless && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g firebase-tools@${FIREBASE_TOOLS_VERSION} && \
    npm cache clean --force && \
    firebase setup:emulators:firestore && \
    firebase -V && \
    java -version && \
    chown -R node:node $HOME

# Emulator configuration.
WORKDIR $HOME
COPY --chown=node:node firebase.json .firebaserc firestore.rules firestore.indexes.json ./

# Run as the unprivileged node user.
USER node

# Start the Firestore + Auth emulators (with the Emulator UI) for project demo-starter.
CMD ["firebase", "emulators:start", "--only", "auth,firestore", "--project", "demo-starter"]
