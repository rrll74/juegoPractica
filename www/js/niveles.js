// Cada segundo se van lanzando una linea de enemigos según el mapa generado

var niveles =
{
	semilla: 1,
	numeroTotalNiveles: 100,
	tiempoCadaNivel: 10,
	maxNpgsEnLinea: 9,
	ancho: document.documentElement.clientWidth,
	valores: null,

	info: function(seed)
	{
		if (seed==undefined)
		{
			if (this.valores == null)
			{
				this.nivelesAleatorios();
			}
		}
		else
		{
			this.semilla = seed;
			this.nivelesAleatorios();
		}
		return this.valores;
	},
	random: function()
	{
		var x = Math.sin(this.semilla++) * 10000;
		return x - Math.floor(x);
	},
	numeroAleatorioHasta: function(limite)
	{
		return Math.floor(this.random() * limite);
	},
	nivelesAleatorios: function()
	{
		this.valores = new Array();
		var totalNpgsACrear,totalMonstruos1,totalMonstruos2,totalEstrellas,posicionesM1,posicionesM2,posicionesE;
		for (var i = 0; i < this.numeroTotalNiveles; i++)
		{
			this.valores[i] = {totales: this.tiempoCadaNivel, posiciones: new Array()};
			for (var j = 0; j < this.tiempoCadaNivel; j++)
			{
				totalNpgsACrear = this.numeroAleatorioHasta(this.maxNpgsEnLinea);
				totalMonstruos1 = this.numeroAleatorioHasta(totalNpgsACrear);
				totalMonstruos2 = this.numeroAleatorioHasta(totalNpgsACrear-totalMonstruos1);
				totalEstrellas = this.numeroAleatorioHasta(totalNpgsACrear-totalMonstruos1-totalMonstruos2);
				posicionesM1 = new Array();
				for (var k = 0; k < totalMonstruos1; k++)
				{
					posicionesM1.push(this.numeroAleatorioHasta(this.ancho));
				}
				posicionesM2 = new Array();
				for (var k = 0; k < totalMonstruos2; k++)
				{
					posicionesM2.push(this.numeroAleatorioHasta(this.ancho));
				}
				posicionesE = new Array();
				for (var k = 0; k < totalEstrellas; k++)
				{
					posicionesE.push(this.numeroAleatorioHasta(this.ancho));
				}
				this.valores[i].posiciones.push({monstruo1: posicionesM1, monstruo2: posicionesM2, estrella: posicionesE});
			}
		}
	}
};
