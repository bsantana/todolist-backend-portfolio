module.exports = (req, res, next) => {
	res.status(404).send({ message: "Desculpe, nada encontrado por aqui!" });
}