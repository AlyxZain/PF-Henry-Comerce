const { Schema, model, Types } = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
     // select: false
    },
    boughtitems: {
        type: Array(Types.String),
        default:[]
      },
    reviews: {
        type: Array(Types.String),
        default:[]
      },
      cart:{
        type:Array(new Schema({
         name: String,
        count: Number
        }, {_id: false}))
        ,
        default:[]
      },
    isAdmin:{
        type: Boolean,
        required: true
      }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.plugin(mongooseDelete, { overrideMethods: "all" });

const UserModel = model("User", UserSchema);

module.exports = UserModel;
