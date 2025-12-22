import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const {Schema}=mongoose;

const UserSchema=new Schema({
  name:  {type:String, required:true},
  email: { type: String, unique: true, required: true },
  password: { 
    type: String, 
    required: true,
    select: false
  },
  bio: { type: String,required: false },
  profilePic : { type: String, required: false },
});

UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  
  const salt  = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model('User',UserSchema);
