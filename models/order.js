const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
 
const CartItemSchema = new mongoose.Schema(
  {
    product : { type: ObjectId, ref: "Product" },
    name: String,
    price: Number
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new mongoose.Schema(
  {
    product : [CartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    days:{ type: Number, default:30 },
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Processing", "Delivered", "Cancelled"] // enum means string objects
    },
    updated: Date,
    user: { type: ObjectId, ref: "User" }
  },
  { timestamps: true }
);
 
const Order = mongoose.model("Order", OrderSchema);
 
module.exports = { Order, CartItem };