import './globals.css';

export const metadata = {
  title: 'CognitionX | Assignment 8',
  description: 'Conversational Chat Application with Google Gemini API',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-satoshi bg-white h-screen max-h-screen">{children}</body>
    </html>
  );
}