module.exports = app => {
  /** Validador criado para verificar se o valor existe
   *  Ou existe, ou gera o Erro
   */
  function existsOrError(value, msg) {
    /** Se o valor NÃO estiver definido - lança o erro */
    if (!value) throw msg;
    /** o throw pode lançar ou string ou error - qualquer coisa */
    /** Se o valor é um array, se for array vazio - então considero que
     * não existe - geraremos uma exception  com throw
     */
    if (Array.isArray(value) && value.length === 0) throw msg;
    if (typeof value === 'string' && !value.trim()) throw msg;
  }

  /** Validador que usa o validador acima
   * só que AO CONTRÁRIO. Se quero verificar
   * Ou Não existe, ou gera o erro
   */
  function notExistsOrError(value, msg) {
    try {
      existsOrError(value, msg);
    } catch (msg) {
      return;
    }
    throw msg;
  }

  function equalsOrError(valueA, valueB, msg) {
    if (valueA !== valueB) throw msg;
  }

  /** Padrão do Consign - dentro de um module.exports
   * que recebe o app como parâmetro. Portanto
   * o acesso a estas funções se dá fazendo:
   * Dica de como utilizar:
   * const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
   * E então pode usar as funções diretamente no código ex:
   * existsOrError(user.name, 'Nome não informado')
   */
  return { existsOrError, notExistsOrError, equalsOrError };
};
