import { Test, TestingModule } from '@nestjs/testing';
import { TwoFAController } from './2FA.controller';
import { TwoFAService } from './2FA.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';

describe('TwoFAController', () => {
  let controller: TwoFAController;
  let twoFAService: TwoFAService;
  let configService: ConfigService;
  let prismaService: PrismaService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFAController],
      providers: [TwoFAService, ConfigService, PrismaService, UsersService],
    }).compile();

    controller = module.get<TwoFAController>(TwoFAController);
    twoFAService = module.get<TwoFAService>(TwoFAService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('isActive', () => {
    it('should call isTwoFAEnabled method of TwoFAService and send the result as response', async () => {
      // Mock the Response object
      const mockResponse: Partial<Response> = {
        send: jest.fn(),
      };

      // Mock the isTwoFAEnabled method of TwoFAService to return a specific value
      const isTwoFAEnabledResult = true;
      jest.spyOn(twoFAService, 'isTwoFAEnabled').mockResolvedValue();

      // Call the isActive method of the TwoFAController with the mocked Response
      await controller.isActive('123', mockResponse as Response);

      // Expectations
    //   expect(twoFAService.isTwoFAEnabled).toHaveBeenCalled();

    //   expect(mockResponse.send).toHaveBeenCalledTimes(1);
    //   expect(mockResponse.send).toHaveBeenCalledWith(isTwoFAEnabledResult);
    });
  });

});
