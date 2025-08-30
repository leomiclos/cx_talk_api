import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findMe: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct dto', async () => {
      const dto: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: '123456', id: '1' };

      const createdUser = { ...dto };
      jest.spyOn(service, 'create').mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdUser);
    });
  });


  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const mockUsers = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
      (service.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findMe', () => {
    it('should call service.findMe with id from token', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
      (service.findMe as jest.Mock).mockResolvedValue(mockUser);

      // Simulando o valor que o @GetUser('id') injeta
      const userIdFromToken = '1';
      const result = await controller.findMe(userIdFromToken);

      expect(service.findMe).toHaveBeenCalledWith(userIdFromToken);
      expect(result).toEqual(mockUser);
    });
  });

});
