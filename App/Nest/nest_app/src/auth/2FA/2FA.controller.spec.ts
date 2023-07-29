import { Test } from '@nestjs/testing';
import { TwoFAController } from './2FA.controller';
import { TwoFAService } from './2FA.service';
import { ConfigService } from '@nestjs/config';
import { TwoFADto } from './dto/TwoFactor.dto';
import { Response } from 'express';
import * as qrcode from 'qrcode';

jest.mock('./2FA.service');
jest.mock('@nestjs/config');

describe('TwoFAController', () => {
  let controller: TwoFAController;
  let twoFAService: TwoFAService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TwoFAController],
      providers: [TwoFAService, ConfigService],
    }).compile();

    controller = moduleRef.get<TwoFAController>(TwoFAController);
    twoFAService = moduleRef.get<TwoFAService>(TwoFAService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('turnOnTwoFa', () => {
    it('should generate and return a QR code URL', async () => {
      // Arrange
      const userId = 123;
      const qrCodeUrl = 'mocked-qr-code-url';
      const base64Qrcode = 'mocked-base64-qrcode';
      const twoFADto: TwoFADto = { userId: userId.toString() };

      jest.spyOn(twoFAService, 'generateTwoFA').mockResolvedValue(qrCodeUrl);
      jest.spyOn(qrcode, 'toDataURL').mockResolvedValue(base64Qrcode);

      const response = {
        send: jest.fn(),
      } as unknown as Response;

      // Act
      await controller.turnOnTwoFa(response, twoFADto);

      // Assert
      expect(twoFAService.generateTwoFA).toHaveBeenCalledWith(userId);
      expect(qrcode.toDataURL).toHaveBeenCalledWith(qrCodeUrl);
      expect(response.send).toHaveBeenCalledWith({
        contentType: 'image/png',
        base64Qrcode,
      });
    });
  });

  describe('isActive', () => {
    it('should check if TwoFA is enabled for a user', async () => {
      // Arrange
      const userId = '123';
      const response = {
        send: jest.fn(),
      } as unknown as Response;

      jest.spyOn(twoFAService, 'isTwoFAEnabled').mockResolvedValue(undefined);

      // Act
      await controller.isActive(userId, response);

      // Assert
      expect(twoFAService.isTwoFAEnabled).toHaveBeenCalledWith(response, parseInt(userId));
    });
  });

  describe('TwoFAAuthRedirect', () => {
    it('should redirect to the specified URL', async () => {
      // Arrange
      const frontPort = '3000';
      const ip = 'localhost';
      const url = `http://${ip}:${frontPort}/firstLogin`;

      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ip') return ip;
        if (key === 'frontPort') return frontPort;
        return '';
      });

      const response = {
        redirect: jest.fn(),
      } as unknown as Response;

      // Act
      await controller.TwoFAAuthRedirect(response);

      // Assert
      expect(response.redirect).toHaveBeenCalledWith(url);
    });
  });

  describe('verifyTwoFA', () => {
    it('should verify the provided TwoFA code for a user', async () => {
      // Arrange
      const userId = 123;
      const code = '123456';
      const isValid = true;
      const twoFADto: TwoFADto = { userId: userId.toString(), code };

      jest.spyOn(twoFAService, 'isTwoFACodeValid').mockResolvedValue(isValid);

      const response = {
        send: jest.fn(),
      } as unknown as Response;

      // Act
      await controller.verifyTwoFA(response, twoFADto);

      // Assert
      expect(twoFAService.isTwoFACodeValid).toHaveBeenCalledWith(code, userId);
      expect(response.send).toHaveBeenCalledWith(isValid);
    });
  });

  describe('turnOffTwoFA', () => {
    it('should turn off TwoFA for a user', async () => {
      // Arrange
      const userId = '123';
      const twoFADto: TwoFADto = { userId };

      jest.spyOn(twoFAService, 'turnOff').mockResolvedValue(undefined);

      // Act
      await controller.turnOffTwoFA(twoFADto);

      // Assert
      expect(twoFAService.turnOff).toHaveBeenCalledWith(parseInt(userId));
    });
  });
});
