import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private usersModel: Model<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        try {
            createUserDto.password = this.hashPass(createUserDto.password);
            const newUser = await new this.usersModel(createUserDto);
            return await newUser.save();
        } catch (err) {
            if (err.code === 11000) {
                err.error = 'UserExists';
                err.message = 'User already exists';
            }
            throw new BadRequestException(err.message, err.error);
        }
    }

    findAll() {
        return this.usersModel.find().select({ __v: 0 }).exec();
    }

    findOne(username: string) {
        return this.usersModel.findOne({ username: username });
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            if (updateUserDto.password) {
                updateUserDto.password = this.hashPass(updateUserDto.password);
            }
            return await this.usersModel.findByIdAndUpdate(id, {
                $set: updateUserDto,
            });
        } catch (e) {
            throw new BadRequestException(e.message, e.error.toString());
        }
    }

    remove(id: string) {
        return `This action removes a #${id} user`;
    }

    hashPass(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    verifyPass(password: string, passwordHash: string) {
        const res = bcrypt.compareSync(password, passwordHash);
        return res;
    }

    generateRandomPassword(length = 32): string {
        return crypto.randomBytes(length).toString('hex'); // 64 chars
    }

    async getProfile(_id: string): Promise<User> {
        const user: User = (await this.usersModel.findById(_id, {
            __v: 0,
        })) as User;
        return user;
    }
}
