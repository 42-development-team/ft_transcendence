import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Controller, Get, Body, Req, Res, Param, Put, Post, Redirect, UseGuards, Query, Header, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { FortyTwoAuthGuards } from './guards/42-auth.guards';
import { Public } from './public.routes';
import { UnauthorizedException } from '@nestjs/common';
import { Tokens } from './types/token.type';
import { UsersService } from '../users/users.service';
import { FirstLoginDto } from './dto/firstLoginDto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';


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
    // Each it block contains a series of steps that follow the AAA pattern: Arrange, Act, and Assert.
    it('should call authService.redirectTwoFA and return a response', async () => {
        // Arrange
        // set up and create any required objects or instances that the test case needs. 
        // => This includes initializing variables, setting up mock objects, 
        // and preparing the input data for the unit under test.
        const req = {};
        const res = {
          send: jest.fn(),
        //   redirect: jest.fn(),
        //   status: jest.fn().mockReturnThis(),
        //   cookie: jest.fn(),
        //   clearCookie: jest.fn(),
        } as unknown as Response<any, Record<string, any>>;
  
        // Mock the redirectTwoFA method to resolve successfully
        jest.spyOn(authService, 'redirectTwoFA').mockResolvedValue();
  
        // Act
        // actual test execution => calling the method or function to test, 
        // passing in the prepared input data
        await controller.callback(req, res);
  
        // Assert
        // verifying that the output matches the expected result. 
        // This involves making assertions about the actual output 
        // against the expected outcome.
        expect(authService.redirectTwoFA).toHaveBeenCalledWith(req, res);
    });

    
  });

  describe('getJwt', () => {
    it('should call authService.getTokens and set cookies with the correct parameters', async () => {
      // Arrange
      const req: any = { user: {} };
      const res: any = { cookie: jest.fn().mockReturnThis() };
      const jwt = { access_token: 'mockAccessToken', refresh_token: 'mockRefreshToken' };
      jest.spyOn(authService, 'getTokens').mockResolvedValue(jwt);
  
      // Act
      await controller.getJwt(req, res);
  
      // Assert
      expect(authService.getTokens).toHaveBeenCalledWith(req.user, true);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenNthCalledWith(1, 'jwt', jwt.access_token, expect.any(Object));
      expect(res.cookie).toHaveBeenNthCalledWith(2, 'rt', jwt.refresh_token, expect.any(Object));
    });
  });
});
