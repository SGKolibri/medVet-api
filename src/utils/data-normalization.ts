// src/utils/data-normalization.ts
/**
 * Normaliza um CPF removendo caracteres não numéricos
 * @param cpf CPF a ser normalizado
 * @returns CPF normalizado ou null se o valor for inválido
 */
export function normalizeCpf(cpf: string | null | undefined): string | null {
  if (!cpf) return null;
  
  // Remove todos os caracteres não numéricos
  const normalized = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos após a normalização
  if (normalized.length !== 11) {
    return null;
  }
  
  return normalized;
}

/**
 * Normaliza um email removendo espaços e convertendo para minúsculo
 * @param email Email a ser normalizado
 * @returns Email normalizado ou null se o valor for inválido
 */
export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  
  // Remove espaços e converte para minúsculo
  const normalized = email.trim().toLowerCase();
  
  // Verifica se é um formato válido de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return null;
  }
  
  return normalized;
}

/**
 * Normaliza uma sequência removendo espaços e padronizando o formato
 * @param sequence Sequência a ser normalizada
 * @returns Sequência normalizada ou null se o valor for inválido
 */
export function normalizeSequence(sequence: string | null | undefined): string | null {
  if (!sequence) return null;
  
  // Remove espaços e converte para maiúsculo
  return sequence.trim().toUpperCase();
}
