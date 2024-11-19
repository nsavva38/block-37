const express = require("express");
const app = express();
const PORT = 3000;

app.use(require("morgan")("dev"));
app.use(express.json);
app.use("/users", require("./routes/users"));

const prisma = require("./prisma");
app.post("/playlists", async ( req, res, next) => {
  try {
    const { name, description, ownerId, trackIds } = req.body;

    const tracks = trackIds.map((id) => ({ id: +id}));

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: +ownerId,
        tracks: { connect: tracks}
      },
      include: {
        owner: true,
        tracks: true,
      },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});



app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found"});
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});