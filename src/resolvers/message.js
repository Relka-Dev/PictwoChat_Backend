import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import SimpleSchema from "simpl-schema";

const COLLECTION_NAME = 'messages';
const ROOM_COLLECTION_NAME = 'rooms';
const USER_COLLECTION_NAME = 'users';
const MESSAGE_SCHEMA = new SimpleSchema({
  user_id: {
    type: String,    
  },
  room_id: {
    type: String,
  },
  text: {
    type: String,
    min: 1,
    max: 512,
    trim: true,
    optional: true,
  },
  image: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
})

export const messageQueries = (database) => ({
  roomMessages: async (_parent, args) => {
    let result = await database.collection(COLLECTION_NAME).find({room_id: args.room_id}).toArray();

    // Attach user and room data to each message
    await result.forEach(msg => {
      msg['user'] = database.collection(USER_COLLECTION_NAME).findOne({_id: new ObjectId(msg.user_id)});
      msg['room'] = database.collection(ROOM_COLLECTION_NAME).findOne({_id: new ObjectId(msg.room_id)});
    });

    return result;
  }
});

export const messageMutations = (database) => ({
  sendMessage: async (_parent, args) => {
    const collection = database.collection(COLLECTION_NAME);
    const roomCollection = database.collection(ROOM_COLLECTION_NAME);
    const userCollection = database.collection(USER_COLLECTION_NAME);
    const creationDate = new Date();

    const doc = {
      user_id: args.user_id,
      room_id: args.room_id,
      text: args.text,
      image: args.image,
      createdAt: creationDate,
    }

    // Validation
    if (!args.text && !args.image) {
      throw new Error("Message must contain either text or an image.");
    }
    if (args.image) doc['image'] = args.image
    if (args.text) doc['text'] = args.text

    MESSAGE_SCHEMA.validate(doc);

    // Check if room and user exist
    let room = await roomCollection.findOne({ _id: new ObjectId(args.room_id) })
    let user = await userCollection.findOne({ _id: new ObjectId(args.user_id) })
    if (!room) {
      throw new Error("Room not found.");
    }
    if (!user) {
      throw new Error("User not found.");
    }

    // Insert message into database
    const result = await collection.insertOne(doc);

    return {
      _id: result.insertedId.toString(),
      user_id: doc.user_id,
      room_id: doc.room_id,
      text: doc.text,
      image: doc.image,
      createdAt: doc.createdAt,
    }
  },
});