# Domain Module Tests Documentation

## Overview

File `domains.test.ts` berisi unit tests untuk modul domains API yang bertanggung jawab untuk melakukan pengecekan ketersediaan domain. Tests ini menggunakan Bun test framework dan ElysiaJS untuk testing API endpoints.

## Struktur Test

### Setup & Mocking

Test file ini menggunakan mocking untuk `DomainChecker` class dari `@/lib/domain-checker` untuk:

- Mengisolasi unit tests dari dependencies eksternal (RDAP API)
- Memberikan response yang predictable untuk testing
- Mempercepat eksekusi tests

Mock implementation mensimulasikan:

- Domain `.com` selalu available
- Domain lainnya (`.id`, `.ai`, `.org`, `.net`, `.io`) selalu taken dengan registrar info
- Return format yang sesuai dengan implementasi real

### Test Cases

#### 1. **Check Domain dengan Custom TLDs**

```typescript
it('should check domain availability with custom TLDs');
```

- **Tujuan**: Memastikan API dapat menerima custom TLD list
- **Input**: `{ name: 'example', tlds: ['com', 'net', 'org'] }`
- **Expected**:
    - Status 200
    - Results berisi 3 domain sesuai TLD yang diminta
    - Format response sesuai schema

#### 2. **Default TLDs**

```typescript
it('should use default TLDs when not provided');
```

- **Tujuan**: Memastikan default TLDs digunakan jika tidak ada input
- **Input**: `{ name: 'mydomain' }` (tanpa tlds)
- **Expected**:
    - Menggunakan default TLDs: ['com', 'id', 'ai', 'org', 'net', 'io']
    - Total 6 domain dicek

#### 3. **Empty TLD Array**

```typescript
it('should use default TLDs when empty array provided');
```

- **Tujuan**: Handle edge case empty array
- **Input**: `{ name: 'testdomain', tlds: [] }`
- **Expected**: Sama dengan default TLDs

#### 4. **Domain Name Validation - Format**

```typescript
it('should validate domain name format');
```

- **Tujuan**: Validasi format domain name
- **Input**: `{ name: 'invalid-domain-' }` (ends with hyphen)
- **Expected**: Status 422 (Unprocessable Entity)

#### 5. **Domain Name Validation - Length**

```typescript
it('should validate minimum domain name length');
```

- **Tujuan**: Validasi minimum length (3 karakter)
- **Input**: `{ name: 'ab' }` (terlalu pendek)
- **Expected**: Status 422

#### 6. **Missing Required Field**

```typescript
it('should handle missing name field');
```

- **Tujuan**: Validasi required field
- **Input**: `{ tlds: ['com'] }` (tanpa name)
- **Expected**: Status 422

#### 7. **Full Domain Name Extraction**

```typescript
it('should handle full domain name with TLD extraction');
```

- **Tujuan**: Extract domain dan TLD dari full domain name
- **Input**: `{ name: 'myawesomesite.com', tlds: [] }`
- **Expected**:
    - Extract 'myawesomesite' sebagai keyword
    - Check default TLDs (6 domains) karena .com sudah termasuk defaults
    - Hasil: 6 domains termasuk myawesomesite.com

#### 8. **Subdomain Handling**

```typescript
it('should handle subdomain extraction correctly');
```

- **Tujuan**: Handle subdomain dengan benar
- **Input**: `{ name: 'api.example.com', tlds: [] }`
- **Expected**:
    - Extract 'api.example' sebagai keyword
    - Check default TLDs (6 domains) karena .com sudah termasuk defaults
    - Hasil: 6 domains termasuk api.example.com

#### 9. **Smart TLD Extraction**

```typescript
it('should add extracted TLD to default TLDs when not already included');
```

- **Tujuan**: Test smart TLD extraction untuk TLD yang tidak ada di defaults
- **Input**: `{ name: 'yapping.co', tlds: [] }`
- **Expected**:
    - Extract 'yapping' sebagai keyword
    - Extract '.co' sebagai TLD
    - Check default TLDs + .co (total 7 domains)
    - Hasil: 7 domains termasuk yapping.co

## Menjalankan Tests

### Single Test File

```bash
bun test test/api/modules/domains/domains.test.ts
```

### Watch Mode

```bash
bun test:watch test/api/modules/domains
```

### Semua Tests

```bash
bun test
```

## Test Coverage

Tests ini mencakup:

- ✅ Happy path scenarios
- ✅ Edge cases (empty arrays, missing fields)
- ✅ Input validation
- ✅ Error handling
- ✅ Domain name parsing logic

## Best Practices yang Diterapkan

1. **Isolation**: Menggunakan mocking untuk isolasi dari external services
2. **Descriptive Names**: Test names jelas menjelaskan apa yang ditest
3. **Arrange-Act-Assert**: Struktur test yang clear
4. **Edge Cases**: Cover berbagai edge cases dan error scenarios
5. **Type Safety**: Menggunakan TypeScript untuk type checking

## Integration dengan CI/CD

Tests ini dapat diintegrasikan dengan:

- GitHub Actions untuk automated testing
- Pre-commit hooks untuk ensure tests pass sebelum commit
- Coverage reports untuk monitor test coverage

## Future Improvements

1. **Error Response Testing**: Test specific error messages
2. **Performance Testing**: Test response time requirements
3. **Load Testing**: Test concurrent requests handling
4. **Integration Tests**: Test dengan real RDAP API (separate test suite)
5. **Property-based Testing**: Generate random valid/invalid inputs
