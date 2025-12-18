import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from './App';

describe('App', () => {
  it('renders app title', () => {
    render(<App />);
    expect(
      screen.getByText('Home Loan Modelling & Visualisation Platform')
    ).toBeInTheDocument();
  });
});

