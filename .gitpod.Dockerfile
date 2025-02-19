
FROM gitpod/workspace-full

# Install Node.js LTS
RUN bash -c 'source $HOME/.nvm/nvm.sh && nvm install --lts'

# Install global npm packages
RUN npm install -g npm@latest

# Install required system packages
RUN sudo apt-get update && sudo apt-get install -y \
    build-essential \
    python3 \
    && sudo rm -rf /var/lib/apt/lists/*

