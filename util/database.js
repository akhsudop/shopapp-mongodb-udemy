const mongodb = require("mongodb");

const MongoCli = new mongodb.MongoClient(
  "mongodb+srv://alina:FevV5LpovVjShPeY@cluster0.nbknqpg.mongodb.net/shop?retryWrites=true&w=majority"
);

let _db;

const mongoConnect = async (cb) => {
  try {
    await MongoCli.connect();
    await MongoCli.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    _db = MongoCli.db();
    cb();

    // await MongoCli.close();
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw Error;
};

//another way to connect:

// const MongoCli = mongodb.MongoClient;

// const mongoConnect = (cb) => {
//   MongoCli.connect(
//     "mongodb+srv://alina:FevV5LpovVjShPeY@cluster0.nbknqpg.mongodb.net/?retryWrites=true&w=majority"
//   )
//     .then((client) => {
//       cb(client);
//       console.log("connected");
//     })
//     .catch((err) => console.log(err));
// };

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
