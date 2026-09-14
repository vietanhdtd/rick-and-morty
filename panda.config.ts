import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  outdir: 'styled-system',
  theme: {
    extend: {
      tokens: {
        colors: {
          ink: { value: '#090c0b' },
          bone: { value: '#f0ede2' },
          portal: { value: '#bdff3f' },
          ultraviolet: { value: '#9c8bff' },
          signal: { value: '#ff8066' },
        },
      },
    },
  },
})
