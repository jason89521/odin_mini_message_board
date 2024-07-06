import mongoose, { FilterQuery, Schema } from 'mongoose';

interface Message {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

const MESSAGE_MODEL_NAME = 'Message';

const messageSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    statics: {
      async list(before?: string): Promise<{ items: Message[]; next: string | null }> {
        const query: FilterQuery<{ createdAt: { $lt: Date } }> = await (async () => {
          if (!before) {
            return {};
          }

          const beforeInstance = await this.findById(before);
          return { createdAt: { $lt: beforeInstance?.createdAt } };
        })();

        const queryResult = (await this.find(query).sort({ createdAt: -1 }).limit(10)).map(doc => {
          const { _id, ...rest } = doc.toJSON();

          return { ...rest, id: _id.toString() } satisfies Message;
        });
        const next = queryResult.at(10 - 1)?.id ?? null;
        queryResult.reverse();

        return {
          items: queryResult.slice(0, 10),
          next,
        };
      },
      async createOne(author: string, content: string): Promise<Message> {
        const { _id, ...rest } = (await MessageModel.create({ author, content })).toJSON();

        return { ...rest, id: _id.toString() };
      },
    },
  }
);

const MessageModel = mongoose.model(MESSAGE_MODEL_NAME, messageSchema);

export default MessageModel;
