function AboutPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h1>Informazioni</h1>
      <p>Applicazione meteo con API proxy e validazioni avanzate.</p>
      <ul>
        <li>/api/geocode per ricerca città.</li>
        <li>/v1/forecast per previsioni con parametri full supported.</li>
        <li>/api/weather per compatibilità legacy.</li>
      </ul>
    </div>
  );
}

export default AboutPage;
