import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
  role: 'superadmin' | 'admin';
  createdAt: Date;
  sidebarRestrict?: boolean;
}

const AdminSchema: Schema<IAdmin> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  sidebarRestrict: { type: Boolean, default: true },
});

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
