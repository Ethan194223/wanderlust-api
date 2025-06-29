import prisma from '../src/lib/prisma';

(async () => {
  console.log(
    '🛠️  Prisma models available:\n',
    Object.keys(prisma).filter(k => !k.startsWith('_')),
  );

  await prisma.$disconnect();           // tidy exit
})();
