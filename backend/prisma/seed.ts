import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const characters = [
    {
      id: 'dino',
      name: 'Dino',
      personality: 'Curious, funny and energetic',
      topics: 'Animals, nature and simple questions',
      modelAssetPath: 'assets/characters/dino',
      isActive: true,
    },
    {
      id: 'robo',
      name: 'Robo',
      personality: 'Smart, friendly and helpful',
      topics: 'Numbers, colours, shapes and basic concepts',
      modelAssetPath: 'assets/characters/robo',
      isActive: true,
    },
    {
      id: 'bunny',
      name: 'Bunny',
      personality: 'Gentle, caring and playful',
      topics: 'Simple stories, rhymes and everyday activities',
      modelAssetPath: 'assets/characters/bunny',
      isActive: true,
    },
  ];

  for (const char of characters) {
    await prisma.character.upsert({
      where: { name: char.name },
      update: char,
      create: char,
    });
  }

  console.log('✅ Database seeded with Dino, Robo, and Bunny characters!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
