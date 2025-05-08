import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuthProvider, Role } from '../auth/auth.interface';
import { ApiHideProperty } from '@nestjs/swagger';


@Schema({ versionKey: false, timestamps: true })
export class User extends Document{
    @Prop({ unique: true })
    readonly username: string;

    @ApiHideProperty()
    @Prop({ select: false })
    password: string;

    @Prop({required: true, unique: true })
    email: string;

    @Prop()
    roles: Role[];

    @Prop({required: true, type: String, enum: AuthProvider })
    authProvider: AuthProvider;
}

export const UserSchema = SchemaFactory.createForClass(User);
