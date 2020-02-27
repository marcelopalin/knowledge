module.exports = {
  /** Com o objetivo de deixar as consultas mais complexas organizadas
   * vamos criar este arquivo.
   *  O objetivo desta consulta com WITH RECURSIVE é devolver o ID
   *  da categoria selecionada e todos os IDs dos seus filhos
   *  Por isso do nome categoryWithChildren = categoriaComFilhos
   *
   *  Esta consulta será realizada no arquivo api\article.js
   * 
   * Versão anterior:
   * 
   *         WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categories c
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
   * 
   *
   */

  categoryWithChildren: `
        with recursive cte (id, name, parentId) as (
            select id,
                name,
                parentId
            from categories
            where id = ?
            union all
            select c.id,
                c.name,
                c.parentId
            from categories c
                    inner join cte
                                on c.parentId = cte.id
        )
        select id
        from cte
    `,
};
