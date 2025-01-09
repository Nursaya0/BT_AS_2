module.exports = {
  networks: {
      development: {
          host: "127.0.0.1",     // Localhost (default: none)
          port: 7545,            // Ganache GUI порт
          network_id: "5777",       // Любая сеть (default: none)
      },
  },
  compilers: {
      solc: {
          version: "0.8.0",      // Укажите версию вашего компилятора
      },
  },
};
