# 📡 Configuración de Red - SPOT

## Red Actual: **TESTNET**

La aplicación está configurada para usar **Stellar Testnet**, que es una red pública de prueba donde puedes probar la aplicación sin necesidad de un servidor local.

### Configuración Actual (.env)

```
PUBLIC_STELLAR_NETWORK=TESTNET
PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

## 🔄 Cambiar a Otra Red

### Para usar FUTURENET:
1. Edita el archivo `.env`
2. Comenta la configuración de TESTNET
3. Descomenta y usa la configuración de FUTURENET:

```env
PUBLIC_STELLAR_NETWORK=FUTURENET
PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Future Network ; October 2022
PUBLIC_STELLAR_RPC_URL=https://rpc-futurenet.stellar.org
PUBLIC_STELLAR_HORIZON_URL=https://horizon-futurenet.stellar.org
```

### Para usar LOCAL (requiere servidor local):
1. Necesitas tener un Horizon local corriendo en `http://localhost:8000`
2. Edita el archivo `.env` y cambia a LOCAL
3. Asegúrate de tener el servidor corriendo antes de iniciar la app

### Para usar MAINNET (producción):
- ⚠️ Solo para producción
- Requiere configuración adicional de seguridad

## 📝 Notas

- **Después de cambiar el `.env`, necesitas reiniciar el servidor de desarrollo** (`npm run dev`)
- Las redes públicas (TESTNET, FUTURENET, MAINNET) no requieren servidor local
- Para desarrollo, recomendamos TESTNET o FUTURENET

