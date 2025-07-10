import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    await prisma.userCard.deleteMany();
    await prisma.card.deleteMany();
    await prisma.album.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

    // ========== USUARIOS ==========
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@pokecollector.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'ADMIN'
      }
    });

    const user1 = await prisma.user.create({
      data: {
        username: 'ash_ketchum',
        email: 'ash@pokecollector.com',
        passwordHash: await bcrypt.hash('user123', 10),
        role: 'COMMON'
      }
    });

    const user2 = await prisma.user.create({
      data: {
        username: 'misty_waterflower',
        email: 'misty@pokecollector.com',
        passwordHash: await bcrypt.hash('user123', 10),
        role: 'COMMON'
      }
    });

    const user3 = await prisma.user.create({
      data: {
        username: 'brock_harrison',
        email: 'brock@pokecollector.com',
        passwordHash: await bcrypt.hash('user123', 10),
        role: 'COMMON'
      }
    });

    console.log('👥 Created users');

    // ========== ÁLBUMES ==========
    const baseSet = await prisma.album.create({
      data: {
        name: 'Base Set',
        description: 'First Gen Pokémon cards.',
        generation: 1,
        imageUrl: 'https://images.pokemontcg.io/base1/logo.png',
        createdById: adminUser.id
      }
    });

    const jungle = await prisma.album.create({
      data: {
        name: 'Jungle',
        description: 'Jungle expansion.',
        generation: 1,
        imageUrl: 'https://images.pokemontcg.io/base2/logo.png',
        createdById: adminUser.id
      }
    });

    const neoGenesis = await prisma.album.create({
      data: {
        name: 'Neo Genesis',
        description: 'Second Gen Pokémon cards.',
        generation: 2,
        imageUrl: 'https://images.pokemontcg.io/neo1/logo.png',
        createdById: adminUser.id
      }
    });

    console.log('📚 Created albums');

    // ========== CARTAS ==========
    const baseSetCards = [
      { name: 'Charizard', number: 4, rarity: 'HOLO', type: 'Fire' },
      { name: 'Pikachu', number: 58, rarity: 'COMMON', type: 'Electric' },
      { name: 'Mewtwo', number: 10, rarity: 'HOLO', type: 'Psychic' }
    ];

    const jungleCards = [
      { name: 'Vaporeon', number: 12, rarity: 'HOLO', type: 'Water' },
      { name: 'Scyther', number: 10, rarity: 'HOLO', type: 'Grass' }
    ];

    const neoGenesisCards = [
      { name: 'Lugia', number: 9, rarity: 'LEGENDARY', type: 'Psychic' },
      { name: 'Pichu', number: 12, rarity: 'RARE', type: 'Electric' }
    ];

    for (const card of baseSetCards) {
      await prisma.card.create({
        data: {
          ...card,
          albumId: baseSet.id,
          imageUrl: `https://images.pokemontcg.io/base1/${card.number}.png`
        }
      });
    }

    for (const card of jungleCards) {
      await prisma.card.create({
        data: {
          ...card,
          albumId: jungle.id,
          imageUrl: `https://images.pokemontcg.io/base2/${card.number}.png`
        }
      });
    }

    for (const card of neoGenesisCards) {
      await prisma.card.create({
        data: {
          ...card,
          albumId: neoGenesis.id,
          imageUrl: `https://images.pokemontcg.io/neo1/${card.number}.png`
        }
      });
    }

    console.log('🃏 Created cards');

    // ========== COLECCIONES DE USUARIOS ==========
    const allCards = await prisma.card.findMany();

    const ashCards = allCards.filter(card =>
      ['Pikachu', 'Charizard', 'Pichu'].includes(card.name)
    );

    for (const card of ashCards) {
      await prisma.userCard.create({
        data: {
          userId: user1.id,
          cardId: card.id,
          quantity: 1
        }
      });
    }

    const mistyCards = allCards.filter(card =>
      ['Vaporeon'].includes(card.name)
    );

    for (const card of mistyCards) {
      await prisma.userCard.create({
        data: {
          userId: user2.id,
          cardId: card.id,
          quantity: 1
        }
      });
    }

    const brockCards = allCards.filter(card =>
      ['Scyther', 'Lugia'].includes(card.name)
    );

    for (const card of brockCards) {
      await prisma.userCard.create({
        data: {
          userId: user3.id,
          cardId: card.id,
          quantity: 1
        }
      });
    }

    console.log('👥 Assigned cards to users');

    // ========== ACTUALIZAR TOTAL DE CARTAS ==========
    await prisma.album.update({
      where: { id: baseSet.id },
      data: { totalCards: await prisma.card.count({ where: { albumId: baseSet.id } }) }
    });

    await prisma.album.update({
      where: { id: jungle.id },
      data: { totalCards: await prisma.card.count({ where: { albumId: jungle.id } }) }
    });

    await prisma.album.update({
      where: { id: neoGenesis.id },
      data: { totalCards: await prisma.card.count({ where: { albumId: neoGenesis.id } }) }
    });

    console.log('📊 Updated total cards in albums');

    console.log('✅ Seeding completed successfully!');
    console.log('\n🔑 Test credentials:');
    console.log('Admin: admin@pokecollector.com / admin123');
    console.log('Ash: ash@pokecollector.com / user123');
    console.log('Misty: misty@pokecollector.com / user123');
    console.log('Brock: brock@pokecollector.com / user123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
