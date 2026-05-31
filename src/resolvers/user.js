import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userQueries = (database) => ({
  users: async () => await database.collection('users').find({}).toArray(),
});

export const userMutations = (database) => ({
  register: async (_parent, args) => {
    const collection = database.collection('users');
    const hashedPassword = await bcrypt.hash(args.password, 10);

    const result = await collection.insertOne({
      username: args.username,
      email: args.email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: result.insertedId.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  },

  login: async (_parent, args) => {
    const collection = database.collection('users');
    const user = await collection.findOne({ email: args.email });

    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new Error('Wrong password');

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  },
});