import { Test, TestingModule } from '@nestjs/testing';
import { ListaProductoService } from '../lista-producto.service';

describe('ListaProductoService', () => {
  let service: ListaProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListaProductoService],
    }).compile();

    service = module.get<ListaProductoService>(ListaProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
