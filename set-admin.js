const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function run() { 
  const emails = [
    'rehansuman41008@gmail.com', 
    'rehansumen41008@gmail.com', 
    'rehansumen41008@gamil.com'
  ]; 
  
  for (const email of emails) { 
    const user = await prisma.user.findUnique({ where: { email } }); 
    if (user) { 
      await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } }); 
      console.log('Made admin:', email); 
    } else { 
      console.log('Not found in database:', email); 
    } 
  } 
} 

run().catch(console.error).finally(() => prisma.$disconnect());
