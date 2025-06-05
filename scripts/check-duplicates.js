// script para verificar dados duplicados que podem causar problemas com índices únicos
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findDuplicates() {
  console.log('Verificando dados duplicados que podem causar problemas com índices únicos...');
  
  // Verificar estudantes
  console.log('\n=== Estudantes ===');
  await checkDuplicates('student', 'email');
  await checkDuplicates('student', 'cpf');
  await checkDuplicates('student', 'registration');
  
  // Verificar professores
  console.log('\n=== Professores ===');
  await checkDuplicates('teacher', 'email');
  await checkDuplicates('teacher', 'cpf');
  await checkDuplicates('teacher', 'registration');
  
  // Verificar secretários
  console.log('\n=== Secretários ===');
  await checkDuplicates('secretary', 'email');
  await checkDuplicates('secretary', 'cpf');
  
  // Verificar tutores
  console.log('\n=== Tutores ===');
  await checkDuplicates('tutor', 'email');
  await checkDuplicates('tutor', 'cpf');
  await checkDuplicates('tutor', 'sequence');
  
  // Verificar animais
  console.log('\n=== Animais ===');
  await checkDuplicates('animal', 'sequence');
  
  console.log('\nVerificação concluída.');
}

async function checkDuplicates(model, field) {
  try {
    // Ignorar campos nulos ou vazios
    const result = await prisma.$queryRaw`
      SELECT ${field}, COUNT(*) as count
      FROM ${model}s
      WHERE ${field} IS NOT NULL AND ${field} <> ''
      GROUP BY ${field}
      HAVING COUNT(*) > 1
    `;
    
    if (result.length > 0) {
      console.log(`\nEncontrado(s) ${result.length} valor(es) duplicado(s) no campo '${field}' do modelo '${model}':`);
      result.forEach(dup => {
        console.log(`- ${field}: "${dup[field]}" (${dup.count} ocorrências)`);
      });
    } else {
      console.log(`✓ Nenhuma duplicata encontrada no campo '${field}' do modelo '${model}'`);
    }
  } catch (error) {
    console.error(`Erro ao verificar duplicatas em '${model}.${field}':`, error.message);
  }
}

// Executar a função e fechar o cliente Prisma após a conclusão
findDuplicates()
  .catch(e => {
    console.error('Erro durante a verificação:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
