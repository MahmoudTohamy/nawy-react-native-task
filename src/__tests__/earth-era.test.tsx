import React from 'react';
import { render } from '@testing-library/react-native';
import { parseProperty } from '../types/property';
import { AppConfig } from '../constants/config';
import PropertyCard from '../components/PropertyCard';

describe('Earth-era behaviour (expected to change for Mars)', () => {
  test('property model uses Earth address format', () => {
    const property = parseProperty({
      id: 'test_001',
      title: 'Test',
      price: 1000000,
      currency: 'EGP',
      address: '123 Test St',
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      area_unit: 'm²',
      image_url: null,
      description: 'Test property',
      amenities: [],
      status: 'available',
      listed_at: '2024-01-01',
    });
    expect(property.address).toContain('St');
    expect(property.currency).toBe('EGP');
  });

  test('access passphrase is hardcoded in config', () => {
    expect(AppConfig.accessPassphrase).toBe('nawy-open-sesame');
  });

  test('property card shows Earth-era currency', async () => {
    const property = parseProperty({
      id: 'test_001',
      title: 'Test Habitat',
      price: 2500000,
      currency: 'EGP',
      address: '123 Test St, Cairo',
      bedrooms: 3,
      bathrooms: 2,
      area: 185,
      area_unit: 'm²',
      image_url: null,
      description: 'A test property',
      amenities: ['Parking'],
      status: 'available',
      listed_at: '2024-01-01',
    });
    const { getByText } = await render(<PropertyCard property={property} onPress={() => {}} />);
    expect(getByText(/EGP/)).toBeTruthy();
  });
});
