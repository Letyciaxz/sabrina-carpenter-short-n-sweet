# Sabrina Carpenter — Short n’ Sweet Fan Experience

Projeto acadêmico fictício para a disciplina Desenvolvimento de Aplicações para Internet (HTML5, CSS3 e JavaScript puro).

## Como executar
1. Extraia o ZIP.
2. Abra a pasta no VS Code.
3. Abra `index.html` com a extensão **Live Server**.
4. Preencha a inscrição e clique em **CREATE MY PASS**.
5. Na área de check-in, use o código da credencial gerada e o código de equipe **SWEET2026**.
6. Depois do check-in, clique em **BAIXAR INGRESSO PDF**.

## Sobre o PDF
O site tenta gerar o PDF com jsPDF. Se a biblioteca externa não carregar, abre uma versão para impressão: escolha **Salvar como PDF** na caixa de impressão do navegador. Permita pop-ups se necessário.

## Sobre o QR Code
O QR Code é exibido por meio de matrizes locais pré-geradas em `qr-offline.js`, sem internet. Os códigos novos são escolhidos de uma lista de 1.024 códigos demonstrativos. Para testar, use uma inscrição nova; o código SWEET-7496C3CE63AB também é suportado. QR contém o código da credencial; o nome consta no texto alternativo da imagem.

## Requisitos contemplados
- HTML semântico, CSS responsivo e JavaScript puro separados
- Formulário com campos específicos do nicho
- Persistência em `localStorage` com JSON
- Credencial digital e QR Code em `img` (quando a biblioteca carrega)
- Check-in e liberação condicional do PDF
- PDF comemorativo ou impressão/salvamento como PDF

## Importante
Experiência **não oficial**, sem vínculo com Sabrina Carpenter, sua gravadora ou promotores. Não é ingresso real, não processa pagamentos e não valida acesso a eventos. O check-in é uma demonstração local, não uma autenticação segura. As imagens foram fornecidas como referências pelo usuário.

## Atualização do ingresso (23/11/2026)
O PDF agora reproduz o layout horizontal rosa da credencial do site, incluindo imagem, nome do participante, passe, música, código, QR e check-in. O rodapé do site e o PDF creditam **Maria Letícia da Silva Xavier**.

Se a biblioteca jsPDF não carregar, clique no botão de impressão da janela aberta e escolha **Salvar como PDF**.
