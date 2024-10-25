<img src="https://github.com/user-attachments/assets/2e67f5fb-b109-4bac-8169-8d11ad27dd1b" alt="Descrição da imagem" width="200px">

# Back

Api gateway pdv.

<img src="https://github.com/user-attachments/assets/f5571745-708e-47bd-89d8-cd7a74f0929a" alt="Descrição da imagem" >

## RFs (Requisitos funcionais) 
> obs: é uma declaração de como um sistema deve se comportar

- [x] RF01: Implementar criação de produto.
- [x] RF02: Implementar listagem de produtos.
- [x] RF03: Implementar busca de produto por ID.
- [x] RF04: Implementar atualização de produto.
- [x] RF05: Implementar deleção de produto.
- [x] RF06: Implementar pagamento via PIX.
- [ ] RF07: Implementar verificação de status de pagamento.
- [ ] RF08: Implementar funcionalidade de reembolso.
- [ ] RF09: Implementar envio de e-mail para cliente após pagamento.
- [ ] RF10: Implementar relatório de transações.
- [ ] RF11: Implementar relatório de produtos vendidos.
- [x] RF12: Implementar autenticação JWT para operações seguras.
- [x] RF13: Implementar registro de novos usuários.
- [x] RF14: Implementar controle de permissões por nível de usuário.
- [x] RF15: Implementar envio de e-mail para usuarios para redefinir a senha.
- [x] RF16: Implementar incremento, decremento e status do estoque do produtos.

## RNs (Regras de negócio)
> obs: descreve um aspecto do negócio, definindo ou restringindo tanto sua estrutura quanto seu comportamento

- [ ] RN01: Pagamento via PIX deve ser concluído em 30 minutos.
- [ ] RN02: Produtos com pagamentos pendentes não podem ser deletados.
- [ ] RN03: Pagamentos só podem ser feitos para produtos com estoque disponível.
- [x] RN04: Valor mínimo para transações é R$ 1,00.
- [ ] RN05: Cada pagamento deve estar vinculado a um produto.
- [ ] RN06: Notificação por e-mail após compra.
- [ ] RN07: Preço de produto só pode ser atualizado sem pedidos pendentes.
- [ ] RN08: Cliente pode cancelar pagamento antes de conclusão.
- [ ] RN09: Cálculo automático de impostos.
- [x] RN10: Gerar QR Code para pagamento via PIX

## RNFs (requisitos não-funcionais)
> obs:  são os requisitos relacionados ao uso da aplicação em termos de desempenho, usabilidade, confiabilidade, segurança, disponibilidade, manutenção e tecnologias envolvidas. Estes requisitos dizem respeito a como as funcionalidades serão entregues ao usuário do software

- [x] RNF01: Garantir segurança dos dados (criptografia).
- [x] RNF02: Autenticação e autorização.
- [ ] RNF03: Integração fácil com outros serviços.


# Dicas uteis

``` bash
npx prisma migrate dev --name init

npx prisma studio
```

Link postman: https://documenter.getpostman.com/view/31945468/2sAXqp8PEf#15cc072c-b0ba-4f55-a2f1-51399fa75dc5
