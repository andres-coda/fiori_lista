import { Test, TestingModule } from '@nestjs/testing';
import { ListaController } from '../lista.controller';

describe('ListaController', () => {
  let controller: ListaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListaController],
    }).compile();

    controller = module.get<ListaController>(ListaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
