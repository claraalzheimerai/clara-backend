import fs from 'fs';
import path from 'path';
import { deleteTempFile, isValidFile } from '../../utils/file.utils';

describe('file.utils', () => {
  const testDir  = path.join(__dirname, 'tmp');
  const testFile = path.join(testDir, 'test.txt');

  beforeAll(() => {
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('isValidFile', () => {
    it('retorna true para archivo existente con contenido', () => {
      fs.writeFileSync(testFile, 'contenido de prueba');
      expect(isValidFile(testFile)).toBe(true);
    });

    it('retorna false para ruta inexistente', () => {
      expect(isValidFile('/ruta/que/no/existe.txt')).toBe(false);
    });
  });

  describe('deleteTempFile', () => {
    it('elimina un archivo existente', () => {
      fs.writeFileSync(testFile, 'para eliminar');
      expect(fs.existsSync(testFile)).toBe(true);
      deleteTempFile(testFile);
      expect(fs.existsSync(testFile)).toBe(false);
    });

    it('no lanza error si el archivo no existe', () => {
      expect(() => deleteTempFile('/no/existe.txt')).not.toThrow();
    });
  });
});