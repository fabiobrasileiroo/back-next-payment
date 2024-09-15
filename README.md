# Back

Api gateway pdv.

## RFs (Requisitos funcionais) 
> obs: é uma declaração de como um sistema deve se comportar

- [x] RF01: Implementar criação de produto.
- [x] RF02: Implementar listagem de produtos.
RF03: Implementar busca de produto por ID.
RF04: Implementar atualização de produto.
RF05: Implementar deleção de produto.
- [x] RF06: Implementar pagamento via PIX.
RF07: Implementar verificação de status de pagamento.
RF08: Implementar funcionalidade de reembolso.
RF09: Implementar envio de e-mail para cliente após pagamento.
RF10: Implementar relatório de transações.
RF11: Implementar relatório de produtos vendidos.
RF12: Implementar autenticação JWT para operações seguras.
RF13: Implementar registro de novos usuários.
RF14: Implementar controle de permissões por nível de usuário.


## RNs (Regras de negócio)
> obs: descreve um aspecto do negócio, definindo ou restringindo tanto sua estrutura quanto seu comportamento

RN01: Pagamento via PIX deve ser concluído em 30 minutos.
RN02: Produtos com pagamentos pendentes não podem ser deletados.
RN03: Pagamentos só podem ser feitos para produtos com estoque disponível.
RN04: Valor mínimo para transações é R$ 1,00.
RN05: Cada pagamento deve estar vinculado a um produto.
RN06: Notificação por e-mail após compra.
RN07: Preço de produto só pode ser atualizado sem pedidos pendentes.
RN08: Cliente pode cancelar pagamento antes de conclusão.
RN09: Cálculo automático de impostos.
RN10: Gerar QR Code para pagamento via PIX

## RNFs (requisitos não-funcionais)
> obs:  são os requisitos relacionados ao uso da aplicação em termos de desempenho, usabilidade, confiabilidade, segurança, disponibilidade, manutenção e tecnologias envolvidas. Estes requisitos dizem respeito a como as funcionalidades serão entregues ao usuário do software

RNF01: Garantir segurança dos dados (criptografia).
RNF02: Autenticação e autorização.
RNF03: Integração fácil com outros serviços.


# Dicas uteis

``` bash
npx prisma migrate dev --name init

npx prisma studio
