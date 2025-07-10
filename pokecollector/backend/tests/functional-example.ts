// tests/functional-example.ts
/**
 * PRUEBAS FUNCIONALES DE EJEMPLO
 * 
 * Estas son pruebas manuales que puedes ejecutar para verificar 
 * que el sistema funciona correctamente. En un entorno real,
 * estas se automatizarían con Jest/Mocha.
 */

// ===================================================================
// PRUEBA FUNCIONAL 1: GESTIÓN DE USUARIOS Y AUTENTICACIÓN
// ===================================================================

/**
 * OBJETIVO: Verificar que el sistema de autenticación funciona correctamente
 * 
 * CASOS DE PRUEBA:
 * 1. Registrar nuevo usuario
 * 2. Iniciar sesión con credenciales válidas
 * 3. Acceder a endpoint protegido con token válido
 * 4. Intentar acceder sin token (debe fallar)
 * 5. Actualizar perfil de usuario
 */

const TEST_1_USER_AUTHENTICATION = {
  title: "Gestión de Usuarios y Autenticación",
  
  async execute() {
    console.log("🧪 PRUEBA FUNCIONAL 1: Gestión de Usuarios y Autenticación");
    console.log("=" .repeat(60));
    
    const baseUrl = 'http://localhost:3001/api';
    
    try {
      // PASO 1: Registrar nuevo usuario
      console.log("\n📝 PASO 1: Registrando nuevo usuario...");
      const registerResponse = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'test_trainer',
          email: 'test@pokecollector.com',
          password: 'test123456'
        })
      });
      
      const registerData = await registerResponse.json();
      console.log("✅ Registro exitoso:", registerData.success);
      
      // PASO 2: Iniciar sesión
      console.log("\n🔐 PASO 2: Iniciando sesión...");
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@pokecollector.com',
          password: 'test123456'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log("✅ Login exitoso:", loginData.success);
      const token = loginData.data.token;
      
      // PASO 3: Acceder a endpoint protegido
      console.log("\n🔒 PASO 3: Accediendo a perfil (endpoint protegido)...");
      const profileResponse = await fetch(`${baseUrl}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const profileData = await profileResponse.json();
      console.log("✅ Perfil obtenido:", profileData.success);
      console.log("👤 Usuario:", profileData.data.username);
      
      // PASO 4: Intentar acceso sin token
      console.log("\n🚫 PASO 4: Intentando acceso sin token (debe fallar)...");
      const noTokenResponse = await fetch(`${baseUrl}/users/profile`);
      const noTokenData = await noTokenResponse.json();
      console.log("✅ Acceso denegado correctamente:", !noTokenData.success);
      
      // PASO 5: Actualizar perfil
      console.log("\n✏️ PASO 5: Actualizando perfil...");
      const updateResponse = await fetch(`${baseUrl}/users/profile`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'test_trainer_updated'
        })
      });
      
      const updateData = await updateResponse.json();
      console.log("✅ Perfil actualizado:", updateData.success);
      console.log("👤 Nuevo username:", updateData.data.username);
      
      console.log("\n🎉 PRUEBA 1 COMPLETADA EXITOSAMENTE");
      
    } catch (error) {
      console.error("❌ Error en la prueba:", error);
    }
  }
};

// ===================================================================
// PRUEBA FUNCIONAL 2: GESTIÓN DE COLECCIÓN DE CARTAS
// ===================================================================

/**
 * OBJETIVO: Verificar que la gestión de colecciones funciona correctamente
 * 
 * CASOS DE PRUEBA:
 * 1. Listar álbumes disponibles
 * 2. Obtener cartas de un álbum específico
 * 3. Agregar carta a la colección del usuario
 * 4. Ver colección personal
 * 5. Actualizar cantidad de una carta
 * 6. Ver ranking de usuarios
 */

const TEST_2_CARD_COLLECTION = {
  title: "Gestión de Colección de Cartas",
  
  async execute() {
    console.log("\n🧪 PRUEBA FUNCIONAL 2: Gestión de Colección de Cartas");
    console.log("=" .repeat(60));
    
    const baseUrl = 'http://localhost:3001/api';
    
    try {
      // Login con usuario de prueba
      console.log("\n🔐 Iniciando sesión con usuario existente...");
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'ash@pokecollector.com',
          password: 'user123'
        })
      });
      
      const loginData = await loginResponse.json();
      const token = loginData.data.token;
      console.log("✅ Login exitoso como:", loginData.data.user.username);
      
      // PASO 1: Listar álbumes
      console.log("\n📚 PASO 1: Obteniendo lista de álbumes...");
      const albumsResponse = await fetch(`${baseUrl}/albums`);
      const albumsData = await albumsResponse.json();
      console.log("✅ Álbumes obtenidos:", albumsData.data.length);
      
      const firstAlbum = albumsData.data[0];
      console.log("📖 Primer álbum:", firstAlbum.name, "- Generación", firstAlbum.generation);
      
      // PASO 2: Obtener cartas del álbum
      console.log("\n🃏 PASO 2: Obteniendo cartas del álbum...");
      const cardsResponse = await fetch(`${baseUrl}/cards/album/${firstAlbum.id}`);
      const cardsData = await cardsResponse.json();
      console.log("✅ Cartas obtenidas:", cardsData.data.length);
      
      const firstCard = cardsData.data[0];
      console.log("🎴 Primera carta:", firstCard.name, "- Rareza:", firstCard.rarity);
      
      // PASO 3: Agregar carta a colección
      console.log("\n➕ PASO 3: Agregando carta a la colección...");
      const addCardResponse = await fetch(`${baseUrl}/cards/collection`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardId: firstCard.id,
          quantity: 2
        })
      });
      
      const addCardData = await addCardResponse.json();
      console.log("✅ Carta agregada:", addCardData.success);
      
      // PASO 4: Ver colección personal
      console.log("\n🎒 PASO 4: Obteniendo colección personal...");
      const collectionResponse = await fetch(`${baseUrl}/cards/collection/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const collectionData = await collectionResponse.json();
      console.log("✅ Colección obtenida:", collectionData.data.length, "cartas");
      
      // PASO 5: Obtener estadísticas del usuario
      console.log("\n📊 PASO 5: Obteniendo estadísticas del usuario...");
      const statsResponse = await fetch(`${baseUrl}/users/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const statsData = await statsResponse.json();
      console.log("✅ Estadísticas obtenidas:");
      console.log("   - Cartas totales:", statsData.data.totalCards);
      console.log("   - Cartas únicas:", statsData.data.uniqueCards);
      console.log("   - Completación:", statsData.data.completionPercentage + "%");
      
      // PASO 6: Ver ranking
      console.log("\n🏆 PASO 6: Obteniendo ranking de usuarios...");
      const rankingResponse = await fetch(`${baseUrl}/users/ranking`);
      const rankingData = await rankingResponse.json();
      console.log("✅ Ranking obtenido:", rankingData.data.length, "usuarios");
      
      console.log("🥇 Top 3:");
      rankingData.data.slice(0, 3).forEach((user: any, index: number) => {
        console.log(`   ${index + 1}. ${user.username} - ${user.completionPercentage}% completado`);
      });
      
      console.log("\n🎉 PRUEBA 2 COMPLETADA EXITOSAMENTE");
      
    } catch (error) {
      console.error("❌ Error en la prueba:", error);
    }
  }
};

// ===================================================================
// FUNCIONES DE UTILIDAD PARA EJECUTAR PRUEBAS
// ===================================================================

/**
 * Ejecutar todas las pruebas funcionales
 */
async function runAllFunctionalTests() {
  console.log("🚀 INICIANDO PRUEBAS FUNCIONALES DEL SISTEMA");
  console.log("=" .repeat(80));
  
  try {
    await TEST_1_USER_AUTHENTICATION.execute();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa de 1 segundo
    await TEST_2_CARD_COLLECTION.execute();
    
    console.log("\n" + "=" .repeat(80));
    console.log("🎉 TODAS LAS PRUEBAS FUNCIONALES COMPLETADAS EXITOSAMENTE");
    console.log("=" .repeat(80));
    
  } catch (error) {
    console.error("❌ Error ejecutando las pruebas:", error);
  }
}

/**
 * Ejecutar una prueba específica
 */
async function runSpecificTest(testNumber: number) {
  switch (testNumber) {
    case 1:
      await TEST_1_USER_AUTHENTICATION.execute();
      break;
    case 2:
      await TEST_2_CARD_COLLECTION.execute();
      break;
    default:
      console.log("❌ Número de prueba inválido. Usa 1 o 2.");
  }
}

// ===================================================================
// INSTRUCCIONES DE USO
// ===================================================================

/**
 * CÓMO EJECUTAR ESTAS PRUEBAS:
 * 
 * 1. Asegúrate de que el servidor esté corriendo en http://localhost:3001
 * 2. Ejecuta el seed para tener datos de prueba: npm run db:seed
 * 3. Copia este código en un archivo .ts o .js
 * 4. Ejecuta con: ts-node tests/functional-example.ts
 * 
 * O ejecuta las funciones individualmente:
 * - runAllFunctionalTests() - Ejecutar todas las pruebas
 * - runSpecificTest(1) - Solo la prueba de autenticación
 * - runSpecificTest(2) - Solo la prueba de colección
 */

// Exportar para uso externo
export {
  TEST_1_USER_AUTHENTICATION,
  TEST_2_CARD_COLLECTION,
  runAllFunctionalTests,
  runSpecificTest
};

// Ejecutar todas las pruebas si este archivo se ejecuta directamente
if (require.main === module) {
  runAllFunctionalTests();
}