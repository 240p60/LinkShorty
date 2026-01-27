import mongoose, { type Document, Schema } from "mongoose";

export interface IClick extends Document {
  shortCode: string;
  timestamp: Date;
  ipHash: string;
  userAgent: string | null;
  referrer: string | null;
  isUnique: boolean;
}

const clickSchema = new Schema<IClick>(
  {
    shortCode: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipHash: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: null,
    },
    referrer: {
      type: String,
      default: null,
    },
    isUnique: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
    collection: "clicks",
  }
);

// Compound index for efficient queries
clickSchema.index({ shortCode: 1, timestamp: -1 });
clickSchema.index({ shortCode: 1, ipHash: 1 });

export const Click = mongoose.model<IClick>("Click", clickSchema);
