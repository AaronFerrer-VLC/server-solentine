const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'El email de usuario es obligatorio'],
      minlength: [5, 'El email necesita mínimo 5 caracteres'],
      maxlength: [255, 'El email es demasiado largo'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Por favor proporciona un email válido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña de usuario es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false // Don't return password by default
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'El nombre de usuario es obligatorio'],
      minlength: [3, 'El usuario necesita mínimo 3 caracteres'],
      maxlength: [30, 'El nombre de usuario es demasiado largo'],
      trim: true,
      match: [/^[\wáéíóúüñÁÉÍÓÚÜÑ]+$/, 'El nombre de usuario debe ser una sola palabra sin espacios ni caracteres especiales']
    },
    avatar: {
      type: String,
      default: null
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [100, 'El nombre es demasiado largo']
    },
    familyName: {
      type: String,
      trim: true,
      maxlength: [100, 'El apellido es demasiado largo']
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'El rol debe ser "user" o "admin"'
      },
      default: 'user'
    },
    sales: [{
      type: Schema.Types.ObjectId,
      ref: 'Sale'
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for better query performance
// NOTA: email y username ya tienen índices únicos por 'unique: true' en el schema
// No necesitamos crear índices explícitos para ellos (evita duplicados)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Compound index for common queries
userSchema.index({ role: 1, isActive: 1 });

const User = model("User", userSchema)

module.exports = User