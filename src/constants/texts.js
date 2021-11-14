const { formatPrice } = require("../services");

module.exports = {
  stopMonitoring:
    "Agora vou parar por aqui 😕, mas pode me mandar um novo produto sempre que quiser 😁",
  continueMonitoring: `Ok! Vou continuar de olho então...`,
  yourInterestValue:
    "Legal! Vou monitorar para você, qual o valor deseja pagar?",
  dontForgot:
    "Não esqueça de responder a mensagem acima, senão não consigo rastrar pra você 😅",
  imVerify: (text) =>
    `Estou de 👀, te aviso assim que chegar a ${formatPrice(text)}`,
  hello:
    "Olá, eu sou o Senhor Preço Baixo, para que eu possa ajuda-lo a monitorar seu produto favorito basta me enviar um link do buscape.com.br de um produto ou o nome de um",
  deactiveOldMonitoring:
    "Ainda tinha um monitor ativo seu, desabilitei para ativar esse novo, td bem? Fechado!",
};
