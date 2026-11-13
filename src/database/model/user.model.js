import mongoose, { Schema } from "mongoose";
import { genderEnum } from "../../common/enums/genderEnum.js";
import { RoleEnum } from "../../common/enums/role.enum.js";

let userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, `{VALUE} is to short as a firstName`],
      maxLength: [50, `{VALUE} is to long as a firstName`],
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [2, `{VALUE} is to short as a lastName`],
      maxLength: [50, `{VALUE} is to long as a lastName`],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
      lowercase: true,
      unique: true,
    },
    gender: {
      type: Number,
      enum: Object.values(genderEnum),
      default: genderEnum.MALE,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema
  .virtual("userName")
  .set(function (value) {
    let [firstName, lastName] = value.split(" ");
    console.log(this);
    this.firstName = firstName;
    this.lastName = lastName;
  })
  .get(function () {
    return `${this.firstName} ${this.lastName} `;
  });

export const userModel = mongoose.model("users", userSchema);
