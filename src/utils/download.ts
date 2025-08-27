/**
 * Função utilitária para download de arquivos blob
 * @param blob - O blob do arquivo a ser baixado
 * @param filename - Nome do arquivo para download
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  // Criar URL do blob
  const url = window.URL.createObjectURL(blob);
  
  // Criar elemento de link temporário
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Adicionar ao DOM, clicar e remover
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpar URL do blob
  window.URL.revokeObjectURL(url);
};

/**
 * Função para formatar nome de arquivo de contracheque
 * @param employeeName - Nome do funcionário
 * @param competencia - Competência do contracheque
 * @param extension - Extensão do arquivo (padrão: pdf)
 */
export const formatPayslipFilename = (
  employeeName: string, 
  competencia: string, 
  extension: string = 'pdf'
): string => {
  // Remover acentos e caracteres especiais
  const normalizedName = employeeName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  // Formatar competência (assumindo formato YYYY-MM)
  const [year, month] = competencia.split('-');
  const formattedCompetencia = year && month ? `${month}-${year}` : competencia;
  
  return `contracheque-${formattedCompetencia}-${normalizedName}.${extension}`;
};

/**
 * Função para formatar nome de arquivo genérico
 * @param baseName - Nome base do arquivo
 * @param extension - Extensão do arquivo
 * @param timestamp - Se deve incluir timestamp (padrão: false)
 */
export const formatFilename = (
  baseName: string, 
  extension: string, 
  timestamp: boolean = false
): string => {
  let filename = baseName;
  
  if (timestamp) {
    const now = new Date();
    const timestampStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
    filename += `-${timestampStr}`;
  }
  
  return `${filename}.${extension}`;
};
