const sharp = require('sharp');
const fs = require('fs');

const svg = `
<svg width="240" height="60" viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg">
  <!-- Ai -->
  <g transform="translate(15, 18)">
    <rect width="24" height="24" rx="5" fill="#330000" />
    <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="4.25" stroke="#FF9A00" stroke-width="1.5" />
    <path d="M9.1 16.5L9.9 14.2H14.1L14.9 16.5H16.8L12.9 6.2H11.1L7.2 16.5H9.1ZM12 8.4L13.5 12.6H10.5L12 8.4Z" fill="#FF9A00" />
    <path d="M18.8 8.6C18.8 8.05 18.35 7.6 17.8 7.6C17.25 7.6 16.8 8.05 16.8 8.6C16.8 9.15 17.25 9.6 17.8 9.6C18.35 9.6 18.8 9.15 18.8 8.6ZM18.7 10.6H16.9V16.5H18.7V10.6Z" fill="#FF9A00" />
  </g>
  <!-- Ps -->
  <g transform="translate(70, 18)">
    <rect width="24" height="24" rx="5" fill="#001E36" />
    <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="4.25" stroke="#31A8FF" stroke-width="1.5" />
    <path d="M7 6.8H11.2C13 6.8 14.1 7.8 14.1 9.4C14.1 11.1 12.9 12.1 11.1 12.1H8.8V16.5H7V6.8ZM8.8 10.6H11C11.9 10.6 12.3 10.2 12.3 9.4C12.3 8.7 11.8 8.3 11 8.3H8.8V10.6Z" fill="#31A8FF" />
    <path d="M14.5 14.6C14.8 15.2 15.4 15.5 16.2 15.5C17.1 15.5 17.6 15.1 17.6 14.5C17.6 13.9 17.1 13.6 16.1 13.3C14.7 12.9 14.1 12.2 14.1 11.1C14.1 9.8 15.2 8.9 16.6 8.9C17.6 8.9 18.4 9.3 18.8 10.1L17.5 10.9C17.3 10.5 16.9 10.3 16.4 10.3C15.8 10.3 15.5 10.6 15.5 11C15.5 11.5 15.9 11.8 16.8 12.1C18.2 12.5 18.9 13.1 18.9 14.3C18.9 15.8 17.7 16.8 16.1 16.8C15 16.8 14.1 16.2 13.6 15.3L14.5 14.6Z" fill="#31A8FF" />
  </g>
  <!-- Id -->
  <g transform="translate(125, 18)">
    <rect width="24" height="24" rx="5" fill="#49021F" />
    <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="4.25" stroke="#FF3366" stroke-width="1.5" />
    <path d="M8.8 6.8H10.6V16.5H8.8V6.8Z" fill="#FF3366" />
    <path d="M12.4 11.8C12.4 9.9 13.4 8.7 15.1 8.7C16 8.7 16.7 9.1 17.1 9.8V6.8H18.9V16.5H17.2V15.5C16.8 16.2 16 16.7 15 16.7C13.4 16.7 12.4 15.3 12.4 13.3V11.8ZM14.2 12.8C14.2 14.3 14.9 15.2 15.9 15.2C16.9 15.2 17.3 14.4 17.3 13.3V12.1C17.3 11 16.8 10.2 15.8 10.2C14.8 10.2 14.2 11.2 14.2 12.8Z" fill="#FF3366" />
  </g>
  <!-- Figma -->
  <g transform="translate(180, 18)">
    <path d="M6 5.5A3.5 3.5 0 0 1 9.5 2H13v7H9.5A3.5 3.5 0 0 1 6 5.5z" fill="#F24E1E" />
    <path d="M13 2h3.5a3.5 3.5 0 1 1 0 7H13V2z" fill="#FF7262" />
    <path d="M13 9H9.5a3.5 3.5 0 1 0 0 7H13V9z" fill="#A259FF" />
    <path d="M13 9h3.5a3.5 3.5 0 1 1 0 7H13V9z" fill="#1ABCFE" />
    <path d="M6 19.5A3.5 3.5 0 0 0 9.5 23a3.5 3.5 0 0 0 3.5-3.5V16H9.5A3.5 3.5 0 0 0 6 19.5z" fill="#0ACF83" />
  </g>
</svg>
`;

sharp(Buffer.from(svg)).png().toFile('public/test_icons.png').then(() => console.log('Icons rendered ok'));
