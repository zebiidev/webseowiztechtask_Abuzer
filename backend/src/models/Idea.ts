import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { IdeaDocument } from '../types.js';

export type IdeaDocumentModel = Document & IdeaDocument;

const ideaSchema = new Schema<IdeaDocumentModel>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

const IdeaModel: Model<IdeaDocumentModel> = mongoose.model<IdeaDocumentModel>('Idea', ideaSchema);

export default IdeaModel;
