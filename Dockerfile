# Use a imagem base do Node.js
FROM node:22

# Defina o diretório de trabalho no container
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências da aplicação
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Gere o Prisma Client e compile o código TypeScript
RUN npx prisma generate && npm run build

# Exponha a porta que a aplicação irá usar
EXPOSE 3000

# Defina o comando para iniciar a aplicação
CMD ["node", "build/server.cjs"]
