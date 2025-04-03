import React from 'react';

/**
 * AuthGuard component that always allows access
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children The content to render
 */
export default function AuthGuard({ children }) {
  return children;
}