# DECRYPTO ERC20 COLLECTOR

Instalar Node 12

Instalar mongodb 4.2

Editar el archivo config.dev.env con los valores correspondientes.

  * Eliminar la clave "DEV" si se corre en producción.
  * El parámetro "DEBUG" imprimirá por consola más información, pero será confuso si se analizan varias wallets a la vez.

Ejecutar "npm install"

Ejecutar "./run initDb [stage]". En consola se verán las public address de las wallets generadas y en la db estarán las claves privadas.


Enviar usdt a algunas wallets y asegurarse que la GAS_WALLET tenga eth. Ejecutar el script con "npm start". Se detectarán las 
wallets con USDT y se les enviará el eth necesario para retirar los USDT. Se imprimiran en consola las TX realizadas.

Una vez confirmadas las TX, volver a ejecutar el script. Se detectarán las wallet con USDT y ETH suficiente para la extracción
y se enviarán los USDT a la USDT_HOT_WALLET_ADDRESS.

## Comandos
- ./run initDb [stage]
- ./run retirarEth [stage]
- ./run retirarUsdt [stage]
- ./run retirarDai [stage]
- ./run printBalances [stage]