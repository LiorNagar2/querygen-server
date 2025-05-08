import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './users.schema';


@Controller('users')
@Auth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.usersService.create(createUserDto);
    }

    @Get('profile')
    getProfile(@Request() req: any) {
        const { _id } = req.user;
        return this.usersService.getProfile(_id);
    }

    @Get(':username')
    findOne(@Param('username') username: string) {
        return this.usersService.findOne(username);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }
}
