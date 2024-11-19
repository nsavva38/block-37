const prisma = require("../prisma");

const seed = async (numUsers = 5, numTracks = 20, numPlaylists = 10) => {
  const users = Array.from({ length: numUsers }, (_, i) => ({
    username: `User ${i + 1}`,
  }));
  await prisma.user.createMany({ data: users });

  const tracks = Array.from({ length: numTracks }, (_, i) => ({
    name: `Tracks ${i + 1}`,
  }));
  await prisma.track.createMany({ data: tracks });

  for (let i = 0; i < numPlaylists; i++) {
    const trackSize = 1 + Math.floor(Math.random() * 5);
  
    const tracks = Array.from({ length: trackSize }, () => ({
      id: 1 + Math.floor(Math.random() * numTracks),
    }));
    await prisma.playlist.create({
      data: {
        name: `Playlist ${i + 1}`,
        description: `Description ${i + 1}`,
        ownerId: 1 + Math.floor(Math.random() * numUsers),
        tracks: { connect: tracks},
      },
    });
  }
};



seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });