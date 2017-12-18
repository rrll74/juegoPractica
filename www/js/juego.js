var game;
var app =
{
    velocidadX: 0,
    velocidadY: 0,
    dificultad: 0,
    vidas: 3,
    roces: 0,
    puntuacion: 0,
    posicionnivel: 0,
    npgs: [],
    enemigoevaluado: null,
    naveactual: 0,
    naves: [],
    nivelesnpgs: null, // Dando un parámetro a info se puede generar una secuencia diferente de juego
    alto: document.documentElement.clientHeight,
    ancho: document.documentElement.clientWidth,
    puntuacionMaxima: 0,

    inicio: function()
    {
        this.nivelesnpgs = niveles.info();

        // Inicialización de Juego
        game = new Phaser.Game(this.ancho, this.alto, Phaser.CANVAS,'phaser');
        // Añadir los estados del juego por los que puede pasar. Siempre se ejecutan los atributos preload, create y update, además de las que se llamen en la función
        game.state.add("Menus", this.menus);
        game.state.add("Juego", this.iniciaJuego);
        // Iniciar el estado de juego
        game.state.start("Menus");
        app.iniciaJuego();
    },

    menus:
    {
        preload: function()
        {
            game.load.spritesheet('boton', 'img/play.png', 124, 124);
            game.load.image('fondo','img/deep-space.jpg');
            game.load.image('descripcion','img/descripcion.jpg');

            game.load.image('nave1', 'img/nave1.png');
            game.load.image('nave2', 'img/nave2.png');
            game.load.image('nave3', 'img/nave3.png');
            game.load.image('nave4', 'img/nave4.png');
            game.load.image('monstruo1','img/monstruo1.png');
            game.load.image('monstruo2','img/monstruo2.png');
            game.load.image('estrella','img/star.png');
        },
        create: function()
        {
            fondo = game.add.image(0,0,'fondo');
            fondo.height = app.alto;
            fondo.width = app.ancho;

            descripcion = game.add.image(20,160,'descripcion');
            descripcion.height = app.alto-230;
            descripcion.width = app.ancho-40;

            this.boton = game.add.button(game.world.centerX - 72, 20, 'boton', this.actionOnClick, this, 2, 1, 0);
            this.txtPuntuacion = game.add.text(20, app.alto-50, "Puntuación máxima: "+app.puntuacionMaxima, { fontSize: '25px', fill: '#757676' });

        },
        update: function()
        {
        },
        actionOnClick: function()
        {
            app.valoresIniciales();
            game.state.start("Juego");
        },
        boton: null
    },

    iniciaJuego:
    {

        preload: function()
        {
            app.vigilaSensores();

            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.world.setBounds(0,0,app.ancho,app.alto-25);

            game.stage.backgroundColor = '#F7E5D4';
        },

        create: function()
        {
            scoreText = game.add.text(0, app.alto-25, app.getText(), { fontSize: '20px', fill: '#757676' });

            fondo = game.add.image(0,0,'fondo');
            fondo.height = app.alto-25;
            fondo.width = app.ancho;


            nave1 = game.add.sprite(Math.round(app.ancho/2), Math.round(app.alto/2), 'nave1');
            game.physics.arcade.enable(nave1);
            nave1.body.collideWorldBounds = true;
            nave2 = game.add.sprite(-45, 50, 'nave2');
            nave3 = game.add.sprite(-45, 100, 'nave3');
            nave4 = game.add.sprite(-45, 150, 'nave4');
            app.naves = [nave1, nave2, nave3, nave4];



            for(var i=0; i<4; i++)
            {
                game.physics.arcade.enable(app.naves[i]);
            }

            game.time.events.loop(Phaser.Timer.SECOND,app.iniciaJuego.crearnpgs,this);

        },
        update: function()
        {
            app.naves[app.naveactual].body.velocity.y = (app.velocidadY * 300);
            app.naves[app.naveactual].body.velocity.x = (app.velocidadX * (-300));

            for(var j in app.npgs)
            {
                app.enemigoevaluado = app.npgs[j];
                game.physics.arcade.overlap(app.naves[app.naveactual], app.enemigoevaluado, this.choqueenemigo, null, this);
            }
        },
        crearnpgs: function()
        {
            var nivel = app.nivelesnpgs[app.dificultad];

            if (app.posicionnivel<nivel.totales)
            {
                var aCrear = nivel.posiciones[app.posicionnivel];
                if (aCrear!=null)
                {
                    if (aCrear.monstruo1!=undefined && aCrear.monstruo1!=null)
                    {
                        for (var i=0; i<aCrear.monstruo1.length; i++)
                        {
                            if (aCrear.monstruo1[i]<app.ancho) {
                                var m = game.add.sprite(aCrear.monstruo1[i],0,'monstruo1');
                                game.physics.arcade.enable(m);
                                m.body.velocity.y = 200+(app.dificultad);
                                m.body.collideWorldBounds = true;
                                m.body.onWorldBounds = new Phaser.Signal();
                                m.body.onWorldBounds.add(this.saleenemigo1, this);
                                app.npgs.push(m);
                            }
                        }
                    }
                    if (aCrear.monstruo2!=undefined && aCrear.monstruo2!=null)
                    {
                        for (var i=0; i<aCrear.monstruo2.length; i++)
                        {
                            if (aCrear.monstruo2[i]<app.ancho) {
                                var m = game.add.sprite(aCrear.monstruo2[i],0,'monstruo2');
                                game.physics.arcade.enable(m);
                                m.body.velocity.y = 100+app.dificultad;
                                m.body.collideWorldBounds = true;
                                m.body.onWorldBounds = new Phaser.Signal();
                                m.body.onWorldBounds.add(this.saleenemigo2, this);
                                app.npgs.push(m);
                            }
                        }
                    }
                    if (aCrear.estrella!=undefined && aCrear.estrella!=null)
                    {
                        for (var i=0; i<aCrear.estrella.length; i++)
                        {
                            if (aCrear.estrella[i]<app.ancho) {
                                var m = game.add.sprite(aCrear.estrella[i],0,'estrella');
                                game.physics.arcade.enable(m);
                                m.body.velocity.y = 125+app.dificultad;
                                m.body.collideWorldBounds = true;
                                m.body.onWorldBounds = new Phaser.Signal();
                                m.body.onWorldBounds.add(this.saleestrella, this);
                                app.npgs.push(m);
                            }
                        }
                    }
                }
                app.posicionnivel++;
            }
            else
            {
                if (app.dificultad<niveles.numeroTotalNiveles-1)
                {
                    app.posicionnivel = 0;
                    app.dificultad++;
                }
                else
                {
                    app.recomienza();
                }
            }
        },
        saleenemigo1: function(sprite)
        {
            sprite.destroy();
            app.agregarPuntuacion(1);
            app.printText();
        },
        saleenemigo2: function(sprite)
        {
            sprite.destroy();
            app.agregarPuntuacion(2);
            app.printText();
        },
        saleestrella: function(sprite)
        {
            sprite.destroy();
        },

        choqueenemigo: function()
        {
            if (app.enemigoevaluado.key=="estrella")
            {
                app.agregarPuntuacion(20);
            }
            else
            {
                app.roces++;
                if (app.roces>3)
                {
                    app.roces = 0;
                    if (app.vidas>0)
                    {
                        app.vidas--;
                    }
                    else
                    {
                        app.recomienza();
                    }
                }
            }

            var posx = app.naves[app.naveactual].body.x;
            var posy = app.naves[app.naveactual].body.y;

            app.enemigoevaluado.destroy();

            this.seleccionanave(app.roces, posx, posy);

            app.printText();
        },
        seleccionanave: function(navesel, x, y)
        {
            app.naves[app.naveactual].body.x = -45;
            app.naves[app.naveactual].body.y = app.naveactual*50;
            app.naves[app.naveactual].body.velocity.y = 0;
            app.naves[app.naveactual].body.velocity.x = 0;
            app.naves[app.naveactual].body.collideWorldBounds = false;

            app.naveactual = navesel;

            app.naves[navesel].body.x = x;
            app.naves[navesel].body.y = y;
            app.naves[app.naveactual].body.collideWorldBounds = true;
        }

    },
    valoresIniciales: function()
    {
        app.velocidadX = 0;
        app.velocidadY = 0;
        app.dificultad = 0;
        app.vidas = 3;
        app.roces = 0;
        app.puntuacion = 0;
        app.posicionnivel = 0;
        app.npgs = new Array();
        app.enemigoevaluado = null;
        app.naveactual = 0;

    },
    printText: function()
    {
        scoreText.text = app.getText();
    },
    getText: function()
    {
        return "PUNTOS: "+this.puntuacion+" VIDAS: "+this.vidas+" NIVEL: "+this.dificultad;
    },
    agregarPuntuacion: function(puntos)
    {
        app.puntuacion += puntos;
        if (app.puntuacionMaxima<app.puntuacion)
        {
            app.puntuacionMaxima = app.puntuacion;
        }
    },
    vigilaSensores: function()
    {

        function onError()
        {
            console.log('onError!');
        }

        function onSuccess(datosAceleracion)
        {
            app.detectaAgitacion(datosAceleracion);
            app.registraDireccion(datosAceleracion);
        }

        navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
    },
    detectaAgitacion: function(datosAceleracion)
    {
        var agitacionX = datosAceleracion.x > 10;
        var agitacionY = datosAceleracion.y > 10;

        if (agitacionX || agitacionY)
        {
            setTimeout(app.recomienza, 200);
        }
    },
    recomienza: function()
    {
        game.state.start("Menus");
    },
    registraDireccion: function(datosAceleracion)
    {
        this.velocidadX = datosAceleracion.x ;
        this.velocidadY = datosAceleracion.y ;
    }
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}