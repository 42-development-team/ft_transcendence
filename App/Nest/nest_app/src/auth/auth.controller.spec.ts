import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Controller, Get, Body, Req, Res, Param, Put, Post, Redirect, UseGuards, Query, Header, UseInterceptors, HttpCode } from '@nestjs/common';
import { FortyTwoAuthGuards } from './guards/42-auth.guards';
import { Public } from './public.routes';
import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { Tokens } from './types/token.type';
import { UsersService } from '../users/users.service';
import { FirstLoginDto } from './dto/firstLoginDto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { JwtPayload } from '../auth/types/jwtPayload.type';


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
      // 2 times because:
      // The first call should set the jwt cookie with the access_token value.
      // the second call should set the rt cookie with the refresh_token value.
      expect(res.cookie).toHaveBeenNthCalledWith(1, 'jwt', jwt.access_token, expect.any(Object));
      expect(res.cookie).toHaveBeenNthCalledWith(2, 'rt', jwt.refresh_token, expect.any(Object));
    });
  });

  describe('logout', () => {
    it('should send a success response when AuthService.logout is successful', async () => {
        // Arrange
        const res: any = { clearCookie: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(authService, 'logout').mockResolvedValue();
    
        // Act
        await controller.logout(res);
    
        // Assert
        expect(authService.logout).toHaveBeenCalledWith(res);
        // expect(res.clearCookie).toHaveBeenCalledWith('jwt');
        // expect(res.clearCookie).toHaveBeenCalledWith('rt');
        expect(res.send).toHaveBeenCalledWith('Logged out successfully.');
    });
    
    it('should send an error response when AuthService.logout throws an error', async () => {
        // Arrange
        const res: any = { 
          clearCookie: jest.fn().mockResolvedValue(undefined), 
          send: jest.fn(), 
          status: jest.fn().mockReturnThis(),
        };
      
        // Act
        try {
          await controller.logout(res);
        } catch (error) {
          // Assert
          expect(error.message).toBe('Logout failed');
          expect(res.clearCookie).toHaveBeenCalledWith('jwt');
          expect(res.clearCookie).toHaveBeenCalledWith('rt');
          expect(res.send).toHaveBeenCalledWith('Logged out successfully.');
          expect(res.status).not.toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
      
  });
  describe('generateNewTokens', () => {
    it('should generate and send new tokens when the refresh token is verified', async () => {
        // Arrange
        const req: any = { user: { id: 1, login: 'john_doe', twoFactorAuthenticated: true } };
        const res: Response = {
          cookie: jest.fn(),
          send: jest.fn(),
          status: jest.fn().mockReturnThis(),
        } as any;
        const jwtPayload: JwtPayload = { sub: 1, login: 'john_doe', twoFactorAuthenticated: true };
        const tokenObject: Tokens = {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        };
        const verifyRefreshTokenMock = jest.spyOn(authService, 'verifyRefreshToken').mockResolvedValue(jwtPayload);
        const getTokensMock = jest.spyOn(authService, 'getTokens').mockResolvedValue(tokenObject);
    
        // Act
        await controller.generateNewTokens(req, res);
    
        // Assert
        expect(verifyRefreshTokenMock).toHaveBeenCalledWith(req, res);
        expect(getTokensMock).toHaveBeenCalledWith(jwtPayload, req.user.twoFactorAuthenticated);
        expect(res.cookie).toHaveBeenCalledWith('jwt', tokenObject.access_token, expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith('rt', tokenObject.refresh_token, expect.any(Object));
        expect(res.send).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      
    });
    
    it('should throw UnauthorizedException when the refresh token is invalid', async () => {
        // Arrange with invalid req
        const req: any = { user: { id: 0, login: '', twoFactorAuthenticated: false }};
        const res: Response = {
            cookie: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
          } as any;
        const verifyRefreshTokenMock = jest.spyOn(authService, 'verifyRefreshToken').mockResolvedValue(null);
    
        // Act & Assert
        try {
          await controller.generateNewTokens(req, res);
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error.message).toBe('Invalid refresh token');
          expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
          expect(res.send).toHaveBeenCalledWith('Unauthorized' + error.message);
        }
      });
    
    
  }); 
});
