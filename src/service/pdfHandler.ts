
// Interface para o arquivo PDF enviado pelo cliente
interface MultipartFile {
  filename: string;
  encoding: string;
  mimetype: string;
  file: NodeJS.ReadableStream;
}

/**
 * Helper function to process uploaded PDF files
 */
export async function processPdfUpload(file: MultipartFile): Promise<{ buffer: Buffer; filename: string }> {
  // Read file content
  const chunks: Uint8Array[] = [];
  for await (const chunk of file.file) {
    // Garantir que cada chunk seja convertido corretamente para Uint8Array
    if (Buffer.isBuffer(chunk)) {
      chunks.push(new Uint8Array(chunk));
    } else {
      chunks.push(new Uint8Array(Buffer.from(String(chunk))));
    }
  }

  const buffer = Buffer.concat(chunks);
  return { 
    buffer, 
    filename: file.filename 
  };
}
