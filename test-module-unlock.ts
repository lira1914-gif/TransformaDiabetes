// Test script para verificar sistema de desbloqueo de módulos

async function testModuleUnlockSystem() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🧪 INICIANDO TESTS DEL SISTEMA DE MÓDULOS\n');
  
  // 1. Crear usuario de prueba con fecha de hace 35 días
  console.log('1️⃣ Creando usuario de prueba...');
  const thirtyFiveDaysAgo = new Date();
  thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);
  
  const testEmail = `test-module-${Date.now()}@example.com`;
  const createUserRes = await fetch(`${baseUrl}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      stripeCustomerId: 'cus_test_123',
      stripeSubscriptionId: 'sub_test_123'
    })
  });
  
  const user = await createUserRes.json();
  console.log(`✅ Usuario creado: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Módulos desbloqueados: ${JSON.stringify(user.unlockedModules)}`);
  console.log(`   Fecha suscripción: ${user.subscriptionStartDate}\n`);
  
  // 2. Actualizar fecha de suscripción manualmente en BD para simular 35 días atrás
  console.log('2️⃣ Actualizando fecha de suscripción a 35 días atrás...');
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL!);
  
  await sql`
    UPDATE users 
    SET subscription_start_date = ${thirtyFiveDaysAgo.toISOString()}
    WHERE id = ${user.id}
  `;
  console.log(`✅ Fecha actualizada a: ${thirtyFiveDaysAgo.toISOString()}\n`);
  
  // 3. Verificar endpoint de módulos
  console.log('3️⃣ Verificando endpoint /api/modules/check/:userId...');
  const checkModulesRes = await fetch(`${baseUrl}/api/modules/check/${user.id}`);
  const modulesData = await checkModulesRes.json();
  
  console.log(`   Status: ${checkModulesRes.status}`);
  console.log(`   Módulos desbloqueados: ${JSON.stringify(modulesData.unlockedModules)}`);
  console.log(`   Módulos nuevos: ${JSON.stringify(modulesData.newlyUnlocked)}`);
  console.log(`   Mensaje: ${modulesData.message || 'ninguno'}\n`);
  
  // Verificar que Módulo 2 se desbloqueó
  if (modulesData.unlockedModules.includes(1) && modulesData.unlockedModules.includes(2)) {
    console.log('✅ TEST PASADO: Módulo 1 y 2 desbloqueados correctamente\n');
  } else {
    console.log('❌ TEST FALLIDO: Se esperaba Módulo 1 y 2 desbloqueados\n');
    return;
  }
  
  // 4. Intentar generar reporte de Módulo 1 (debería funcionar)
  console.log('4️⃣ Intentando generar reporte de Módulo 1 (acceso permitido)...');
  const module1Res = await fetch(`${baseUrl}/api/generate-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      moduleNumber: 1
    })
  });
  
  console.log(`   Status: ${module1Res.status}`);
  if (module1Res.status === 404) {
    const error = await module1Res.json();
    console.log(`   ℹ️ Esperado (no hay intake form): ${error.error}\n`);
  } else if (module1Res.status === 200) {
    console.log('   ✅ Acceso permitido a Módulo 1\n');
  } else {
    console.log(`   ❌ Error inesperado: ${module1Res.status}\n`);
  }
  
  // 5. Intentar generar reporte de Módulo 3 (debería fallar)
  console.log('5️⃣ Intentando generar reporte de Módulo 3 (acceso denegado)...');
  const module3Res = await fetch(`${baseUrl}/api/generate-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      moduleNumber: 3
    })
  });
  
  const module3Data = await module3Res.json();
  console.log(`   Status: ${module3Res.status}`);
  console.log(`   Mensaje: ${module3Data.message || module3Data.error}`);
  
  if (module3Res.status === 403) {
    console.log('   ✅ TEST PASADO: Acceso denegado correctamente a Módulo 3\n');
  } else {
    console.log('   ❌ TEST FALLIDO: Se esperaba status 403\n');
    return;
  }
  
  // 6. Crear usuario con fecha reciente (solo debería tener Módulo 1)
  console.log('6️⃣ Creando usuario reciente (solo Módulo 1)...');
  const recentEmail = `test-recent-${Date.now()}@example.com`;
  const recentUserRes = await fetch(`${baseUrl}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: recentEmail,
      stripeCustomerId: 'cus_test_456',
      stripeSubscriptionId: 'sub_test_456'
    })
  });
  
  const recentUser = await recentUserRes.json();
  console.log(`   Usuario creado: ${recentUser.id}`);
  console.log(`   Módulos desbloqueados: ${JSON.stringify(recentUser.unlockedModules)}`);
  
  // Verificar módulos del usuario reciente
  const recentCheckRes = await fetch(`${baseUrl}/api/modules/check/${recentUser.id}`);
  const recentModulesData = await recentCheckRes.json();
  
  console.log(`   Módulos después de check: ${JSON.stringify(recentModulesData.unlockedModules)}`);
  
  if (recentModulesData.unlockedModules.length === 1 && recentModulesData.unlockedModules.includes(1)) {
    console.log('   ✅ TEST PASADO: Usuario reciente solo tiene Módulo 1\n');
  } else {
    console.log('   ❌ TEST FALLIDO: Se esperaba solo Módulo 1\n');
    return;
  }
  
  console.log('🎉 TODOS LOS TESTS PASARON EXITOSAMENTE');
}

testModuleUnlockSystem().catch(console.error);
