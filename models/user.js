const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; //{items:[]}
    this._id = id;
  }

  static save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].qt =
        this.cart.items[cartProductIndex].qt + 1;
      // const filteredCart = this.cart.items.toSpliced(cartProduct, 1);
      // updatedCart[cartProductIndex];
      // updatedCart = {
      //   items: [
      //     ...filteredCart,
      //     {
      //       productId: this.cart.items[cartProduct].productId,
      //       qt: this.cart.items[cartProduct].qt + 1,
      //     },
      //   ],
      // };
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        qt: 1,
      });
    }
    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
      .then((result) => {
        console.log(result, "log from addToCart method");
      })
      .catch((err) => console.log(err));
  }

  updateCart(id) {
    const updatedCartItems = [...this.cart.items];

    const updatedCartItem = updatedCartItems.findIndex((product) => {
      return product.productId.toString() === id;
    });
    const db = getDb();
    if (updatedCartItems[updatedCartItem].qt === 1) {
      updatedCartItems.splice(updatedCartItem, 1);
    } else if (updatedCartItems[updatedCartItem].qt > 1) {
      updatedCartItems[updatedCartItem].qt -= 1;
    }

    const updatedCart = { items: updatedCartItems };

    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
      .then((result) => {
        console.log(result, "log from updateCart method");
      })
      .catch((err) => console.log(err));
  }

  getCart() {
    const db = getDb();
    const prodIds = this.cart.items.map((product) => {
      return product.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: prodIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            qt: this.cart.items.find(
              (i) => i.productId.toString() === product._id.toString()
            ).qt,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            username: this.username,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new ObjectId(id) })
      .next()
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
