import mammoth from 'mammoth';
import { promises as fs } from 'fs';
import path from 'path';

async function extractDocx() {
  const docxPath = path.join(process.cwd(), 'attached_assets', 'Nutricion Funcional referencias_1760763719014.docx');
  const outputPath = path.join(process.cwd(), 'server', 'conocimiento-funcional.txt');
  
  try {
    const result = await mammoth.extractRawText({ path: docxPath });
    const text = result.value;
    
    await fs.writeFile(outputPath, text, 'utf-8');
    console.log(' Contenido extraído exitosamente');
    console.log(` Archivo guardado en: ${outputPath}`);
    console.log(` Longitud del contenido: ${text.length} caracteres`);
  } catch (error) {
    console.error(' Error extrayendo el documento:', error);
    process.exit(1);
  }
}

extractDocx();
