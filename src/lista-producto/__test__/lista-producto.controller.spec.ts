import { Test, TestingModule } from '@nestjs/testing';
import { ListaProductoController } from '../lista-producto.controller';

describe('ListaProductoController', () => {
  let controller: ListaProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListaProductoController],
    }).compile();

    controller = module.get<ListaProductoController>(ListaProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
