export default function Footer() {
  return (
    <footer 
      className="text-center px-4 py-8 mt-12 text-muted-foreground"
      style={{ fontSize: '0.9rem' }}
    >
      <p className="max-w-3xl mx-auto leading-relaxed">
        El contenido de NutriMarvin es educativo y no sustituye la evaluación médica profesional.
        <br />
        Consulta a tu médico antes de hacer cambios significativos en tu alimentación o suplementación.
      </p>
    </footer>
  );
}
