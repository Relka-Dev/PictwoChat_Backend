import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SimpleSchema from "simpl-schema";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLLECTION_NAME = 'users';
const USER_SCHEMA = new SimpleSchema({
  username: {
    type: String,
    min: 1,
    max: 100,
    trim: true,
  },
  email: {
    type: String,
    max: 255,
    trim: true,
    regEx: EMAIL_REGEX,
  },
  password: {
    type: String,
    min: 6,
  },
  createdAt: {
    type: Date,
  },
})

export const userQueries = (database) => ({
  users: async () => await database.collection(COLLECTION_NAME).find({}).toArray(),
});

export const userMutations = (database) => ({
  register: async (_parent, args) => {
    const collection = database.collection(COLLECTION_NAME);
    const hashedPassword = await bcrypt.hash(args.password, 10);
    const creationDate = new Date();

    const doc = {
      username: args.username,
      email: args.email,
      password: hashedPassword,
      createdAt: creationDate,
    }

    USER_SCHEMA.validate(doc);

    // Check if user already exists with the same email
    const user = await collection.findOne({ email: args.email });
    if (user) {
      return { token: null, message: "User already exists." }; // Return null token if user already exists
    }

    const result = await collection.insertOne(doc);

    const token = jwt.sign({ userId: result.insertedId.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token: token, message: "User registered successfully." };
  },

  login: async (_parent, args) => {
    const collection = database.collection(COLLECTION_NAME);

    const user = await collection.findOne({ email: args.email });
    if (!user) return { token: null, message: "User does not exist." };

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) return { token: null, message: "Wrong password." };

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token: token, message: "Sucessfully logged in!" };
  },
});