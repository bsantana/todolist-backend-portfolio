module.exports = async (err, req, res, next) => {
    // TO-DO: Enviar stack error para o slack/cloudwatch
	console.error('Something broke!');
	console.error(err.stack);
	res.status(500).send({ message: 'Ops... um erro aconteceu! por favor informe ao administrador do sistema.' });
}