Element.Properties.transform = {
    set: function(transform) {
        var property = 'transform';
        console.log(Browser);
        if (Browser.chrome) property = 'WebkitTransform';
        if (Browser.firefox) property = 'MozTransform';
        if (Browser.opera) property = 'OTransform';

        this.style[property] = transform;
        this.store('transform', transform);
    },

    get: function() {
        return this.retrieve('transform', '');
    }
};

Element.implement({
    setTransform: function(value) {
        return this.set('transform', value);
    },

    getTransform: function() {
        return this.get('transform');
    }
});

$(window).addEvent('domready', function() {
    var $hourWrap = $$('.hour-wrap');
    var $hourFront = $hourWrap.getElement('div.front');
    var $hourBack = $hourWrap.getElement('div.back');
    var $hourTop = $hourWrap.getElement('div.digit-top');
    var $hourBottom = $hourWrap.getElement('div.digit-bottom .front');

    var $minWrap = $$('.min-wrap');
    var $minFront = $minWrap.getElement('.digit-top .front'); // Sélecteur pour la partie avant des minutes
    var $minBack = $minWrap.getElement('.digit-top .back');   // Sélecteur pour la partie arrière des minutes
    var $minTop = $minWrap.getElement('div.digit-top');
    var $minBottom = $minWrap.getElement('div.digit-bottom .front');

    var currentHour = -1; // Initialise avec une valeur non valide
    var currentMin = -1; // Initialise avec une valeur non valide

    var setClock = function() {
        var time = new Date();
        var hour = time.getHours();
        var min = time.getMinutes();

        if (currentHour !== hour) {
            currentHour = hour;
            var hourText = hour < 10 ? '0' + hour : hour; // Ajoute un zéro devant si l'heure est inférieure à 10

            // Élément pour la nouvelle heure
            var $newHourTop = new Element('div', { class: 'digit-top', html: $hourTop.get('html'), style: 'z-index:1;' });
            var $newHourFront = $newHourTop.getElement('div.front');
            var $newHourBack = $newHourTop.getElement('div.back');

            $newHourFront.set('text', hourText);
            $hourWrap.adopt($newHourTop);

            // Animation
            $hourFront.setTransform('rotateX(180deg)');
            $hourBack.setTransform('rotateX(0deg)');
            $hourBack.setStyle('zIndex', 40);

            // Mettre à jour l'heure arrière
            $hourBack.set('text', hourText);

            (function() {
                $hourTop.destroy();
                $hourFront.destroy();
                $hourBack.destroy();

                $hourTop = $newHourTop;
                $hourFront = $newHourFront;
                $hourBack = $newHourBack;

                $hourTop.setStyle('zIndex', 10);
                $hourBottom.set('text', hourText);
            }).delay(800);
        }

        if (currentMin !== min) {
            currentMin = min;
            var minText = min < 10 ? '0' + min : min; // Ajoute un zéro devant si les minutes sont inférieures à 10

            // Élément pour les nouvelles minutes
            var $newMinTop = new Element('div', { class: 'digit-top', html: $minTop.get('html'), style: 'z-index:1;' });
            var $newMinFront = $newMinTop.getElement('div.front');
            var $newMinBack = $newMinTop.getElement('div.back');

            $newMinFront.set('text', minText);
            $minWrap.adopt($newMinTop);

            // Animation
            $minFront.setTransform('rotateX(180deg)');
            $minBack.setTransform('rotateX(0deg)');
            $minBack.setStyle('zIndex', 40);

            // Mettre à jour les minutes arrière
            $minBack.set('text', minText);

            (function() {
                $minTop.destroy();
                $minFront.destroy();
                $minBack.destroy();

                $minTop = $newMinTop;
                $minFront = $newMinFront;
                $minBack = $newMinBack;

                $minTop.setStyle('zIndex', 10);
                $minBottom.set('text', minText);
            }).delay(800);
        }
    }

    setClock.periodical(1000);
});
