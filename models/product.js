const { ObjectId } = require("mongodb");

const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();

    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => console.log(err));
  }

  static getProductById(id) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new ObjectId(id) })
      .next()
      .then((res) => {
        return res;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
}

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

module.exports = Product;
