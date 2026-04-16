import { sanitizeInput, isValidCityName, sanitizeHeaders } from '../security/SecurityUtils';

describe('SecurityUtils', () => {
  it('sanitizza correttamente l\'input', () => {
    expect(sanitizeInput('Roma<script>')).toBe('Roma');
    expect(sanitizeInput('  Napoli  ')).toBe('Napoli');
    expect(sanitizeInput('Line\nBreak')).toBe('LineBreak');
  });

  it('valida nomi città corretti', () => {
    expect(isValidCityName('Roma')).toBe(true);
    expect(isValidCityName('')).toBe(false);
    expect(isValidCityName('@@@@')).toBe(false);
  });

  it('rimuove caratteri pericolosi dagli header', () => {
    const headers = { Authorization: 'Bearer token\n', 'X-Test': 'value\r' };
    expect(sanitizeHeaders(headers)).toEqual({ Authorization: 'Bearer token', 'X-Test': 'value' });
  });
});
