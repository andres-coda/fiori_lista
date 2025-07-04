import { Test, TestingModule } from '@nestjs/testing';
import { ListaService } from '../lista.service';

describe('ListaService', () => {
  let service: ListaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListaService],
    }).compile();

    service = module.get<ListaService>(ListaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
