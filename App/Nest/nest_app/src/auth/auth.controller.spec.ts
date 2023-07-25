import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Controller, Get, Body, Req, Res, Param, Put, Post, Redirect, UseGuards, Query, Header, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoAuthGuards } from './guards/42-auth.guards';
import { Public } from './public.routes';
import { UnauthorizedException } from '@nestjs/common';
import { Tokens } from './types/token.type';
import { UsersService } from '../users/users.service';
import { FirstLoginDto } from './dto/firstLoginDto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';


// "describe"  groups together related test cases with same focus
describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UsersService;
  let prismaService: PrismaService;
  
  // creating testing module with mock dependencies (AuthService and PrismaService)
  // to test Authcontroller in isolation
  // "beforeEach" is an hook that runs before each test case
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService, 
        FortyTwoAuthGuards, 
        UsersService,
        ConfigService,
        JwtService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('callback', () => {
    it('should call authService.redirectTwoFA and return a response', async () => {
        const req = {}; 
        const res = {
          send: jest.fn(),
        } as unknown as Response<any, Record<string, any>>;
  
        const redirectTwoFASpy = jest.spyOn(authService, 'redirectTwoFA').mockResolvedValue(); // Resolve with a value
  
        await controller.callback(req, res);
  
        expect(redirectTwoFASpy).toHaveBeenCalledWith(req, res);
        expect(res.send).toHaveBeenCalled();
    });
  });
//   describe('getJwt', () => {
//     // 
//   });

//   describe('logout', () => {
//     //
//   });
});