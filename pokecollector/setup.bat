@echo off
echo =============================
echo Configurando PokéCollector
echo =============================

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado. Descarga desde https://nodejs.org/
    pause
    exit /b 1
)
echo [SUCCESS] Node.js encontrado

REM ======================
REM Configurar backend
REM ======================
echo [INFO] Configurando backend...

if not exist "pokecollector-backend" mkdir pokecollector-backend
cd pokecollector-backend

if not exist "package.json" npm init -y

echo [INFO] Instalando dependencias del backend...
npm install @prisma/client express cors helmet bcryptjs jsonwebtoken dotenv joi uuid
npm install -D @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/uuid @types/node typescript nodemon ts-node prisma

if not exist ".env" (
    echo [INFO] Creando archivo .env del backend...
    (
        echo DATABASE_URL="file:./dev.db"
        echo JWT_SECRET="pokecollector_super_secret_key_change_in_production_2024"
        echo JWT_EXPIRES_IN="7d"
        echo PORT=3001
        echo NODE_ENV="development"
        echo CORS_ORIGIN="http://localhost:3000"
    ) > .env
)

if exist "prisma\schema.prisma" (
    echo [INFO] Configurando base de datos...
    npx prisma generate
    npx prisma db push
    echo [INFO] Ejecutando seed...
    npm run db:seed
) else (
    echo [WARNING] No se encontró el archivo schema.prisma. Asegúrate de tenerlo listo antes de ejecutar Prisma.
)

cd ..

REM ======================
REM Configurar frontend
REM ======================
echo [INFO] Configurando frontend...

if not exist "frontend" mkdir frontend
cd frontend

if not exist "package.json" npm init -y

echo [INFO] Instalando dependencias del frontend...
npm install react react-dom react-router-dom axios
npm install -D @types/node @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh typescript vite

if not exist ".env" (
    echo [INFO] Creando archivo .env del frontend...
    (
        echo VITE_API_URL=http://localhost:3001/api
        echo VITE_APP_NAME=PokéCollector
        echo VITE_APP_VERSION=1.0.0
        echo VITE_NODE_ENV=development
    ) > .env
)

cd ..

echo.
echo [SUCCESS] Configuración completada
echo =============================
echo PROXIMOS PASOS:
echo =============================
echo 1. Abrir dos terminales.
echo.
echo Terminal 1 - Backend:
echo cd pokecollector-backend
echo npm run dev
echo.
echo Terminal 2 - Frontend:
echo cd frontend
echo npm run dev
echo.
echo Abrir navegador en:
echo http://localhost:3000
echo.
echo Credenciales de prueba:
echo Admin: admin@pokecollector.com / admin123
echo Usuario: ash@pokecollector.com / user123
pause
