
function TestComponent ()  {
  console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL); // Debería mostrar la URL configurada

  return (
    <div>
      <p>API Base URL: {import.meta.env.VITE_API_BASE_URL}</p>
    </div>
  );
}

export default TestComponent;
