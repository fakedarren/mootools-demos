// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/8eff294bf56290a32b86a9b78d3695b6
// Or build this file again with packager using: packager build More/Chain.Wait More/Array.Extras More/Date.Extras More/Number.Format More/URI.Relative More/Hash.Extras More/Element.Pin More/Form.Request.Append More/Form.Validator.Inline More/Form.Validator.Extras More/OverText More/Fx.Accordion More/Fx.Move More/Fx.Reveal More/Fx.Slide More/Fx.SmoothScroll More/Fx.Sort More/Slider More/Sortables More/Request.JSONP More/Request.Queue More/Request.Periodical More/Assets More/Color More/Group More/Hash.Cookie More/HtmlTable.Zebra More/HtmlTable.Sort More/HtmlTable.Select More/Keyboard.Extras More/Scroller More/Tips More/Spinner More/Locale
/*
---

script: More.js

name: More

description: MooTools More

license: MIT-style license

authors:
  - Guillermo Rauch
  - Thomas Aylott
  - Scott Kyle
  - Arian Stolwijk
  - Tim Wienk
  - Christoph Pojer
  - Aaron Newton

requires:
  - Core/MooTools

provides: [MooTools.More]

...
*/

MooTools.More = {
	'version': '1.3.0.1',
	'build': '6dce99bed2792dffcbbbb4ddc15a1fb9a41994b5'
};


/*
---

script: Chain.Wait.js

name: Chain.Wait

description: value, Adds a method to inject pauses between chained events.

license: MIT-style license.

authors:
  - Aaron Newton

requires:
  - Core/Chain
  - Core/Element
  - Core/Fx
  - /MooTools.More

provides: [Chain.Wait]

...
*/

(function(){

	var wait = {
		wait(duration) {
			return this.chain(() => {
				this.callChain.delay(duration == null ? 500 : duration, this);
			});
		}
	};

	Chain.implement(wait);

	if (this.Fx){
		Fx.implement(wait);
		['Css', 'Tween', 'Elements'].each(cls => {
			if (Fx[cls]) Fx[cls].implement(wait);
		});
	}

	if (this.Element && this.Fx){
		Element.implement({

			chains(effects) {
				Array.from(effects || ['tween', 'morph', 'reveal']).each(function(effect){
					effect = this.get(effect);
					if (!effect) return;
					effect.setOptions({
						link:'chain'
					});
				}, this);
				return this;
			},

			pauseFx(duration, effect) {
				this.chains(effect).get(effect || 'tween').wait(duration);
				return this;
			}

		});
	}

})();


/*
---

script: Array.Extras.js

name: Array.Extras

description: Extends the Array native object to include useful methods to work with arrays.

license: MIT-style license

authors:
  - Christoph Pojer
  - Sebastian Markbåge

requires:
  - Core/Array

provides: [Array.Extras]

...
*/
Array.implement({

	min() {
		return Math.min.apply(null, this);
	},

	max() {
		return Math.max.apply(null, this);
	},

	average() {
		return this.length ? this.sum() / this.length : 0;
	},

	sum() {
        var result = 0;
        var l = this.length;
        if (l){
			while(l--) result += this[l];
		}
        return result;
    },

	unique() {
		return [].combine(this);
	},

	shuffle() {
		for (var i = this.length; i && --i;){
            var temp = this[i];
            var r = Math.floor(Math.random() * ( i + 1 ));
            this[i] = this[r];
            this[r] = temp;
        }
		return this;
	},

	reduce(fn, value) {
		var undefined;
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) value = value === undefined ? this[i] : fn.call(null, value, this[i], i, this);
		}
		return value;
	},

	reduceRight(fn, value) {
        var i = this.length;
        var undefined;
        while (i--){
			if (i in this) value = value === undefined ? this[i] : fn.call(null, value, this[i], i, this);
		}
        return value;
    }

});


/*
---

script: Object.Extras.js

name: Object.Extras

description: Extra Object generics, like getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Object
  - /MooTools.More

provides: [Object.Extras]

...
*/

((() => {

var defined = value => value != null;

Object.extend({

	getFromPath(source, key) {
		var parts = key.split('.');
		for (var i = 0, l = parts.length; i < l; i++){
			if (source.hasOwnProperty(parts[i])) source = source[parts[i]];
			else return null;
		}
		return source;
	},

	cleanValues(object, method) {
		method = method || defined;
		for (key in object) if (!method(object[key])){
			delete object[key];
		}
		return object;
	},

	erase(object, key) {
		if (object.hasOwnProperty(key)) delete object[key];
		return object;
	},

	run(object) {
		var args = Array.slice(arguments, 1);
		for (key in object) if (object[key].apply){
			object[key](...args);
		}
		return object;
	}

});

}))();


/*
---

script: Locale.js

name: Locale

description: Provides methods for localization.

license: MIT-style license

authors:
  - Aaron Newton
  - Arian Stolwijk

requires:
  - Core/Events
  - /Object.Extras
  - /MooTools.More

provides: [Locale, Lang]

...
*/

(function(){
    var current = null;
    var locales = {};
    var inherits = {};

    var getSet = set => {
        if (instanceOf(set, Locale.Set)) return set;
        else return locales[set];
    };

    var Locale = this.Locale = {

        define(locale, set, key, value) {
            var name;
            if (instanceOf(locale, Locale.Set)){
                name = locale.name;
                if (name) locales[name] = locale;
            } else {
                name = locale;
                if (!locales[name]) locales[name] = new Locale.Set(name);
                locale = locales[name];
            }

            if (set) locale.define(set, key, value);



            if (!current) current = locale;

            return locale;
        },

        use(locale) {
            locale = getSet(locale);

            if (locale){
                current = locale;

                this.fireEvent('change', locale);


            }

            return this;
        },

        getCurrent() {
            return current;
        },

        get(key, args) {
            return (current) ? current.get(key, args) : '';
        },

        inherit(locale, inherits, set) {
            locale = getSet(locale);

            if (locale) locale.inherit(inherits, set);
            return this;
        },

        list() {
            return Object.keys(locales);
        }

    };

    Object.append(Locale, new Events);

    Locale.Set = new Class({

        sets: {},

        inherits: {
            locales: [],
            sets: {}
        },

        initialize(name) {
            this.name = name || '';
        },

        define(set, key, value) {
            var defineData = this.sets[set];
            if (!defineData) defineData = {};

            if (key){
                if (typeOf(key) == 'object') defineData = Object.merge(defineData, key);
                else defineData[key] = value;
            }
            this.sets[set] = defineData;

            return this;
        },

        get(key, args, _base) {
            var value = Object.getFromPath(this.sets, key);
            if (value != null){
                var type = typeOf(value);
                if (type == 'function') value = value(...Array.from(args));
                else if (type == 'object') value = Object.clone(value);
                return value;
            }

            // get value of inherited locales
            var index = key.indexOf('.');

            var set = index < 0 ? key : key.substr(0, index);
            var names = (this.inherits.sets[set] || []).combine(this.inherits.locales).include('en-US');
            if (!_base) _base = [];

            for (var i = 0, l = names.length; i < l; i++){
                if (_base.contains(names[i])) continue;
                _base.include(names[i]);

                var locale = locales[names[i]];
                if (!locale) continue;

                value = locale.get(key, args, _base);
                if (value != null) return value;
            }

            return '';
        },

        inherit(names, set) {
            names = Array.from(names);

            if (set && !this.inherits.sets[set]) this.inherits.sets[set] = [];

            var l = names.length;
            while (l--) (set ? this.inherits.sets[set] : this.inherits.locales).unshift(names[l]);

            return this;
        }

    });
})();


/*
---

name: Locale.en-US.Date

description: Date messages for US English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Locale

provides: [Locale.en-US.Date]

...
*/

Locale.define('en-US', 'Date', {

	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	months_abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	days_abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

	// Culture's date order: MM/DD/YYYY
	dateOrder: ['month', 'date', 'year'],
	shortDate: '%m/%d/%Y',
	shortTime: '%I:%M%p',
	AM: 'AM',
	PM: 'PM',

	// Date.Extras
	ordinal(dayOfMonth) {
		// 1st, 2nd, 3rd, etc.
		return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
	},

	lessThanMinuteAgo: 'less than a minute ago',
	minuteAgo: 'about a minute ago',
	minutesAgo: '{delta} minutes ago',
	hourAgo: 'about an hour ago',
	hoursAgo: 'about {delta} hours ago',
	dayAgo: '1 day ago',
	daysAgo: '{delta} days ago',
	weekAgo: '1 week ago',
	weeksAgo: '{delta} weeks ago',
	monthAgo: '1 month ago',
	monthsAgo: '{delta} months ago',
	yearAgo: '1 year ago',
	yearsAgo: '{delta} years ago',

	lessThanMinuteUntil: 'less than a minute from now',
	minuteUntil: 'about a minute from now',
	minutesUntil: '{delta} minutes from now',
	hourUntil: 'about an hour from now',
	hoursUntil: 'about {delta} hours from now',
	dayUntil: '1 day from now',
	daysUntil: '{delta} days from now',
	weekUntil: '1 week from now',
	weeksUntil: '{delta} weeks from now',
	monthUntil: '1 month from now',
	monthsUntil: '{delta} months from now',
	yearUntil: '1 year from now',
	yearsUntil: '{delta} years from now'

});


/*
---

script: Date.js

name: Date

description: Extends the Date native object to include methods useful in managing dates.

license: MIT-style license

authors:
  - Aaron Newton
  - Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
  - Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
  - Scott Kyle - scott [at] appden.com; http://appden.com

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - /Locale
  - /Locale.en-US.Date
  - /MooTools.More

provides: [Date]

...
*/

(function(){

var Date = this.Date;

Date.Methods = {
	ms: 'Milliseconds',
	year: 'FullYear',
	min: 'Minutes',
	mo: 'Month',
	sec: 'Seconds',
	hr: 'Hours'
};

['Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
	'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
	'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds', 'UTCMilliseconds'].each(method => {
	Date.Methods[method.toLowerCase()] = method;
});

var pad = (what, length, string) => {
	if (!string) string = '0';
	return new Array(length - String(what).length + 1).join(string) + what;
};

Date.implement({

	set: function(prop, value){
		prop = prop.toLowerCase();
		var m = Date.Methods;
		if (m[prop]) this['set' + m[prop]](value);
		return this;
	}.overloadSetter(),

	get(prop) {
		prop = prop.toLowerCase();
		var m = Date.Methods;
		if (m[prop]) return this['get' + m[prop]]();
		return null;
	},

	clone() {
		return new Date(this.get('time'));
	},

	increment(interval, times) {
		interval = interval || 'day';
		times = times != null ? times : 1;

		switch (interval){
			case 'year':
				return this.increment('month', times * 12);
			case 'month':
				var d = this.get('date');
				this.set('date', 1).set('mo', this.get('mo') + times);
				return this.set('date', d.min(this.get('lastdayofmonth')));
			case 'week':
				return this.increment('day', times * 7);
			case 'day':
				return this.set('date', this.get('date') + times);
		}

		if (!Date.units[interval]) throw new Error(interval + ' is not a supported interval');

		return this.set('time', this.get('time') + times * Date.units[interval]());
	},

	decrement(interval, times) {
		return this.increment(interval, -1 * (times != null ? times : 1));
	},

	isLeapYear() {
		return Date.isLeapYear(this.get('year'));
	},

	clearTime() {
		return this.set({hr: 0, min: 0, sec: 0, ms: 0});
	},

	diff(date, resolution) {
		if (typeOf(date) == 'string') date = Date.parse(date);

		return ((date - this) / Date.units[resolution || 'day'](3, 3)).round(); // non-leap year, 30-day month
	},

	getLastDayOfMonth() {
		return Date.daysInMonth(this.get('mo'), this.get('year'));
	},

	getDayOfYear() {
		return (Date.UTC(this.get('year'), this.get('mo'), this.get('date') + 1)
			- Date.UTC(this.get('year'), 0, 1)) / Date.units.day();
	},

	getWeek() {
		return (this.get('dayofyear') / 7).ceil();
	},

	getOrdinal(day) {
		return Date.getMsg('ordinal', day || this.get('date'));
	},

	getTimezone() {
		return this.toString()
			.replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
			.replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
	},

	getGMTOffset() {
		var off = this.get('timezoneOffset');
		return ((off > 0) ? '-' : '+') + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
	},

	setAMPM(ampm) {
		ampm = ampm.toUpperCase();
		var hr = this.get('hr');
		if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
		else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
		return this;
	},

	getAMPM() {
		return (this.get('hr') < 12) ? 'AM' : 'PM';
	},

	parse(str) {
		this.set('time', Date.parse(str));
		return this;
	},

	isValid(date) {
		return !isNaN((date || this).valueOf());
	},

	format(f) {
		if (!this.isValid()) return 'invalid date';
		f = f || '%x %X';
		f = formats[f.toLowerCase()] || f; // replace short-hand with actual format
		var d = this;
		return f.replace(/%([a-z%])/gi,
			($0, $1) => {
				switch ($1){
					case 'a': return Date.getMsg('days_abbr')[d.get('day')];
					case 'A': return Date.getMsg('days')[d.get('day')];
					case 'b': return Date.getMsg('months_abbr')[d.get('month')];
					case 'B': return Date.getMsg('months')[d.get('month')];
					case 'c': return d.format('%a %b %d %H:%m:%S %Y');
					case 'd': return pad(d.get('date'), 2);
					case 'e': return pad(d.get('date'), 2, ' ');
					case 'H': return pad(d.get('hr'), 2);
					case 'I': return pad((d.get('hr') % 12) || 12, 2);
					case 'j': return pad(d.get('dayofyear'), 3);
					case 'k': return pad(d.get('hr'), 2, ' ');
					case 'l': return pad((d.get('hr') % 12) || 12, 2, ' ');
					case 'L': return pad(d.get('ms'), 3);
					case 'm': return pad((d.get('mo') + 1), 2);
					case 'M': return pad(d.get('min'), 2);
					case 'o': return d.get('ordinal');
					case 'p': return Date.getMsg(d.get('ampm'));
					case 's': return Math.round(d / 1000);
					case 'S': return pad(d.get('seconds'), 2);
					case 'U': return pad(d.get('week'), 2);
					case 'w': return d.get('day');
					case 'x': return d.format(Date.getMsg('shortDate'));
					case 'X': return d.format(Date.getMsg('shortTime'));
					case 'y': return d.get('year').toString().substr(2);
					case 'Y': return d.get('year');

					case 'z': return d.get('GMTOffset');
					case 'Z': return d.get('Timezone');
				}
				return $1;
			}
		);
	},

	toISOString() {
		return this.format('iso8601');
	}

});


Date.alias('toJSON', 'toISOString');
Date.alias('compare', 'diff');
Date.alias('strftime', 'format');

var formats = {
	db: '%Y-%m-%d %H:%M:%S',
	compact: '%Y%m%dT%H%M%S',
	iso8601: '%Y-%m-%dT%H:%M:%S%T',
	rfc822: '%a, %d %b %Y %H:%M:%S %Z',
	'short': '%d %b %H:%M',
	'long': '%B %d, %Y %H:%M'
};

var parsePatterns = [];
var nativeParse = Date.parse;

var parseWord = (type, word, num) => {
	var ret = -1;
	var translated = Date.getMsg(type + 's');
	switch (typeOf(word)){
		case 'object':
			ret = translated[word.get(type)];
			break;
		case 'number':
			ret = translated[word];
			if (!ret) throw new Error('Invalid ' + type + ' index: ' + word);
			break;
		case 'string':
			var match = translated.filter(function(name){
				return this.test(name);
			}, new RegExp('^' + word, 'i'));
			if (!match.length) throw new Error('Invalid ' + type + ' string');
			if (match.length > 1) throw new Error('Ambiguous ' + type);
			ret = match[0];
	}

	return (num) ? translated.indexOf(ret) : ret;
};

Date.extend({

	getMsg(key, args) {
		return Locale.get('Date.' + key, args);
	},

	units: {
		ms: Function.from(1),
		second: Function.from(1000),
		minute: Function.from(60000),
		hour: Function.from(3600000),
		day: Function.from(86400000),
		week: Function.from(608400000),
		month(month, year) {
			var d = new Date;
			return Date.daysInMonth(month != null ? month : d.get('mo'), year != null ? year : d.get('year')) * 86400000;
		},
		year(year) {
			year = year || new Date().get('year');
			return Date.isLeapYear(year) ? 31622400000 : 31536000000;
		}
	},

	daysInMonth(month, year) {
		return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	},

	isLeapYear(year) {
		return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	},

	parse(from) {
		var t = typeOf(from);
		if (t == 'number') return new Date(from);
		if (t != 'string') return from;
		from = from.clean();
		if (!from.length) return null;

		var parsed;
		parsePatterns.some(pattern => {
			var bits = pattern.re.exec(from);
			return (bits) ? (parsed = pattern.handler(bits)) : false;
		});
		return parsed || new Date(nativeParse(from));
	},

	parseDay(day, num) {
		return parseWord('day', day, num);
	},

	parseMonth(month, num) {
		return parseWord('month', month, num);
	},

	parseUTC(value) {
		var localDate = new Date(value);
		var utcSeconds = Date.UTC(
			localDate.get('year'),
			localDate.get('mo'),
			localDate.get('date'),
			localDate.get('hr'),
			localDate.get('min'),
			localDate.get('sec'),
			localDate.get('ms')
		);
		return new Date(utcSeconds);
	},

	orderIndex(unit) {
		return Date.getMsg('dateOrder').indexOf(unit) + 1;
	},

	defineFormat(name, format) {
		formats[name] = format;
	},

	defineFormats(formats) {
		for (var name in formats) Date.defineFormat(name, formats[name]);
	},



	defineParser(pattern) {
		parsePatterns.push((pattern.re && pattern.handler) ? pattern : build(pattern));
	},

	defineParsers(...args) {
		Array.flatten(args).each(Date.defineParser);
	},

	define2DigitYearStart(year) {
		startYear = year % 100;
		startCentury = year - startYear;
	}

});

var startCentury = 1900;
var startYear = 70;

var regexOf = type => new RegExp('(?:' + Date.getMsg(type).map(name => name.substr(0, 3)).join('|') + ')[a-z]*');

var replacers = key => {
	switch(key){
		case 'x': // iso8601 covers yyyy-mm-dd, so just check if month is first
			return ((Date.orderIndex('month') == 1) ? '%m[-./]%d' : '%d[-./]%m') + '([-./]%y)?';
		case 'X':
			return '%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%T?';
	}
	return null;
};

var keys = {
	d: /[0-2]?[0-9]|3[01]/,
	H: /[01]?[0-9]|2[0-3]/,
	I: /0?[1-9]|1[0-2]/,
	M: /[0-5]?\d/,
	s: /\d+/,
	o: /[a-z]*/,
	p: /[ap]\.?m\.?/,
	y: /\d{2}|\d{4}/,
	Y: /\d{4}/,
	T: /Z|[+-]\d{2}(?::?\d{2})?/
};

keys.m = keys.I;
keys.S = keys.M;

var currentLanguage;

var recompile = language => {
	currentLanguage = language;

	keys.a = keys.A = regexOf('days');
	keys.b = keys.B = regexOf('months');

	parsePatterns.each((pattern, i) => {
		if (pattern.format) parsePatterns[i] = build(pattern.format);
	});
};

var build = format => {
	if (!currentLanguage) return {format};

	var parsed = [];
	var re = (format.source || format) // allow format to be regex
	 .replace(/%([a-z])/gi,
		($0, $1) => replacers($1) || $0
	).replace(/\((?!\?)/g, '(?:') // make all groups non-capturing
	 .replace(/ (?!\?|\*)/g, ',? ') // be forgiving with spaces and commas
	 .replace(/%([a-z%])/gi,
		($0, $1) => {
			var p = keys[$1];
			if (!p) return $1;
			parsed.push($1);
			return '(' + p.source + ')';
		}
	).replace(/\[a-z\]/gi, '[a-z\\u00c0-\\uffff;\&]'); // handle unicode words

	return {
		format,
		re: new RegExp('^' + re + '$', 'i'),
		handler(bits) {
            bits = bits.slice(1).associate(parsed);
            var date = new Date().clearTime();
            var year = bits.y || bits.Y;

            if (year != null) handle.call(date, 'y', year); // need to start in the right year
            if ('d' in bits) handle.call(date, 'd', 1);
            if ('m' in bits || 'b' in bits || 'B' in bits) handle.call(date, 'm', 1);

            for (var key in bits) handle.call(date, key, bits[key]);
            return date;
        }
	};
};

var handle = function(key, value){
	if (!value) return this;

	switch(key){
		case 'a': case 'A': return this.set('day', Date.parseDay(value, true));
		case 'b': case 'B': return this.set('mo', Date.parseMonth(value, true));
		case 'd': return this.set('date', value);
		case 'H': case 'I': return this.set('hr', value);
		case 'm': return this.set('mo', value - 1);
		case 'M': return this.set('min', value);
		case 'p': return this.set('ampm', value.replace(/\./g, ''));
		case 'S': return this.set('sec', value);
		case 's': return this.set('ms', ('0.' + value) * 1000);
		case 'w': return this.set('day', value);
		case 'Y': return this.set('year', value);
		case 'y':
			value = +value;
			if (value < 100) value += startCentury + (value < startYear ? 100 : 0);
			return this.set('year', value);
		case 'T':
			if (value == 'Z') value = '+00';
			var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
			offset = (offset[1] + '1') * (offset[2] * 60 + (+offset[3] || 0)) + this.getTimezoneOffset();
			return this.set('time', this - offset * 60000);
	}

	return this;
};

Date.defineParsers(
	'%Y([-./]%m([-./]%d((T| )%X)?)?)?', // "1999-12-31", "1999-12-31 11:59pm", "1999-12-31 23:59:59", ISO8601
	'%Y%m%d(T%H(%M%S?)?)?', // "19991231", "19991231T1159", compact
	'%x( %X)?', // "12/31", "12.31.99", "12-31-1999", "12/31/2008 11:59 PM"
	'%d%o( %b( %Y)?)?( %X)?', // "31st", "31st December", "31 Dec 1999", "31 Dec 1999 11:59pm"
	'%b( %d%o)?( %Y)?( %X)?', // Same as above with month and day switched
	'%Y %b( %d%o( %X)?)?', // Same as above with year coming first
	'%o %b %d %X %T %Y' // "Thu Oct 22 08:11:23 +0000 2009"
);

Locale.addEvent('change', language => {
	if (Locale.get('Date')) recompile(language);
}).fireEvent('change', Locale.getCurrent());

})();


/*
---

script: Date.Extras.js

name: Date.Extras

description: Extends the Date native object to include extra methods (on top of those in Date.js).

license: MIT-style license

authors:
  - Aaron Newton
  - Scott Kyle

requires:
  - /Date

provides: [Date.Extras]

...
*/

Date.implement({

	timeDiffInWords(relative_to) {
		return Date.distanceOfTimeInWords(this, relative_to || new Date);
	},

	timeDiff(to, joiner) {
        if (to == null) to = new Date;
        var delta = ((to - this) / 1000).toInt();
        if (!delta) return '0s';

        var durations = {s: 60, m: 60, h: 24, d: 365, y: 0};
        var duration;
        var vals = [];

        for (var step in durations){
			if (!delta) break;
			if ((duration = durations[step])){
				vals.unshift((delta % duration) + step);
				delta = (delta / duration).toInt();
			} else {
				vals.unshift(delta + step);
			}
		}

        return vals.join(joiner || ':');
    }

});

Date.alias('timeAgoInWords', 'timeDiffInWords');

Date.extend({

	distanceOfTimeInWords(from, to) {
		return Date.getTimePhrase(((to - from) / 1000).toInt());
	},

	getTimePhrase(delta) {
		var suffix = (delta < 0) ? 'Until' : 'Ago';
		if (delta < 0) delta *= -1;

		var units = {
			minute: 60,
			hour: 60,
			day: 24,
			week: 7,
			month: 52 / 12,
			year: 12,
			eon: Infinity
		};

		var msg = 'lessThanMinute';

		for (var unit in units){
			var interval = units[unit];
			if (delta < 1.5 * interval){
				if (delta > 0.75 * interval) msg = unit;
				break;
			}
			delta /= interval;
			msg = unit + 's';
		}

		delta = delta.round();
		return Date.getMsg(msg + suffix, delta).substitute({delta});
	}

});


Date.defineParsers(

	{
		// "today", "tomorrow", "yesterday"
		re: /^(?:tod|tom|yes)/i,
		handler(bits) {
			var d = new Date().clearTime();
			switch(bits[0]){
				case 'tom': return d.increment();
				case 'yes': return d.decrement();
				default: 	return d;
			}
		}
	},

	{
		// "next Wednesday", "last Thursday"
		re: /^(next|last) ([a-z]+)$/i,
		handler(bits) {
			var d = new Date().clearTime();
			var day = d.getDay();
			var newDay = Date.parseDay(bits[2], true);
			var addDays = newDay - day;
			if (newDay <= day) addDays += 7;
			if (bits[1] == 'last') addDays -= 7;
			return d.set('date', d.getDate() + addDays);
		}
	}

);


/*
---

name: Locale.en-US.Number

description: Number messages for US English.

license: MIT-style license

authors:
  - Arian Stolwijk

requires:
  - /Locale

provides: [Locale.en-US.Number]

...
*/

Locale.define('en-US', 'Number', {

	decimal: '.',
	group: ',',

/* 	Commented properties are the defaults for Number.format
	decimals: 0,
	precision: 0,
	scientific: null,

	prefix: null,
	suffic: null,

	// Negative/Currency/percentage will mixin Number
	negative: {
		prefix: '-'
	},*/

	currency: {
//		decimals: 2,
		prefix: '$ '
	}/*,

	percentage: {
		decimals: 2,
		suffix: '%'
	}*/

});




/*
---

name: Number.Format

description: Extends the Number Type object to include a number formatting method.

license: MIT-style license

authors:
  - Arian Stolwijk

requires:
  - Core/Number
  - /Locale.en-US.Number

provides: [Number.Extras]

...
*/


Number.implement({

	format(options) {
        // Thanks dojo and YUI for some inspiration
        var value = this;
        if (!options) options = {};
        var getOption = key => {
			if (options[key] != null) return options[key];
			return Locale.get('Number.' + key);
		};

        var negative = value < 0;
        var decimal = getOption('decimal');
        var precision = getOption('precision');
        var group = getOption('group');
        var decimals = getOption('decimals');

        if (negative){
			var negativeLocale = Locale.get('Number.negative') || {};
			if (negativeLocale.prefix == null && negativeLocale.suffix == null) negativeLocale.prefix = '-';
			Object.each(negativeLocale, (value, key) => {
				options[key] = (key == 'prefix' || key == 'suffix') ? (getOption(key) + value) : value;
			});

			value = -value;
		}

        var prefix = getOption('prefix');
        var suffix = getOption('suffix');

        if (decimals > 0 && decimals <= 20) value = value.toFixed(decimals);
        if (precision >= 1 && precision <= 21) value = value.toPrecision(precision);

        value += '';

        if (getOption('scientific') === false && value.indexOf('e') > -1){
            var match = value.split('e');
            var index;
            var zeros = +match[1];
            value = match[0].replace('.', '');

            if (zeros < 0){
				zeros = -zeros - 1;
				index = match[0].indexOf('.');
				if (index > -1) zeros -= index - 1;
				while (zeros--) value = '0' + value;
				value = '0.' + value;
			} else {
				index = match[0].lastIndexOf('.');
				if (index > -1) zeros -= match[0].length - index - 1;
				while (zeros--) value += '0';
			}
        }

        if (decimal != '.') value = value.replace('.', decimal);

        if (group){
            index = value.lastIndexOf(decimal);
            index = (index > -1) ? index : value.length;
            var newOutput = value.substring(index);
            var i = index;

            while (i--){
				if ((index - i - 1) % 3 == 0 && i != (index - 1)) newOutput = group + newOutput;
				newOutput = value.charAt(i) + newOutput;
			}

            value = newOutput;
        }

        if (prefix) value = prefix + value;
        if (suffix) value += suffix;

        return value;
    },

	formatCurrency() {
		var locale = Locale.get('Number.currency') || {};
		if (locale.scientific == null) locale.scientific = false;
		if (locale.decimals == null) locale.decimals = 2;

		return this.format(locale);
	},

	formatPercentage() {
		var locale = Locale.get('Number.percentage') || {};
		if (locale.suffix == null) locale.suffix = '%';
		if (locale.decimals == null) locale.decimals = 2;

		return this.format(locale);
	}

});


/*
---

script: Class.Refactor.js

name: Class.Refactor

description: Extends a class onto itself with new property, preserving any items attached to the class's namespace.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Class
  - /MooTools.More

# Some modules declare themselves dependent on Class.Refactor
provides: [Class.refactor, Class.Refactor]

...
*/

Class.refactor = (original, refactors) => {

	Object.each(refactors, (item, name) => {
		var origin = original.prototype[name];
		if (origin && origin.$origin) origin = origin.$origin;
		if (origin && typeof item == 'function'){
			original.implement(name, function(...args) {
				var old = this.previous;
				this.previous = origin;
				var value = item.apply(this, args);
				this.previous = old;
				return value;
			});
		} else {
			original.implement(name, item);
		}
	});

	return original;

};


/*
---

script: String.QueryString.js

name: String.QueryString

description: Methods for dealing with URI query strings.

license: MIT-style license

authors:
  - Sebastian Markbåge
  - Aaron Newton
  - Lennart Pilon
  - Valerio Proietti

requires:
  - Core/Array
  - Core/String
  - /MooTools.More

provides: [String.QueryString]

...
*/

String.implement({

	parseQueryString(decodeKeys, decodeValues) {
        if (decodeKeys == null) decodeKeys = true;
        if (decodeValues == null) decodeValues = true;

        var vars = this.split(/[&;]/);
        var object = {};
        if (!vars.length) return object;

        vars.each(val => {
            var index = val.indexOf('=');
            var value = val.substr(index + 1);
            var keys = index < 0 ? [''] : val.substr(0, index).match(/([^\]\[]+|(\B)(?=\]))/g);
            var obj = object;

            if (decodeValues) value = decodeURIComponent(value);
            keys.each((key, i) => {
				if (decodeKeys) key = decodeURIComponent(key);
				var current = obj[key];

				if (i < keys.length - 1) obj = obj[key] = current || {};
				else if (typeOf(current) == 'array') current.push(value);
				else obj[key] = current != null ? [current, value] : value;
			});
        });

        return object;
    },

	cleanQueryString(method) {
		return this.split('&').filter(val => {
            var index = val.indexOf('=');
            var key = index < 0 ? '' : val.substr(0, index);
            var value = val.substr(index + 1);

            return method ? method.call(null, key, value) : (value || value === 0);
        }).join('&');
	}

});


/*
---

script: URI.js

name: URI

description: Provides methods useful in managing the window location and uris.

license: MIT-style license

authors:
  - Sebastian Markbåge
  - Aaron Newton

requires:
  - Core/Object
  - Core/Class
  - Core/Class.Extras
  - Core/Element
  - /String.QueryString

provides: [URI]

...
*/

(function(){

var toString = function(){
	return this.get('value');
};

var URI = this.URI = new Class({

	Implements: Options,

	options: {
		/*base: false*/
	},

	regex: /^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
	parts: ['scheme', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment'],
	schemes: {http: 80, https: 443, ftp: 21, rtsp: 554, mms: 1755, file: 0},

	initialize(uri, options) {
		this.setOptions(options);
		var base = this.options.base || URI.base;
		if (!uri) uri = base;

		if (uri && uri.parsed) this.parsed = Object.clone(uri.parsed);
		else this.set('value', uri.href || uri.toString(), base ? new URI(base) : false);
	},

	parse(value, base) {
		var bits = value.match(this.regex);
		if (!bits) return false;
		bits.shift();
		return this.merge(bits.associate(this.parts), base);
	},

	merge(bits, base) {
		if ((!bits || !bits.scheme) && (!base || !base.scheme)) return false;
		if (base){
			this.parts.every(part => {
				if (bits[part]) return false;
				bits[part] = base[part] || '';
				return true;
			});
		}
		bits.port = bits.port || this.schemes[bits.scheme.toLowerCase()];
		bits.directory = bits.directory ? this.parseDirectory(bits.directory, base ? base.directory : '') : '/';
		return bits;
	},

	parseDirectory(directory, baseDirectory) {
		directory = (directory.substr(0, 1) == '/' ? '' : (baseDirectory || '/')) + directory;
		if (!directory.test(URI.regs.directoryDot)) return directory;
		var result = [];
		directory.replace(URI.regs.endSlash, '').split('/').each(dir => {
			if (dir == '..' && result.length > 0) result.pop();
			else if (dir != '.') result.push(dir);
		});
		return result.join('/') + '/';
	},

	combine(bits) {
		return bits.value || bits.scheme + '://' +
			(bits.user ? bits.user + (bits.password ? ':' + bits.password : '') + '@' : '') +
			(bits.host || '') + (bits.port && bits.port != this.schemes[bits.scheme] ? ':' + bits.port : '') +
			(bits.directory || '/') + (bits.file || '') +
			(bits.query ? '?' + bits.query : '') +
			(bits.fragment ? '#' + bits.fragment : '');
	},

	set(part, value, base) {
		if (part == 'value'){
			var scheme = value.match(URI.regs.scheme);
			if (scheme) scheme = scheme[1];
			if (scheme && this.schemes[scheme.toLowerCase()] == null) this.parsed = { scheme, value };
			else this.parsed = this.parse(value, (base || this).parsed) || (scheme ? { scheme, value } : { value });
		} else if (part == 'data'){
			this.setData(value);
		} else {
			this.parsed[part] = value;
		}
		return this;
	},

	get(part, base) {
		switch(part){
			case 'value': return this.combine(this.parsed, base ? base.parsed : false);
			case 'data' : return this.getData();
		}
		return this.parsed[part] || '';
	},

	go() {
		document.location.href = this.toString();
	},

	toURI() {
		return this;
	},

	getData(key, part) {
		var qs = this.get(part || 'query');
		if (!(qs || qs === 0)) return key ? null : {};
		var obj = qs.parseQueryString();
		return key ? obj[key] : obj;
	},

	setData(values, merge, part) {
		if (typeof values == 'string'){
			var data = this.getData();
			data[arguments[0]] = arguments[1];
			values = data;
		} else if (merge){
			values = Object.merge(this.getData(), values);
		}
		return this.set(part || 'query', Object.toQueryString(values));
	},

	clearData(part) {
		return this.set(part || 'query', '');
	},

	toString,
	valueOf: toString

});

URI.regs = {
	endSlash: /\/$/,
	scheme: /^(\w+):/,
	directoryDot: /\.\/|\.$/
};

URI.base = new URI(Array.from(document.getElements('base[href]', true)).getLast(), {base: document.location});

String.implement({

	toURI(options) {
		return new URI(this, options);
	}

});

})();


/*
---

script: URI.Relative.js

name: URI.Relative

description: Extends the URI class to add methods for computing relative and absolute urls.

license: MIT-style license

authors:
  - Sebastian Markbåge


requires:
  - /Class.refactor
  - /URI

provides: [URI.Relative]

...
*/

URI = Class.refactor(URI, {

	combine(bits, base) {
        if (!base || bits.scheme != base.scheme || bits.host != base.host || bits.port != base.port)
			return this.previous(...arguments);
        var end = bits.file + (bits.query ? '?' + bits.query : '') + (bits.fragment ? '#' + bits.fragment : '');

        if (!base.directory) return (bits.directory || (bits.file ? '' : './')) + end;

        var baseDir = base.directory.split('/');
        var relDir = bits.directory.split('/');
        var path = '';
        var offset;

        var i = 0;
        for (offset = 0; offset < baseDir.length && offset < relDir.length && baseDir[offset] == relDir[offset]; offset++);
        for (i = 0; i < baseDir.length - offset - 1; i++) path += '../';
        for (i = offset; i < relDir.length - 1; i++) path += relDir[i] + '/';

        return (path || (bits.file ? '' : './')) + end;
    },

	toAbsolute(base) {
		base = new URI(base);
		if (base) base.set('directory', '').set('file', '');
		return this.toRelative(base);
	},

	toRelative(base) {
		return this.get('value', new URI(base));
	}

});


/*
---

name: Hash

description: Contains Hash Prototypes. Provides a means for overcoming the JavaScript practical impossibility of extending native Objects.

license: MIT-style license.

requires:
  - Core/Object
  - /MooTools.More

provides: [Hash]

...
*/

(function(){

if (this.Hash) return;

var Hash = this.Hash = new Type('Hash', function(object){
	if (typeOf(object) == 'hash') object = Object.clone(object.getClean());
	for (var key in object) this[key] = object[key];
	return this;
});

this.$H = object => new Hash(object);

Hash.implement({

	forEach(fn, bind) {
		Object.forEach(this, fn, bind);
	},

	getClean() {
		var clean = {};
		for (var key in this){
			if (this.hasOwnProperty(key)) clean[key] = this[key];
		}
		return clean;
	},

	getLength() {
		var length = 0;
		for (var key in this){
			if (this.hasOwnProperty(key)) length++;
		}
		return length;
	}

});

Hash.alias('each', 'forEach');

Hash.implement({

	has: Object.prototype.hasOwnProperty,

	keyOf(value) {
		return Object.keyOf(this, value);
	},

	hasValue(value) {
		return Object.contains(this, value);
	},

	extend(properties) {
		Hash.each(properties || {}, function(value, key){
			Hash.set(this, key, value);
		}, this);
		return this;
	},

	combine(properties) {
		Hash.each(properties || {}, function(value, key){
			Hash.include(this, key, value);
		}, this);
		return this;
	},

	erase(key) {
		if (this.hasOwnProperty(key)) delete this[key];
		return this;
	},

	get(key) {
		return (this.hasOwnProperty(key)) ? this[key] : null;
	},

	set(key, value) {
		if (!this[key] || this.hasOwnProperty(key)) this[key] = value;
		return this;
	},

	empty() {
		Hash.each(this, function(value, key){
			delete this[key];
		}, this);
		return this;
	},

	include(key, value) {
		if (this[key] == undefined) this[key] = value;
		return this;
	},

	map(fn, bind) {
		return new Hash(Object.map(this, fn, bind));
	},

	filter(fn, bind) {
		return new Hash(Object.filter(this, fn, bind));
	},

	every(fn, bind) {
		return Object.every(this, fn, bind);
	},

	some(fn, bind) {
		return Object.some(this, fn, bind);
	},

	getKeys() {
		return Object.keys(this);
	},

	getValues() {
		return Object.values(this);
	},

	toQueryString(base) {
		return Object.toQueryString(this, base);
	}

});

Hash.alias({indexOf: 'keyOf', contains: 'hasValue'});


})();



/*
---

script: Hash.Extras.js

name: Hash.Extras

description: Extends the Hash Type to include getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Hash
  - /Object.Extras

provides: [Hash.Extras]

...
*/

Hash.implement({

	getFromPath(notation) {
		return Object.getFromPath(this, notation);
	},

	cleanValues(method) {
		return new Hash(Object.cleanValues(this, method));
	},

	run(...args) {
		Object.run(args);
	}

});


/*
---

script: Element.Pin.js

name: Element.Pin

description: Extends the Element native object to include the pin method useful for fixed positioning for elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Event
  - Core/Element.Dimensions
  - Core/Element.Style
  - /MooTools.More

provides: [Element.Pin]

...
*/

((() => {
    var supportsPositionFixed = false;
    var supportTested = false;

    var testPositionFixed = () => {
		var test = new Element('div').setStyles({
			position: 'fixed',
			top: 0,
			right: 0
		}).inject(document.body);
		supportsPositionFixed = (test.offsetTop === 0);
		test.dispose();
		supportTested = true;
	}

    Element.implement({

		pin(enable, forceScroll) {
            if (!supportTested) testPositionFixed();
            if (this.getStyle('display') == 'none') return this;

            var pinnedPosition;
            var scroll = window.getScroll();

            if (enable !== false){
				pinnedPosition = this.getPosition(supportsPositionFixed ? document.body : this.getOffsetParent());
				if (!this.retrieve('pin:_pinned')){
					var currentPosition = {
						top: pinnedPosition.y - scroll.y,
						left: pinnedPosition.x - scroll.x
					};

					if (supportsPositionFixed && !forceScroll){
						this.setStyle('position', 'fixed').setStyles(currentPosition);
					} else {
                        var parent = this.getOffsetParent();
                        var position = this.getPosition(parent);
                        var styles = this.getStyles('left', 'top');

                        if (parent && styles.left == 'auto' || styles.top == 'auto') this.setPosition(position);
                        if (this.getStyle('position') == 'static') this.setStyle('position', 'absolute');

                        position = {
							x: styles.left.toInt() - scroll.x,
							y: styles.top.toInt() - scroll.y
						};

                        var scrollFixer = () => {
							if (!this.retrieve('pin:_pinned')) return;
							var scroll = window.getScroll();
							this.setStyles({
								left: position.x + scroll.x,
								top: position.y + scroll.y
							});
						};

                        this.store('pin:_scrollFixer', scrollFixer);
                        window.addEvent('scroll', scrollFixer);
                    }
					this.store('pin:_pinned', true);
				}

			} else {
                if (!this.retrieve('pin:_pinned')) return this;

                var parent = this.getParent();
                var offsetParent = (parent.getComputedStyle('position') != 'static' ? parent : parent.getOffsetParent());

                pinnedPosition = this.getPosition(offsetParent);

                this.store('pin:_pinned', false);
                var scrollFixer = this.retrieve('pin:_scrollFixer');
                if (!scrollFixer){
					this.setStyles({
						position: 'absolute',
						top: pinnedPosition.y + scroll.y,
						left: pinnedPosition.x + scroll.x
					});
				} else {
					this.store('pin:_scrollFixer', null);
					window.removeEvent('scroll', scrollFixer);
				}
                this.removeClass('isPinned');
            }
            return this;
        },

		unpin() {
			return this.pin(false);
		},

		togglepin() {
			return this.pin(!this.retrieve('pin:_pinned'));
		}

	});
}))();


/*
---

script: Class.Binds.js

name: Class.Binds

description: Automagically binds specified methods in a class to the instance of the class.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Class
  - /MooTools.More

provides: [Class.Binds]

...
*/

Class.Mutators.Binds = binds => binds;

Class.Mutators.initialize = initialize => function(...args) {
    Array.from(this.Binds).each(function(name){
        var original = this[name];
        if (original) this[name] = original.bind(this);
    }, this);
    return initialize.apply(this, args);
};


/*
---

script: Class.Occlude.js

name: Class.Occlude

description: Prevents a class from being applied to a DOM element twice.

license: MIT-style license.

authors:
  - Aaron Newton

requires:
  - Core/Class
  - Core/Element
  - /MooTools.More

provides: [Class.Occlude]

...
*/

Class.Occlude = new Class({

	occlude(property, element) {
		element = document.id(element || this.element);
		var instance = element.retrieve(property || this.property);
		if (instance && this.occluded != null)
			return this.occluded = instance;

		this.occluded = false;
		element.store(property || this.property, this);
		return this.occluded;
	}

});


/*
---

script: Element.Measure.js

name: Element.Measure

description: Extends the Element native object to include methods useful in measuring dimensions.

credits: "Element.measure / .expose methods by Daniel Steigerwald License: MIT-style license. Copyright: Copyright (c) 2008 Daniel Steigerwald, daniel.steigerwald.cz"

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Element.Measure]

...
*/

((() => {

var getStylesList = (styles, planes) => {
	var list = [];
	Object.each(planes, directions => {
		Object.each(directions, edge => {
			styles.each(style => {
				list.push(style + '-' + edge + (style == 'border' ? '-width' : ''));
			});
		});
	});
	return list;
};

var calculateEdgeSize = (edge, styles) => {
	var total = 0;
	Object.each(styles, (value, style) => {
		if (style.test(edge)) total = total + value.toInt();
	});
	return total;
};


Element.implement({

	measure(fn) {
        var visibility = el => !!(!el || el.offsetHeight || el.offsetWidth);
        if (visibility(this)) return fn.apply(this);
        var parent = this.getParent();
        var restorers = [];
        var toMeasure = [];
        while (!visibility(parent) && parent != document.body){
			toMeasure.push(parent.expose());
			parent = parent.getParent();
		}
        var restore = this.expose();
        var result = fn.apply(this);
        restore();
        toMeasure.each(restore => {
			restore();
		});
        return result;
    },

	expose() {
		if (this.getStyle('display') != 'none') return () => {};
		var before = this.style.cssText;
		this.setStyles({
			display: 'block',
			position: 'absolute',
			visibility: 'hidden'
		});
		return () => {
			this.style.cssText = before;
		};
	},

	getDimensions(options) {
		options = Object.merge({computeSize: false}, options);
		var dim = {x: 0, y: 0};

		var getSize = (el, options) => (options.computeSize) ? el.getComputedSize(options) : el.getSize();

		var parent = this.getParent('body');

		if (parent && this.getStyle('display') == 'none'){
			dim = this.measure(function(){
				return getSize(this, options);
			});
		} else if (parent){
			try { //safari sometimes crashes here, so catch it
				dim = getSize(this, options);
			}catch(e){}
		}

		return Object.append(dim, (dim.x || dim.x === 0) ? {
				width: dim.x,
				height: dim.y
			} : {
				x: dim.width,
				y: dim.height
			}
		);
	},

	getComputedSize(options) {
        options = Object.merge({
			styles: ['padding','border'],
			planes: {
				height: ['top','bottom'],
				width: ['left','right']
			},
			mode: 'both'
		}, options);

        var styles = {};
        var size = {width: 0, height: 0};

        if (options.mode == 'vertical'){
			delete size.width;
			delete options.planes.width;
		} else if (options.mode == 'horizontal'){
			delete size.height;
			delete options.planes.height;
		}


        getStylesList(options.styles, options.planes).each(function(style){
			styles[style] = this.getStyle(style).toInt();
		}, this);

        Object.each(options.planes, function(edges, plane){

			var capitalized = plane.capitalize();
			styles[plane] = this.getStyle(plane).toInt();
			size['total' + capitalized] = styles[plane];

			edges.each(edge => {
				var edgesize = calculateEdgeSize(edge, styles);
				size['computed' + edge.capitalize()] = edgesize;
				size['total' + capitalized] += edgesize;
			});

		}, this);

        return Object.append(size, styles);
    }

});

}))();


/*
---

script: Element.Position.js

name: Element.Position

description: Extends the Element native object to include methods useful positioning elements relative to others.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Dimensions
  - /Element.Measure

provides: [Element.Position]

...
*/

((() => {

var original = Element.prototype.position;

Element.implement({

	position(options) {
        //call original position if the options are x/y values
        if (options && (options.x != null || options.y != null)){
			return original ? original.apply(this, arguments) : this;
		}

        Object.each(options || {}, (v, k) => {
			if (v == null) delete options[k];
		});

        options = Object.merge({
			// minimum: { x: 0, y: 0 },
			// maximum: { x: 0, y: 0},
			relativeTo: document.body,
			position: {
				x: 'center', //left, center, right
				y: 'center' //top, center, bottom
			},
			offset: {x: 0, y: 0}/*,
			edge: false,
			returnPos: false,
			relFixedPosition: false,
			ignoreMargins: false,
			ignoreScroll: false,
			allowNegative: false*/
		}, options);

        //compute the offset of the parent positioned element if this element is in one
        var parentOffset = {x: 0, y: 0};

        var parentPositioned = false;

        /* dollar around getOffsetParent should not be necessary, but as it does not return
		 * a mootools extended element in IE, an error occurs on the call to expose. See:
		 * http://mootools.lighthouseapp.com/projects/2706/tickets/333-element-getoffsetparent-inconsistency-between-ie-and-other-browsers */
        var offsetParent = this.measure(function(){
			return document.id(this.getOffsetParent());
		});
        if (offsetParent && offsetParent != this.getDocument().body){
			parentOffset = offsetParent.measure(function(){
				return this.getPosition();
			});
			parentPositioned = offsetParent != document.id(options.relativeTo);
			options.offset.x = options.offset.x - parentOffset.x;
			options.offset.y = options.offset.y - parentOffset.y;
		}

        //upperRight, bottomRight, centerRight, upperLeft, bottomLeft, centerLeft
        //topRight, topLeft, centerTop, centerBottom, center
        var fixValue = option => {
			if (typeOf(option) != 'string') return option;
			option = option.toLowerCase();
			var val = {};

			if (option.test('left')){
				val.x = 'left';
			} else if (option.test('right')){
				val.x = 'right';
			} else {
				val.x = 'center';
			}

			if (option.test('upper') || option.test('top')){
				val.y = 'top';
			} else if (option.test('bottom')){
				val.y = 'bottom';
			} else {
				val.y = 'center';
			}

			return val;
		};

        options.edge = fixValue(options.edge);
        options.position = fixValue(options.position);
        if (!options.edge){
			if (options.position.x == 'center' && options.position.y == 'center') options.edge = {x:'center', y:'center'};
			else options.edge = {x:'left', y:'top'};
		}

        this.setStyle('position', 'absolute');
        var rel = document.id(options.relativeTo) || document.body;
        var calc = rel == document.body ? window.getScroll() : rel.getPosition();
        var top = calc.y;
        var left = calc.x;

        var dim = this.getDimensions({
			computeSize: true,
			styles:['padding', 'border','margin']
		});

        var pos = {};
        var prefY = options.offset.y;
        var prefX = options.offset.x;
        var winSize = window.getSize();

        switch(options.position.x){
			case 'left':
				pos.x = left + prefX;
				break;
			case 'right':
				pos.x = left + prefX + rel.offsetWidth;
				break;
			default: //center
				pos.x = left + ((rel == document.body ? winSize.x : rel.offsetWidth)/2) + prefX;
				break;
		}

        switch(options.position.y){
			case 'top':
				pos.y = top + prefY;
				break;
			case 'bottom':
				pos.y = top + prefY + rel.offsetHeight;
				break;
			default: //center
				pos.y = top + ((rel == document.body ? winSize.y : rel.offsetHeight)/2) + prefY;
				break;
		}

        if (options.edge){
			var edgeOffset = {};

			switch(options.edge.x){
				case 'left':
					edgeOffset.x = 0;
					break;
				case 'right':
					edgeOffset.x = -dim.x-dim.computedRight-dim.computedLeft;
					break;
				default: //center
					edgeOffset.x = -(dim.totalWidth/2);
					break;
			}

			switch(options.edge.y){
				case 'top':
					edgeOffset.y = 0;
					break;
				case 'bottom':
					edgeOffset.y = -dim.y-dim.computedTop-dim.computedBottom;
					break;
				default: //center
					edgeOffset.y = -(dim.totalHeight/2);
					break;
			}

			pos.x += edgeOffset.x;
			pos.y += edgeOffset.y;
		}

        pos = {
			left: ((pos.x >= 0 || parentPositioned || options.allowNegative) ? pos.x : 0).toInt(),
			top: ((pos.y >= 0 || parentPositioned || options.allowNegative) ? pos.y : 0).toInt()
		};

        var xy = {left: 'x', top: 'y'};

        ['minimum', 'maximum'].each(minmax => {
			['left', 'top'].each(lr => {
				var val = options[minmax] ? options[minmax][xy[lr]] : null;
				if (val != null && ((minmax == 'minimum') ? pos[lr] < val : pos[lr] > val)) pos[lr] = val;
			});
		});

        if (rel.getStyle('position') == 'fixed' || options.relFixedPosition){
			var winScroll = window.getScroll();
			pos.top+= winScroll.y;
			pos.left+= winScroll.x;
		}
        if (options.ignoreScroll){
			var relScroll = rel.getScroll();
			pos.top -= relScroll.y;
			pos.left -= relScroll.x;
		}

        if (options.ignoreMargins){
			pos.left += (
				options.edge.x == 'right' ? dim['margin-right'] :
				options.edge.x == 'center' ? -dim['margin-left'] + ((dim['margin-right'] + dim['margin-left'])/2) :
					- dim['margin-left']
			);
			pos.top += (
				options.edge.y == 'bottom' ? dim['margin-bottom'] :
				options.edge.y == 'center' ? -dim['margin-top'] + ((dim['margin-bottom'] + dim['margin-top'])/2) :
					- dim['margin-top']
			);
		}

        pos.left = Math.ceil(pos.left);
        pos.top = Math.ceil(pos.top);
        if (options.returnPos) return pos;
		else this.setStyles(pos);
        return this;
    }

});

}))();


/*
---

script: IframeShim.js

name: IframeShim

description: Defines IframeShim, a class for obscuring select lists and flash objects in IE.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Event
  - Core/Element.Style
  - Core/Options
  - Core/Events
  - /Element.Position
  - /Class.Occlude

provides: [IframeShim]

...
*/

var IframeShim = new Class({

	Implements: [Options, Events, Class.Occlude],

	options: {
		className: 'iframeShim',
		src: 'javascript:false;document.write("");',
		display: false,
		zIndex: null,
		margin: 0,
		offset: {x: 0, y: 0},
		browsers: ((Browser.ie && Browser.version == 6) || (Browser.firefox && Browser.version < 3 && Browser.Platform.mac))
	},

	property: 'IframeShim',

	initialize(element, options) {
		this.element = document.id(element);
		if (this.occlude()) return this.occluded;
		this.setOptions(options);
		this.makeShim();
		return this;
	},

	makeShim() {
		if (this.options.browsers){
			var zIndex = this.element.getStyle('zIndex').toInt();

			if (!zIndex){
				zIndex = 1;
				var pos = this.element.getStyle('position');
				if (pos == 'static' || !pos) this.element.setStyle('position', 'relative');
				this.element.setStyle('zIndex', zIndex);
			}
			zIndex = ((this.options.zIndex != null || this.options.zIndex === 0) && zIndex > this.options.zIndex) ? this.options.zIndex : zIndex - 1;
			if (zIndex < 0) zIndex = 1;
			this.shim = new Element('iframe', {
				src: this.options.src,
				scrolling: 'no',
				frameborder: 0,
				styles: {
					zIndex,
					position: 'absolute',
					border: 'none',
					filter: 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
				},
				'class': this.options.className
			}).store('IframeShim', this);
			var inject = () => {
				this.shim.inject(this.element, 'after');
				this[this.options.display ? 'show' : 'hide']();
				this.fireEvent('inject');
			};
			if (!IframeShim.ready) window.addEvent('load', inject);
			else inject();
		} else {
			this.position = this.hide = this.show = this.dispose = Function.from(this);
		}
	},

	position() {
		if (!IframeShim.ready || !this.shim) return this;
		var size = this.element.measure(function(){
			return this.getSize();
		});
		if (this.options.margin != undefined){
			size.x = size.x - (this.options.margin * 2);
			size.y = size.y - (this.options.margin * 2);
			this.options.offset.x += this.options.margin;
			this.options.offset.y += this.options.margin;
		}
		this.shim.set({width: size.x, height: size.y}).position({
			relativeTo: this.element,
			offset: this.options.offset
		});
		return this;
	},

	hide() {
		if (this.shim) this.shim.setStyle('display', 'none');
		return this;
	},

	show() {
		if (this.shim) this.shim.setStyle('display', 'block');
		return this.position();
	},

	dispose() {
		if (this.shim) this.shim.dispose();
		return this;
	},

	destroy() {
		if (this.shim) this.shim.destroy();
		return this;
	}

});

window.addEvent('load', () => {
	IframeShim.ready = true;
});


/*
---

script: Mask.js

name: Mask

description: Creates a mask element to cover another.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - Core/Element.Event
  - /Class.Binds
  - /Element.Position
  - /IframeShim

provides: [Mask]

...
*/

var Mask = new Class({

	Implements: [Options, Events],

	Binds: ['position'],

	options: {/*
		onShow: function(){},
		onHide: function(){},
		onDestroy: function(){},
		onClick: function(){},
		inject: {
			where: 'after',
			target: null,
		},
		hideOnClick: false,
		id: null,
		destroyOnHide: false,*/
		style: {},
		'class': 'mask',
		maskMargins: false,
		useIframeShim: true,
		iframeShimOptions: {}
	},

	initialize(target, options) {
		this.target = document.id(target) || document.id(document.body);
		this.target.store('mask', this);
		this.setOptions(options);
		this.render();
		this.inject();
	},

	render() {
		this.element = new Element('div', {
			'class': this.options['class'],
			id: this.options.id || 'mask-' + String.uniqueID(),
			styles: Object.merge(this.options.style, {
				display: 'none'
			}),
			events: {
				click: () => {
					this.fireEvent('click');
					if (this.options.hideOnClick) this.hide();
				}
			}
		});

		this.hidden = true;
	},

	toElement() {
		return this.element;
	},

	inject(target, where) {
		where = where || (this.options.inject ? this.options.inject.where : '') || this.target == document.body ? 'inside' : 'after';
		target = target || (this.options.inject ? this.options.inject.target : '') || this.target;

		this.element.inject(target, where);

		if (this.options.useIframeShim){
			this.shim = new IframeShim(this.element, this.options.iframeShimOptions);

			this.addEvents({
				show: this.shim.show.bind(this.shim),
				hide: this.shim.hide.bind(this.shim),
				destroy: this.shim.destroy.bind(this.shim)
			});
		}
	},

	position() {
		this.resize(this.options.width, this.options.height);

		this.element.position({
			relativeTo: this.target,
			position: 'topLeft',
			ignoreMargins: !this.options.maskMargins,
			ignoreScroll: this.target == document.body
		});

		return this;
	},

	resize(x, y) {
		var opt = {
			styles: ['padding', 'border']
		};
		if (this.options.maskMargins) opt.styles.push('margin');

		var dim = this.target.getComputedSize(opt);
		if (this.target == document.body){
			var win = window.getScrollSize();
			if (dim.totalHeight < win.y) dim.totalHeight = win.y;
			if (dim.totalWidth < win.x) dim.totalWidth = win.x;
		}
		this.element.setStyles({
			width: Array.pick([x, dim.totalWidth, dim.x]),
			height: Array.pick([y, dim.totalHeight, dim.y])
		});

		return this;
	},

	show(...args) {
		if (!this.hidden) return this;

		window.addEvent('resize', this.position);
		this.position();
		this.showMask(...args);

		return this;
	},

	showMask() {
		this.element.setStyle('display', 'block');
		this.hidden = false;
		this.fireEvent('show');
	},

	hide(...args) {
		if (this.hidden) return this;

		window.removeEvent('resize', this.position);
		this.hideMask(...args);
		if (this.options.destroyOnHide) return this.destroy();

		return this;
	},

	hideMask() {
		this.element.setStyle('display', 'none');
		this.hidden = true;
		this.fireEvent('hide');
	},

	toggle() {
		this[this.hidden ? 'show' : 'hide']();
	},

	destroy() {
		this.hide();
		this.element.destroy();
		this.fireEvent('destroy');
		this.target.eliminate('mask');
	}

});

Element.Properties.mask = {

	set(options) {
		var mask = this.retrieve('mask');
		if (mask) mask.destroy();
		return this.eliminate('mask').store('mask:options', options);
	},

	get() {
		var mask = this.retrieve('mask');
		if (!mask){
			mask = new Mask(this, this.retrieve('mask:options'));
			this.store('mask', mask);
		}
		return mask;
	}

};

Element.implement({

	mask(options) {
		if (options) this.set('mask', options);
		this.get('mask').show();
		return this;
	},

	unmask() {
		this.get('mask').hide();
		return this;
	}

});


/*
---

script: Spinner.js

name: Spinner

description: Adds a semi-transparent overlay over a dom element with a spinnin ajax icon.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Fx.Tween
  - Core/Request
  - /Class.refactor
  - /Mask

provides: [Spinner]

...
*/

var Spinner = new Class({

	Extends: Mask,

	Implements: Chain,

	options: {/*
		message: false,*/
		'class': 'spinner',
		containerPosition: {},
		content: {
			'class': 'spinner-content'
		},
		messageContainer: {
			'class': 'spinner-msg'
		},
		img: {
			'class': 'spinner-img'
		},
		fxOptions: {
			link: 'chain'
		}
	},

	initialize(target, options) {
		this.target = document.id(target) || document.id(document.body);
		this.target.store('spinner', this);
		this.setOptions(options);
		this.render();
		this.inject();

		// Add this to events for when noFx is true; parent methods handle hide/show.
		var deactivate = () => { this.active = false; };
		this.addEvents({
			hide: deactivate,
			show: deactivate
		});
	},

	render() {
		this.parent();

		this.element.set('id', this.options.id || 'spinner-' + String.uniqueID());

		this.content = document.id(this.options.content) || new Element('div', this.options.content);
		this.content.inject(this.element);

		if (this.options.message){
			this.msg = document.id(this.options.message) || new Element('p', this.options.messageContainer).appendText(this.options.message);
			this.msg.inject(this.content);
		}

		if (this.options.img){
			this.img = document.id(this.options.img) || new Element('div', this.options.img);
			this.img.inject(this.content);
		}

		this.element.set('tween', this.options.fxOptions);
	},

	show(noFx) {
		if (this.active) return this.chain(this.show.bind(this));
		if (!this.hidden){
			this.callChain.delay(20, this);
			return this;
		}

		this.active = true;

		return this.parent(noFx);
	},

	showMask(noFx) {
		var pos = () => {
			this.content.position(Object.merge({
				relativeTo: this.element
			}, this.options.containerPosition));
		};

		if (noFx){
			this.parent();
			pos();
		} else {
			if (!this.options.style.opacity) this.options.style.opacity = this.element.getStyle('opacity').toFloat();
			this.element.setStyles({
				display: 'block',
				opacity: 0
			}).tween('opacity', this.options.style.opacity);
			pos();
			this.hidden = false;
			this.fireEvent('show');
			this.callChain();
		}
	},

	hide(noFx) {
		if (this.active) return this.chain(this.hide.bind(this));
		if (this.hidden){
			this.callChain.delay(20, this);
			return this;
		}
		this.active = true;
		return this.parent(noFx);
	},

	hideMask(noFx) {
		if (noFx) return this.parent();
		this.element.tween('opacity', 0).get('tween').chain(() => {
			this.element.setStyle('display', 'none');
			this.hidden = true;
			this.fireEvent('hide');
			this.callChain();
		});
	},

	destroy() {
		this.content.destroy();
		this.parent();
		this.target.eliminate('spinner');
	}

});

Request = Class.refactor(Request, {

	options: {
		useSpinner: false,
		spinnerOptions: {},
		spinnerTarget: false
	},

	initialize(options) {
		this._send = this.send;
		this.send = function(options){
			var spinner = this.getSpinner();
			if (spinner) spinner.chain(this._send.pass(options, this)).show();
			else this._send(options);
			return this;
		};
		this.previous(options);
	},

	getSpinner() {
		if (!this.spinner){
			var update = document.id(this.options.spinnerTarget) || document.id(this.options.update);
			if (this.options.useSpinner && update){
				update.set('spinner', this.options.spinnerOptions);
				var spinner = this.spinner = update.get('spinner');
				['complete', 'exception', 'cancel'].each(function(event){
					this.addEvent(event, spinner.hide.bind(spinner));
				}, this);
			}
		}
		return this.spinner;
	}

});

Element.Properties.spinner = {

	set(options) {
		var spinner = this.retrieve('spinner');
		if (spinner) spinner.destroy();
		return this.eliminate('spinner').store('spinner:options', options);
	},

	get() {
		var spinner = this.retrieve('spinner');
		if (!spinner){
			spinner = new Spinner(this, this.retrieve('spinner:options'));
			this.store('spinner', spinner);
		}
		return spinner;
	}

};

Element.implement({

	spin(options) {
		if (options) this.set('spinner', options);
		this.get('spinner').show();
		return this;
	},

	unspin() {
		this.get('spinner').hide();
		return this;
	}

});


/*
---

name: Events.Pseudos

description: Adds the functionallity to add pseudo events

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Core/Class.Extras, Core/Slick.Parser, More/MooTools.More]

provides: [Events.Pseudos]

...
*/

Events.Pseudos = (pseudos, addEvent, removeEvent) => {

	var storeKey = 'monitorEvents:';

	var storageOf = object => ({
        store: object.store ? (key, value) => {
            object.store(storeKey + key, value);
        } : (key, value) => {
            (object.$monitorEvents || (object.$monitorEvents = {}))[key] = value;
        },

        retrieve: object.retrieve ? (key, dflt) => object.retrieve(storeKey + key, dflt) : (key, dflt) => {
            if (!object.$monitorEvents) return dflt;
            return object.$monitorEvents[key] || dflt;
        }
    });


	var splitType = type => {
        if (type.indexOf(':') == -1) return null;

        var parsed = Slick.parse(type).expressions[0][0];
        var parsedPseudos = parsed.pseudos;

        return (pseudos && pseudos[parsedPseudos[0].key]) ? {
			event: parsed.tag,
			value: parsedPseudos[0].value,
			pseudo: parsedPseudos[0].key,
			original: type
		} : null;
    };


	return {

		addEvent(type, fn, internal) {
            var split = splitType(type);
            if (!split) return addEvent.call(this, type, fn, internal);

            var storage = storageOf(this);
            var events = storage.retrieve(type, []);
            var pseudoArgs = Array.from(pseudos[split.pseudo]);
            var proxy = pseudoArgs[1];

            var self = this;
            var monitor = function(...args) {
				pseudoArgs[0].call(self, split, fn, args, proxy);
			};

            events.include({event: fn, monitor});
            storage.store(type, events);

            var eventType = split.event;
            if (proxy && proxy[eventType]) eventType = proxy[eventType].base;

            addEvent.call(this, type, fn, internal);
            return addEvent.call(this, eventType, monitor, internal);
        },

		removeEvent(type, fn) {
            var split = splitType(type);
            if (!split) return removeEvent.call(this, type, fn);

            var storage = storageOf(this);
            var events = storage.retrieve(type);
            var pseudoArgs = Array.from(pseudos[split.pseudo]);
            var proxy = pseudoArgs[1];

            if (!events) return this;

            var eventType = split.event;
            if (proxy && proxy[eventType]) eventType = proxy[eventType].base;

            removeEvent.call(this, type, fn);
            events.each(function(monitor, i){
				if (!fn || monitor.event == fn) removeEvent.call(this, eventType, monitor.monitor);
				delete events[i];
			}, this);

            storage.store(type, events);
            return this;
        }

	};

};

((() => {

var pseudos = {

	once(split, fn, args) {
		fn.apply(this, args);
		this.removeEvent(split.original, fn);
	}

};

Events.definePseudo = (key, fn) => {
	pseudos[key] = fn;
};

var proto = Events.prototype;
Events.implement(Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent));

}))();


/*
---

name: Element.Event.Pseudos

description: Adds the functionality to add pseudo events for Elements

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Core/Element.Event, Events.Pseudos]

provides: [Element.Event.Pseudos]

...
*/

((() => {

var pseudos = {

	once(split, fn, args) {
		fn.apply(this, args);
		this.removeEvent(split.original, fn);
	}

};

Event.definePseudo = (key, fn, proxy) => {
	pseudos[key] = [fn, proxy];
};

var proto = Element.prototype;
[Element, Window, Document].invoke('implement', Events.Pseudos(pseudos, proto.addEvent, proto.removeEvent));

}))();


/*
---

script: Element.Delegation.js

name: Element.Delegation

description: Extends the Element native object to include the delegate method for more efficient event management.

credits:
  - "Event checking based on the work of Daniel Steigerwald. License: MIT-style license. Copyright: Copyright (c) 2008 Daniel Steigerwald, daniel.steigerwald.cz"

license: MIT-style license

authors:
  - Aaron Newton
  - Daniel Steigerwald

requires: [/MooTools.More, Element.Event.Pseudos]

provides: [Element.Delegation]

...
*/


Event.definePseudo('relay', function(split, fn, args, proxy){
	var event = args[0];
	var check = proxy ? proxy.condition : null;

	for (var target = event.target; target && target != this; target = target.parentNode){
		var finalTarget = document.id(target);
		if (Slick.match(target, split.value) && (!check || check.call(finalTarget, event))){
			if (finalTarget) fn.call(finalTarget, event, finalTarget);
			return;
		}
	}

}, {
	mouseenter: {
		base: 'mouseover',
		condition: Element.Events.mouseenter.condition
	},
	mouseleave: {
		base: 'mouseout',
		condition: Element.Events.mouseleave.condition
	}
});


/*
---

script: Form.Request.js

name: Form.Request

description: Handles the basic functionality of submitting a form and updating a dom element with the result.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Request.HTML
  - /Class.Binds
  - /Class.Occlude
  - /Spinner
  - /String.QueryString
  - /Element.Delegation

provides: [Form.Request]

...
*/

if (!window.Form) window.Form = {};

((() => {

	Form.Request = new Class({

		Binds: ['onSubmit', 'onFormValidate'],

		Implements: [Options, Events, Class.Occlude],

		options: {
			//onFailure: function(){},
			//onSuccess: #function(){}, //aliased to onComplete,
			//onSend: function(){}
			requestOptions: {
				evalScripts: true,
				useSpinner: true,
				emulation: false,
				link: 'ignore'
			},
			sendButtonClicked: true,
			extraData: {},
			resetForm: true
		},

		property: 'form.request',

		initialize(form, update, options) {
			this.element = document.id(form);
			if (this.occlude()) return this.occluded;
			this.update = document.id(update);
			this.setOptions(options);
			this.makeRequest();
			if (this.options.resetForm){
				this.request.addEvent('success', () => {
					Function.attempt(() => { this.element.reset(); });
					if (window.OverText) OverText.update();
				});
			}
			this.attach();
		},

		toElement() {
			return this.element;
		},

		makeRequest() {
			this.request = new Request.HTML(Object.merge({
					update: this.update,
					emulation: false,
					spinnerTarget: this.element,
					method: this.element.get('method') || 'post'
			}, this.options.requestOptions)).addEvents({
				success: (tree, elements, html, javascript) => {
					['complete', 'success'].each(function(evt){
						this.fireEvent(evt, [this.update, tree, elements, html, javascript]);
					}, this);
				},
				failure: function(...args) {
					this.fireEvent('complete', args).fireEvent('failure', args);
				}.bind(this),
				exception: function(...args) {
					this.fireEvent('failure', args);
				}.bind(this)
			});
		},

		attach(attach) {
			attach = attach != null ? attach : true;
			method = attach ? 'addEvent' : 'removeEvent';

			this.element[method]('click:relay(button, input[type=submit])', this.saveClickedButton.bind(this));

			var fv = this.element.retrieve('validator');
			if (fv) fv[method]('onFormValidate', this.onFormValidate);
			else this.element[method]('submit', this.onSubmit);
		},

		detach() {
			this.attach(false);
			return this;
		},

		//public method
		enable() {
			this.attach();
			return this;
		},

		//public method
		disable() {
			this.detach();
			return this;
		},

		onFormValidate(valid, form, e) {
			//if there's no event, then this wasn't a submit event
			if (!e) return;
			var fv = this.element.retrieve('validator');
			if (valid || (fv && !fv.options.stopOnFailure)){
				if (e && e.stop) e.stop();
				this.send();
			}
		},

		onSubmit(e) {
			var fv = this.element.retrieve('validator');
			if (fv){
				//form validator was created after Form.Request
				this.element.removeEvent('submit', this.onSubmit);
				fv.addEvent('onFormValidate', this.onFormValidate);
				this.element.validate();
				return;
			}
			if (e) e.stop();
			this.send();
		},

		saveClickedButton(event, target) {
			if (!this.options.sendButtonClicked) return;
			if (!target.get('name')) return;
			this.options.extraData[target.get('name')] = target.get('value') || true;
			this.clickedCleaner = () => {
				delete this.options.extraData[target.get('name')];
				this.clickedCleaner = () => {};
			};
		},

		clickedCleaner() {},

		send() {
			var str = this.element.toQueryString().trim();
			var data = Object.toQueryString(this.options.extraData);
			if (str) str += "&" + data;
			else str = data;
			this.fireEvent('send', [this.element, str.parseQueryString()]);
			this.request.send({data: str, url: this.element.get("action")});
			this.clickedCleaner();
			return this;
		}

	});

	Element.Properties.formRequest = {

		set(...args) {
			var opt = Array.link(args, {options: Type.isObject, update: Type.isElement, updateId: Type.isString});
			var update = opt.update || opt.updateId;
			var updater = this.retrieve('form.request');
			if (update){
				if (updater) updater.update = document.id(update);
				this.store('form.request:update', update);
			}
			if (opt.options){
				if (updater) updater.setOptions(opt.options);
				this.store('form.request:options', opt.options);
			}
			return this;
		},

		get(...args) {
			var opt = Array.link(args, {options: Type.isObject, update: Type.isElement, updateId: Type.isString});
			var update = opt.update || opt.updateId;
			if (opt.options || update || !this.retrieve('form.request')){
				if (opt.options || !this.retrieve('form.request:options')) this.set('form.request', opt.options);
				if (update) this.set('form.request', update);
				this.store('form.request', new Form.Request(this, this.retrieve('form.request:update'), this.retrieve('form.request:options')));
			}
			return this.retrieve('form.request');
		}

	};

	Element.implement({

		formUpdate(update, options) {
			this.get('formRequest', update, options).send();
			return this;
		}

	});

}))();


/*
---

script: Element.Shortcuts.js

name: Element.Shortcuts

description: Extends the Element native object to include some shortcut methods.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Style
  - /MooTools.More

provides: [Element.Shortcuts]

...
*/

Element.implement({

	isDisplayed() {
		return this.getStyle('display') != 'none';
	},

	isVisible() {
        var w = this.offsetWidth;
        var h = this.offsetHeight;
        return (w == 0 && h == 0) ? false : (w > 0 && h > 0) ? true : this.style.display != 'none';
    },

	toggle() {
		return this[this.isDisplayed() ? 'hide' : 'show']();
	},

	hide() {
		var d;
		try {
			//IE fails here if the element is not in the dom
			d = this.getStyle('display');
		} catch(e){}
		if (d == 'none') return this;
		return this.store('element:_originalDisplay', d || '').setStyle('display', 'none');
	},

	show(display) {
		if (!display && this.isDisplayed()) return this;
		display = display || this.retrieve('element:_originalDisplay') || 'block';
		return this.setStyle('display', (display == 'none') ? 'block' : display);
	},

	swapClass(remove, add) {
		return this.removeClass(remove).addClass(add);
	}

});

Document.implement({

	clearSelection() {
		if (document.selection && document.selection.empty){
			document.selection.empty();
		} else if (window.getSelection){
			var selection = window.getSelection();
			if (selection && selection.removeAllRanges) selection.removeAllRanges();
		}
	}

});


/*
---

script: Fx.Reveal.js

name: Fx.Reveal

description: Defines Fx.Reveal, a class that shows and hides elements with a transition.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Fx.Morph
  - /Element.Shortcuts
  - /Element.Measure

provides: [Fx.Reveal]

...
*/

Fx.Reveal = new Class({

	Extends: Fx.Morph,

	options: {/*
		onShow: function(thisElement){},
		onHide: function(thisElement){},
		onComplete: function(thisElement){},
		heightOverride: null,
		widthOverride: null,*/
		link: 'cancel',
		styles: ['padding', 'border', 'margin'],
		transitionOpacity: !Browser.ie6,
		mode: 'vertical',
		display() {
			return this.element.get('tag') != 'tr' ? 'block' : 'table-row';
		},
		opacity: 1,
		hideInputs: Browser.ie ? 'select, input, textarea, object, embed' : null
	},

	dissolve() {
		if (!this.hiding && !this.showing){
			if (this.element.getStyle('display') != 'none'){
				this.hiding = true;
				this.showing = false;
				this.hidden = true;
				this.cssText = this.element.style.cssText;

				var startStyles = this.element.getComputedSize({
					styles: this.options.styles,
					mode: this.options.mode
				});
				if (this.options.transitionOpacity) startStyles.opacity = this.options.opacity;

				var zero = {};
				Object.each(startStyles, (style, name) => {
					zero[name] = [style, 0];
				});

				this.element.setStyles({
					display: Function.from(this.options.display).call(this),
					overflow: 'hidden'
				});

				var hideThese = this.options.hideInputs ? this.element.getElements(this.options.hideInputs) : null;
				if (hideThese) hideThese.setStyle('visibility', 'hidden');

				this.$chain.unshift(() => {
					if (this.hidden){
						this.hiding = false;
						this.element.style.cssText = this.cssText;
						this.element.setStyle('display', 'none');
						if (hideThese) hideThese.setStyle('visibility', 'visible');
					}
					this.fireEvent('hide', this.element);
					this.callChain();
				});

				this.start(zero);
			} else {
				this.callChain.delay(10, this);
				this.fireEvent('complete', this.element);
				this.fireEvent('hide', this.element);
			}
		} else if (this.options.link == 'chain'){
			this.chain(this.dissolve.bind(this));
		} else if (this.options.link == 'cancel' && !this.hiding){
			this.cancel();
			this.dissolve();
		}
		return this;
	},

	reveal() {
		if (!this.showing && !this.hiding){
			if (this.element.getStyle('display') == 'none'){
				this.hiding = false;
				this.showing = true;
				this.hidden = false;
				this.cssText = this.element.style.cssText;

				var startStyles;
				this.element.measure(() => {
					startStyles = this.element.getComputedSize({
						styles: this.options.styles,
						mode: this.options.mode
					});
				});
				if (this.options.heightOverride != null) startStyles.height = this.options.heightOverride.toInt();
				if (this.options.widthOverride != null) startStyles.width = this.options.widthOverride.toInt();
				if (this.options.transitionOpacity){
					this.element.setStyle('opacity', 0);
					startStyles.opacity = this.options.opacity;
				}

				var zero = {
					height: 0,
					display: Function.from(this.options.display).call(this)
				};
				Object.each(startStyles, (style, name) => {
					zero[name] = 0;
				});
				zero.overflow = 'hidden';

				this.element.setStyles(zero);

				var hideThese = this.options.hideInputs ? this.element.getElements(this.options.hideInputs) : null;
				if (hideThese) hideThese.setStyle('visibility', 'hidden');

				this.$chain.unshift(() => {
					this.element.style.cssText = this.cssText;
					this.element.setStyle('display', Function.from(this.options.display).call(this));
					if (!this.hidden) this.showing = false;
					if (hideThese) hideThese.setStyle('visibility', 'visible');
					this.callChain();
					this.fireEvent('show', this.element);
				});

				this.start(startStyles);
			} else {
				this.callChain();
				this.fireEvent('complete', this.element);
				this.fireEvent('show', this.element);
			}
		} else if (this.options.link == 'chain'){
			this.chain(this.reveal.bind(this));
		} else if (this.options.link == 'cancel' && !this.showing){
			this.cancel();
			this.reveal();
		}
		return this;
	},

	toggle() {
		if (this.element.getStyle('display') == 'none'){
			this.reveal();
		} else {
			this.dissolve();
		}
		return this;
	},

	cancel(...args) {
		this.parent(...args);
		this.element.style.cssText = this.cssText;
		this.hiding = false;
		this.showing = false;
		return this;
	}

});

Element.Properties.reveal = {

	set(options) {
		this.get('reveal').cancel().setOptions(options);
		return this;
	},

	get() {
		var reveal = this.retrieve('reveal');
		if (!reveal){
			reveal = new Fx.Reveal(this);
			this.store('reveal', reveal);
		}
		return reveal;
	}

};

Element.Properties.dissolve = Element.Properties.reveal;

Element.implement({

	reveal(options) {
		this.get('reveal').setOptions(options).reveal();
		return this;
	},

	dissolve(options) {
		this.get('reveal').setOptions(options).dissolve();
		return this;
	},

	nix(options) {
		var params = Array.link(arguments, {destroy: Type.isBoolean, options: Type.isObject});
		this.get('reveal').setOptions(options).dissolve().chain(() => {
			this[params.destroy ? 'destroy' : 'dispose']();
		});
		return this;
	},

	wink(...args) {
		var params = Array.link(args, {duration: Type.isNumber, options: Type.isObject});
		var reveal = this.get('reveal').setOptions(params.options);
		reveal.reveal().chain(() => {
			((() => {
				reveal.dissolve();
			})).delay(params.duration || 2000);
		});
	}

});


/*
---

script: Elements.From.js

name: Elements.From

description: Returns a collection of elements from a string of html.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/String
  - Core/Element
  - /MooTools.More

provides: [Elements.from, Elements.From]

...
*/

Elements.from = (text, excludeScripts) => {
    if (excludeScripts || excludeScripts == null) text = text.stripScripts();

    var container;
    var match = text.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);

    if (match){
		container = new Element('table');
		var tag = match[1].toLowerCase();
		if (['td', 'th', 'tr'].contains(tag)){
			container = new Element('tbody').inject(container);
			if (tag != 'tr') container = new Element('tr').inject(container);
		}
	}

    return (container || new Element('div')).set('html', text).getChildren();
};


/*
---

script: Form.Request.Append.js

name: Form.Request.Append

description: Handles the basic functionality of submitting a form and updating a dom element with the result. The result is appended to the DOM element instead of replacing its contents.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Form.Request
  - /Fx.Reveal
  - /Elements.from

provides: [Form.Request.Append]

...
*/

Form.Request.Append = new Class({

	Extends: Form.Request,

	options: {
		//onBeforeEffect: function(){},
		useReveal: true,
		revealOptions: {},
		inject: 'bottom'
	},

	makeRequest() {
		this.request = new Request.HTML(Object.merge({
				url: this.element.get('action'),
				method: this.element.get('method') || 'post',
				spinnerTarget: this.element
			}, this.options.requestOptions, {
				evalScripts: false
			})
		).addEvents({
			success: (tree, elements, html, javascript) => {
				var container;
				var kids = Elements.from(html);
				if (kids.length == 1){
					container = kids[0];
				} else {
					 container = new Element('div', {
						styles: {
							display: 'none'
						}
					}).adopt(kids);
				}
				container.inject(this.update, this.options.inject);
				if (this.options.requestOptions.evalScripts) Browser.exec(javascript);
				this.fireEvent('beforeEffect', container);
				var finish = () => {
					this.fireEvent('success', [container, this.update, tree, elements, html, javascript]);
				};
				if (this.options.useReveal){
					container.set('reveal', this.options.revealOptions).get('reveal').chain(finish);
					container.reveal();
				} else {
					finish();
				}
			},
			failure: xhr => {
				this.fireEvent('failure', xhr);
			}
		});
	}

});


/*
---

script: String.Extras.js

name: String.Extras

description: Extends the String native object to include methods useful in managing various kinds of strings (query strings, urls, html, etc).

license: MIT-style license

authors:
  - Aaron Newton
  - Guillermo Rauch
  - Christopher Pitt

requires:
  - Core/String
  - Core/Array

provides: [String.Extras]

...
*/

((() => {
    var special = {
        'a': /[àáâãäåăą]/g,
        'A': /[ÀÁÂÃÄÅĂĄ]/g,
        'c': /[ćčç]/g,
        'C': /[ĆČÇ]/g,
        'd': /[ďđ]/g,
        'D': /[ĎÐ]/g,
        'e': /[èéêëěę]/g,
        'E': /[ÈÉÊËĚĘ]/g,
        'g': /[ğ]/g,
        'G': /[Ğ]/g,
        'i': /[ìíîï]/g,
        'I': /[ÌÍÎÏ]/g,
        'l': /[ĺľł]/g,
        'L': /[ĹĽŁ]/g,
        'n': /[ñňń]/g,
        'N': /[ÑŇŃ]/g,
        'o': /[òóôõöøő]/g,
        'O': /[ÒÓÔÕÖØ]/g,
        'r': /[řŕ]/g,
        'R': /[ŘŔ]/g,
        's': /[ššş]/g,
        'S': /[ŠŞŚ]/g,
        't': /[ťţ]/g,
        'T': /[ŤŢ]/g,
        'ue': /[ü]/g,
        'UE': /[Ü]/g,
        'u': /[ùúûůµ]/g,
        'U': /[ÙÚÛŮ]/g,
        'y': /[ÿý]/g,
        'Y': /[ŸÝ]/g,
        'z': /[žźż]/g,
        'Z': /[ŽŹŻ]/g,
        'th': /[þ]/g,
        'TH': /[Þ]/g,
        'dh': /[ð]/g,
        'DH': /[Ð]/g,
        'ss': /[ß]/g,
        'oe': /[œ]/g,
        'OE': /[Œ]/g,
        'ae': /[æ]/g,
        'AE': /[Æ]/g
    };

    var tidy = {
        ' ': /[\xa0\u2002\u2003\u2009]/g,
        '*': /[\xb7]/g,
        '\'': /[\u2018\u2019]/g,
        '"': /[\u201c\u201d]/g,
        '...': /[\u2026]/g,
        '-': /[\u2013]/g,
    //	'--': /[\u2014]/g,
        '&raquo;': /[\uFFFD]/g
    };

    var walk = (string, replacements) => {
        var result = string;
        for (key in replacements) result = result.replace(replacements[key], key);
        return result;
    };

    var getRegexForTag = (tag, contents) => {
        tag = tag || '';
        var regstr = contents ? "<" + tag + "(?!\\w)[^>]*>([\\s\\S]*?)<\/" + tag + "(?!\\w)>" : "<\/?" + tag + "([^>]+)?>";
        reg = new RegExp(regstr, "gi");
        return reg;
    };

    String.implement({

        standardize() {
            return walk(this, special);
        },

        repeat(times) {
            return new Array(times + 1).join(this);
        },

        pad(length, str, direction) {
            if (this.length >= length) return this;

            var pad = (str == null ? ' ' : '' + str)
                .repeat(length - this.length)
                .substr(0, length - this.length);

            if (!direction || direction == 'right') return this + pad;
            if (direction == 'left') return pad + this;

            return pad.substr(0, (pad.length / 2).floor()) + this + pad.substr(0, (pad.length / 2).ceil());
        },

        getTags(tag, contents) {
            return this.match(getRegexForTag(tag, contents)) || [];
        },

        stripTags(tag, contents) {
            return this.replace(getRegexForTag(tag, contents), '');
        },

        tidy() {
            return walk(this, tidy);
        }

    });
}))();


/*
---

script: Element.Forms.js

name: Element.Forms

description: Extends the Element native object to include methods useful in managing inputs.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element
  - /String.Extras
  - /MooTools.More

provides: [Element.Forms]

...
*/

Element.implement({

	tidy() {
		this.set('value', this.get('value').tidy());
	},

	getTextInRange(start, end) {
		return this.get('value').substring(start, end);
	},

	getSelectedText() {
		if (this.setSelectionRange) return this.getTextInRange(this.getSelectionStart(), this.getSelectionEnd());
		return document.selection.createRange().text;
	},

	getSelectedRange() {
		if (this.selectionStart != null){
			return {
				start: this.selectionStart,
				end: this.selectionEnd
			};
		}

		var pos = {
			start: 0,
			end: 0
		};
		var range = this.getDocument().selection.createRange();
		if (!range || range.parentElement() != this) return pos;
		var duplicate = range.duplicate();

		if (this.type == 'text'){
			pos.start = 0 - duplicate.moveStart('character', -100000);
			pos.end = pos.start + range.text.length;
		} else {
			var value = this.get('value');
			var offset = value.length;
			duplicate.moveToElementText(this);
			duplicate.setEndPoint('StartToEnd', range);
			if (duplicate.text.length) offset -= value.match(/[\n\r]*$/)[0].length;
			pos.end = offset - duplicate.text.length;
			duplicate.setEndPoint('StartToStart', range);
			pos.start = offset - duplicate.text.length;
		}
		return pos;
	},

	getSelectionStart() {
		return this.getSelectedRange().start;
	},

	getSelectionEnd() {
		return this.getSelectedRange().end;
	},

	setCaretPosition(pos) {
		if (pos == 'end') pos = this.get('value').length;
		this.selectRange(pos, pos);
		return this;
	},

	getCaretPosition() {
		return this.getSelectedRange().start;
	},

	selectRange(start, end) {
		if (this.setSelectionRange){
			this.focus();
			this.setSelectionRange(start, end);
		} else {
			var value = this.get('value');
			var diff = value.substr(start, end - start).replace(/\r/g, '').length;
			start = value.substr(0, start).replace(/\r/g, '').length;
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', start + diff);
			range.moveStart('character', start);
			range.select();
		}
		return this;
	},

	insertAtCursor(value, select) {
		var pos = this.getSelectedRange();
		var text = this.get('value');
		this.set('value', text.substring(0, pos.start) + value + text.substring(pos.end, text.length));
		if (select !== false) this.selectRange(pos.start, pos.start + value.length);
		else this.setCaretPosition(pos.start + value.length);
		return this;
	},

	insertAroundCursor(options, select) {
		options = Object.append({
			before: '',
			defaultMiddle: '',
			after: ''
		}, options);

		var value = this.getSelectedText() || options.defaultMiddle;
		var pos = this.getSelectedRange();
		var text = this.get('value');

		if (pos.start == pos.end){
			this.set('value', text.substring(0, pos.start) + options.before + value + options.after + text.substring(pos.end, text.length));
			this.selectRange(pos.start + options.before.length, pos.end + options.before.length + value.length);
		} else {
			var current = text.substring(pos.start, pos.end);
			this.set('value', text.substring(0, pos.start) + options.before + current + options.after + text.substring(pos.end, text.length));
			var selStart = pos.start + options.before.length;
			if (select !== false) this.selectRange(selStart, selStart + current.length);
			else this.setCaretPosition(selStart + text.length);
		}
		return this;
	}

});


/*
---

name: Locale.en-US.Form.Validator

description: Form Validator messages for English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Locale

provides: [Locale.en-US.Form.Validator]

...
*/

Locale.define('en-US', 'FormValidator', {

	required: 'This field is required.',
	minLength: 'Please enter at least {minLength} characters (you entered {length} characters).',
	maxLength: 'Please enter no more than {maxLength} characters (you entered {length} characters).',
	integer: 'Please enter an integer in this field. Numbers with decimals (e.g. 1.25) are not permitted.',
	numeric: 'Please enter only numeric values in this field (i.e. "1" or "1.1" or "-1" or "-1.1").',
	digits: 'Please use numbers and punctuation only in this field (for example, a phone number with dashes or dots is permitted).',
	alpha: 'Please use only letters (a-z) within this field. No spaces or other characters are allowed.',
	alphanum: 'Please use only letters (a-z) or numbers (0-9) in this field. No spaces or other characters are allowed.',
	dateSuchAs: 'Please enter a valid date such as {date}',
	dateInFormatMDY: 'Please enter a valid date such as MM/DD/YYYY (i.e. "12/31/1999")',
	email: 'Please enter a valid email address. For example "fred@domain.com".',
	url: 'Please enter a valid URL such as http://www.google.com.',
	currencyDollar: 'Please enter a valid $ amount. For example $100.00 .',
	oneRequired: 'Please enter something for at least one of these inputs.',
	errorPrefix: 'Error: ',
	warningPrefix: 'Warning: ',

	// Form.Validator.Extras
	noSpace: 'There can be no spaces in this input.',
	reqChkByNode: 'No items are selected.',
	requiredChk: 'This field is required.',
	reqChkByName: 'Please select a {label}.',
	match: 'This field needs to match the {matchName} field',
	startDate: 'the start date',
	endDate: 'the end date',
	currendDate: 'the current date',
	afterDate: 'The date should be the same or after {label}.',
	beforeDate: 'The date should be the same or before {label}.',
	startMonth: 'Please select a start month',
	sameMonth: 'These two dates must be in the same month - you must change one or the other.',
	creditcard: 'The credit card number entered is invalid. Please check the number and try again. {length} digits entered.'

});


/*
---

script: Form.Validator.js

name: Form.Validator

description: A css-class based form validation system.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - Core/Slick.Finder
  - Core/Element.Event
  - Core/Element.Style
  - Core/JSON
  - /Locale
  - /Class.Binds
  - /Date
  - /Element.Forms
  - /Locale.en-US.Form.Validator
  - /Element.Shortcuts

provides: [Form.Validator, InputValidator, FormValidator.BaseValidators]

...
*/
if (!window.Form) window.Form = {};

var InputValidator = new Class({

	Implements: [Options],

	options: {
		errorMsg: 'Validation failed.',
		test(field) {return true;}
	},

	initialize(className, options) {
		this.setOptions(options);
		this.className = className;
	},

	test(field, props) {
		if (document.id(field)) return this.options.test(document.id(field), props || this.getProps(field));
		else return false;
	},

	getError(field, props) {
		var err = this.options.errorMsg;
		if (typeOf(err) == 'function') err = err(document.id(field), props || this.getProps(field));
		return err;
	},

	getProps(field) {
		if (!document.id(field)) return {};
		return field.get('validatorProps');
	}

});

Element.Properties.validatorProps = {

	set(props) {
		return this.eliminate('$moo:validatorProps').store('$moo:validatorProps', props);
	},

	get(props) {
		if (props) this.set(props);
		if (this.retrieve('$moo:validatorProps')) return this.retrieve('$moo:validatorProps');
		if (this.getProperty('$moo:validatorProps')){
			try {
				this.store('$moo:validatorProps', JSON.decode(this.getProperty('$moo:validatorProps')));
			}catch(e){
				return {};
			}
		} else {
			var vals = this.get('class').split(' ').filter(cls => cls.test(':'));
			if (!vals.length){
				this.store('$moo:validatorProps', {});
			} else {
				props = {};
				vals.each(cls => {
					var split = cls.split(':');
					if (split[1]){
						try {
							props[split[0]] = JSON.decode(split[1]);
						} catch(e){}
					}
				});
				this.store('$moo:validatorProps', props);
			}
		}
		return this.retrieve('$moo:validatorProps');
	}

};

Form.Validator = new Class({

	Implements:[Options, Events],

	Binds: ['onSubmit'],

	options: {/*
		onFormValidate: function(isValid, form, event){},
		onElementValidate: function(isValid, field, className, warn){},
		onElementPass: function(field){},
		onElementFail: function(field, validatorsFailed){}, */
		fieldSelectors: 'input, select, textarea',
		ignoreHidden: true,
		ignoreDisabled: true,
		useTitles: false,
		evaluateOnSubmit: true,
		evaluateFieldsOnBlur: true,
		evaluateFieldsOnChange: true,
		serial: true,
		stopOnFailure: true,
		warningPrefix() {
			return Form.Validator.getMsg('warningPrefix') || 'Warning: ';
		},
		errorPrefix() {
			return Form.Validator.getMsg('errorPrefix') || 'Error: ';
		}
	},

	initialize(form, options) {
		this.setOptions(options);
		this.element = document.id(form);
		this.element.store('validator', this);
		this.warningPrefix = Function.from(this.options.warningPrefix)();
		this.errorPrefix = Function.from(this.options.errorPrefix)();
		if (this.options.evaluateOnSubmit) this.element.addEvent('submit', this.onSubmit);
		if (this.options.evaluateFieldsOnBlur || this.options.evaluateFieldsOnChange) this.watchFields(this.getFields());
	},

	toElement() {
		return this.element;
	},

	getFields() {
		return (this.fields = this.element.getElements(this.options.fieldSelectors));
	},

	watchFields(fields) {
		fields.each(function(el){
			if (this.options.evaluateFieldsOnBlur)
				el.addEvent('blur', this.validationMonitor.pass([el, false], this));
			if (this.options.evaluateFieldsOnChange)
				el.addEvent('change', this.validationMonitor.pass([el, true], this));
		}, this);
	},

	validationMonitor(...args) {
		clearTimeout(this.timer);
		this.timer = this.validateField.delay(50, this, args);
	},

	onSubmit(event) {
		if (!this.validate(event) && event) event.preventDefault();
		else this.reset();
	},

	reset() {
		this.getFields().each(this.resetField, this);
		return this;
	},

	validate(event) {
		var result = this.getFields().map(function(field){
			return this.validateField(field, true);
		}, this).every(v => v);
		this.fireEvent('formValidate', [result, this.element, event]);
		if (this.options.stopOnFailure && !result && event) event.preventDefault();
		return result;
	},

	validateField(field, force) {
        if (this.paused) return true;
        field = document.id(field);
        var passed = !field.hasClass('validation-failed');
        var failed;
        var warned;
        if (this.options.serial && !force){
			failed = this.element.getElement('.validation-failed');
			warned = this.element.getElement('.warning');
		}
        if (field && (!failed || force || field.hasClass('validation-failed') || (failed && !this.options.serial))){
			var validators = field.className.split(' ').some(function(cn){
				return this.getValidator(cn);
			}, this);
			var validatorsFailed = [];
			field.className.split(' ').each(function(className){
				if (className && !this.test(className, field)) validatorsFailed.include(className);
			}, this);
			passed = validatorsFailed.length === 0;
			if (validators && !field.hasClass('warnOnly')){
				if (passed){
					field.addClass('validation-passed').removeClass('validation-failed');
					this.fireEvent('elementPass', field);
				} else {
					field.addClass('validation-failed').removeClass('validation-passed');
					this.fireEvent('elementFail', [field, validatorsFailed]);
				}
			}
			if (!warned){
				var warnings = field.className.split(' ').some(function(cn){
					if (cn.test('^warn-') || field.hasClass('warnOnly'))
						return this.getValidator(cn.replace(/^warn-/,''));
					else return null;
				}, this);
				field.removeClass('warning');
				var warnResult = field.className.split(' ').map(function(cn){
					if (cn.test('^warn-') || field.hasClass('warnOnly'))
						return this.test(cn.replace(/^warn-/,''), field, true);
					else return null;
				}, this);
			}
		}
        return passed;
    },

	test(className, field, warn) {
		field = document.id(field);
		if ((this.options.ignoreHidden && !field.isVisible()) || (this.options.ignoreDisabled && field.get('disabled'))) return true;
		var validator = this.getValidator(className);
		warn = warn != null ? warn : false;
		if (field.hasClass('warnOnly')) warn = true;
		var isValid = field.hasClass('ignoreValidation') || (validator ? validator.test(field) : true);
		if (validator) this.fireEvent('elementValidate', [isValid, field, className, warn]);
		if (warn) return true;
		return isValid;
	},

	resetField(field) {
		field = document.id(field);
		if (field){
			field.className.split(' ').each(className => {
				if (className.test('^warn-')) className = className.replace(/^warn-/, '');
				field.removeClass('validation-failed');
				field.removeClass('warning');
				field.removeClass('validation-passed');
			}, this);
		}
		return this;
	},

	stop() {
		this.paused = true;
		return this;
	},

	start() {
		this.paused = false;
		return this;
	},

	ignoreField(field, warn) {
		field = document.id(field);
		if (field){
			this.enforceField(field);
			if (warn) field.addClass('warnOnly');
			else field.addClass('ignoreValidation');
		}
		return this;
	},

	enforceField(field) {
		field = document.id(field);
		if (field) field.removeClass('warnOnly').removeClass('ignoreValidation');
		return this;
	}

});

Form.Validator.getMsg = key => Locale.get('FormValidator.' + key);

Form.Validator.adders = {

	validators:{},

	add(className, options) {
		this.validators[className] = new InputValidator(className, options);
		//if this is a class (this method is used by instances of Form.Validator and the Form.Validator namespace)
		//extend these validators into it
		//this allows validators to be global and/or per instance
		if (!this.initialize){
			this.implement({
				validators: this.validators
			});
		}
	},

	addAllThese(validators) {
		Array.from(validators).each(function(validator){
			this.add(validator[0], validator[1]);
		}, this);
	},

	getValidator(className) {
		return this.validators[className.split(':')[0]];
	}

};

Object.append(Form.Validator, Form.Validator.adders);

Form.Validator.implement(Form.Validator.adders);

Form.Validator.add('IsEmpty', {

	errorMsg: false,
	test(element) {
		if (element.type == 'select-one' || element.type == 'select')
			return !(element.selectedIndex >= 0 && element.options[element.selectedIndex].value != '');
		else
			return ((element.get('value') == null) || (element.get('value').length == 0));
	}

});

Form.Validator.addAllThese([

	['required', {
		errorMsg() {
			return Form.Validator.getMsg('required');
		},
		test(element) {
			return !Form.Validator.getValidator('IsEmpty').test(element);
		}
	}],

	['minLength', {
		errorMsg(element, props) {
			if (typeOf(props.minLength) != 'null')
				return Form.Validator.getMsg('minLength').substitute({minLength:props.minLength,length:element.get('value').length });
			else return '';
		},
		test(element, props) {
			if (typeOf(props.minLength) != 'null') return (element.get('value').length >= (props.minLength || 0));
			else return true;
		}
	}],

	['maxLength', {
		errorMsg(element, props) {
			//props is {maxLength:10}
			if (typeOf(props.maxLength) != 'null')
				return Form.Validator.getMsg('maxLength').substitute({maxLength:props.maxLength,length:element.get('value').length });
			else return '';
		},
		test(element, props) {
			//if the value is <= than the maxLength value, element passes test
			return (element.get('value').length <= (props.maxLength || 10000));
		}
	}],

	['validate-integer', {
		errorMsg: Form.Validator.getMsg.pass('integer'),
		test(element) {
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^(-?[1-9]\d*|0)$/).test(element.get('value'));
		}
	}],

	['validate-numeric', {
		errorMsg: Form.Validator.getMsg.pass('numeric'),
		test(element) {
			return Form.Validator.getValidator('IsEmpty').test(element) ||
				(/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/).test(element.get('value'));
		}
	}],

	['validate-digits', {
		errorMsg: Form.Validator.getMsg.pass('digits'),
		test(element) {
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^[\d() .:\-\+#]+$/.test(element.get('value')));
		}
	}],

	['validate-alpha', {
		errorMsg: Form.Validator.getMsg.pass('alpha'),
		test(element) {
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^[a-zA-Z]+$/).test(element.get('value'));
		}
	}],

	['validate-alphanum', {
		errorMsg: Form.Validator.getMsg.pass('alphanum'),
		test(element) {
			return Form.Validator.getValidator('IsEmpty').test(element) || !(/\W/).test(element.get('value'));
		}
	}],

	['validate-date', {
		errorMsg(element, props) {
			if (Date.parse){
				var format = props.dateFormat || '%x';
				return Form.Validator.getMsg('dateSuchAs').substitute({date: new Date().format(format)});
			} else {
				return Form.Validator.getMsg('dateInFormatMDY');
			}
		},
		test(element, props) {
			if (Form.Validator.getValidator('IsEmpty').test(element)) return true;
			var d;
			if (Date.parse){
				var format = props.dateFormat || '%x';
				d = Date.parse(element.get('value'));
				var formatted = d.format(format);
				if (formatted != 'invalid date') element.set('value', formatted);
				return !isNaN(d);
			} else {
				var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
				if (!regex.test(element.get('value'))) return false;
				d = new Date(element.get('value').replace(regex, '$1/$2/$3'));
				return (parseInt(RegExp.$1, 10) == (1 + d.getMonth())) &&
					(parseInt(RegExp.$2, 10) == d.getDate()) &&
					(parseInt(RegExp.$3, 10) == d.getFullYear());
			}
		}
	}],

	['validate-email', {
		errorMsg: Form.Validator.getMsg.pass('email'),
		test(element) {
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(element.get('value'));
		}
	}],

	['validate-url', {
		errorMsg: Form.Validator.getMsg.pass('url'),
		test(element) {
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(element.get('value'));
		}
	}],

	['validate-currency-dollar', {
		errorMsg: Form.Validator.getMsg.pass('currencyDollar'),
		test(element) {
			// [$]1[##][,###]+[.##]
			// [$]1###+[.##]
			// [$]0.##
			// [$].##
			return Form.Validator.getValidator('IsEmpty').test(element) || (/^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/).test(element.get('value'));
		}
	}],

	['validate-one-required', {
		errorMsg: Form.Validator.getMsg.pass('oneRequired'),
		test(element, props) {
			var p = document.id(props['validate-one-required']) || element.getParent(props['validate-one-required']);
			return p.getElements('input').some(el => {
				if (['checkbox', 'radio'].contains(el.get('type'))) return el.get('checked');
				return el.get('value');
			});
		}
	}]

]);

Element.Properties.validator = {

	set(options) {
		var validator = this.retrieve('validator');
		if (validator) validator.setOptions(options);
		return this.store('$moo:validator:options', options);
	},

	get(options) {
		if (options || !this.retrieve('validator')){
			if (options || !this.retrieve('$moo:validator:options')) this.set('validator', options);
			this.store('validator', new Form.Validator(this, this.retrieve('$moo:validator:options')));
		}
		return this.retrieve('validator');
	}

};

Element.implement({

	validate(options) {
		if (options) this.set('validator', options);
		return this.get('validator', options).validate();
	}

});



/*
---

script: Form.Validator.Inline.js

name: Form.Validator.Inline

description: Extends Form.Validator to add inline messages.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Form.Validator

provides: [Form.Validator.Inline]

...
*/

Form.Validator.Inline = new Class({

	Extends: Form.Validator,

	options: {
		showError(errorElement) {
			if (errorElement.reveal) errorElement.reveal();
			else errorElement.setStyle('display', 'block');
		},
		hideError(errorElement) {
			if (errorElement.dissolve) errorElement.dissolve();
			else errorElement.setStyle('display', 'none');
		},
		scrollToErrorsOnSubmit: true,
		scrollToErrorsOnBlur: false,
		scrollToErrorsOnChange: false,
		scrollFxOptions: {
			transition: 'quad:out',
			offset: {
				y: -20
			}
		}
	},

	initialize(form, options) {
		this.parent(form, options);
		this.addEvent('onElementValidate', function(isValid, field, className, warn){
			var validator = this.getValidator(className);
			if (!isValid && validator.getError(field)){
				if (warn) field.addClass('warning');
				var advice = this.makeAdvice(className, field, validator.getError(field), warn);
				this.insertAdvice(advice, field);
				this.showAdvice(className, field);
			} else {
				this.hideAdvice(className, field);
			}
		});
	},

	makeAdvice(className, field, error, warn) {
		var errorMsg = (warn) ? this.warningPrefix : this.errorPrefix;
			errorMsg += (this.options.useTitles) ? field.title || error:error;
		var cssClass = (warn) ? 'warning-advice' : 'validation-advice';
		var advice = this.getAdvice(className, field);
		if (advice){
			advice = advice.set('html', errorMsg);
		} else {
			advice = new Element('div', {
				html: errorMsg,
				styles: { display: 'none' },
				id: 'advice-' + className.split(':')[0] + '-' + this.getFieldId(field)
			}).addClass(cssClass);
		}
		field.store('$moo:advice-' + className, advice);
		return advice;
	},

	getFieldId(field) {
		return field.id ? field.id : field.id = 'input_' + field.name;
	},

	showAdvice(className, field) {
		var advice = this.getAdvice(className, field);
		if (advice && !field.retrieve('$moo:' + this.getPropName(className))
				&& (advice.getStyle('display') == 'none'
				|| advice.getStyle('visiblity') == 'hidden'
				|| advice.getStyle('opacity') == 0)){
			field.store('$moo:' + this.getPropName(className), true);
			this.options.showError(advice);
			this.fireEvent('showAdvice', [field, advice, className]);
		}
	},

	hideAdvice(className, field) {
		var advice = this.getAdvice(className, field);
		if (advice && field.retrieve('$moo:' + this.getPropName(className))){
			field.store('$moo:' + this.getPropName(className), false);
			this.options.hideError(advice);
			this.fireEvent('hideAdvice', [field, advice, className]);
		}
	},

	getPropName(className) {
		return 'advice' + className;
	},

	resetField(field) {
		field = document.id(field);
		if (!field) return this;
		this.parent(field);
		field.className.split(' ').each(function(className){
			this.hideAdvice(className, field);
		}, this);
		return this;
	},

	getAllAdviceMessages(field, force) {
		var advice = [];
		if (field.hasClass('ignoreValidation') && !force) return advice;
		var validators = field.className.split(' ').some(function(cn){
			var warner = cn.test('^warn-') || field.hasClass('warnOnly');
			if (warner) cn = cn.replace(/^warn-/, '');
			var validator = this.getValidator(cn);
			if (!validator) return;
			advice.push({
				message: validator.getError(field),
				warnOnly: warner,
				passed: validator.test(),
				validator
			});
		}, this);
		return advice;
	},

	getAdvice(className, field) {
		return field.retrieve('$moo:advice-' + className);
	},

	insertAdvice(advice, field) {
		//Check for error position prop
		var props = field.get('validatorProps');
		//Build advice
		if (!props.msgPos || !document.id(props.msgPos)){
			if (field.type && field.type.toLowerCase() == 'radio') field.getParent().adopt(advice);
			else advice.inject(document.id(field), 'after');
		} else {
			document.id(props.msgPos).grab(advice);
		}
	},

	validateField(field, force, scroll) {
		var result = this.parent(field, force);
		if (((this.options.scrollToErrorsOnSubmit && scroll == null) || scroll) && !result){
			var failed = document.id(this).getElement('.validation-failed');
			var par = document.id(this).getParent();
			while (par != document.body && par.getScrollSize().y == par.getSize().y){
				par = par.getParent();
			}
			var fx = par.retrieve('$moo:fvScroller');
			if (!fx && window.Fx && Fx.Scroll){
				fx = new Fx.Scroll(par, this.options.scrollFxOptions);
				par.store('$moo:fvScroller', fx);
			}
			if (failed){
				if (fx) fx.toElement(failed);
				else par.scrollTo(par.getScroll().x, failed.getPosition(par).y - 20);
			}
		}
		return result;
	},

	watchFields(fields) {
		fields.each(function(el){
		if (this.options.evaluateFieldsOnBlur){
			el.addEvent('blur', this.validationMonitor.pass([el, false, this.options.scrollToErrorsOnBlur], this));
		}
		if (this.options.evaluateFieldsOnChange){
				el.addEvent('change', this.validationMonitor.pass([el, true, this.options.scrollToErrorsOnChange], this));
			}
		}, this);
	}

});


/*
---

script: Form.Validator.Extras.js

name: Form.Validator.Extras

description: Additional validators for the Form.Validator class.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Form.Validator

provides: [Form.Validator.Extras]

...
*/
Form.Validator.addAllThese([

	['validate-enforce-oncheck', {
		test(element, props) {
			var fv = element.getParent('form').retrieve('validator');
			if (!fv) return true;
			(props.toEnforce || document.id(props.enforceChildrenOf).getElements('input, select, textarea')).map(item => {
				if (element.checked){
					fv.enforceField(item);
				} else {
					fv.ignoreField(item);
					fv.resetField(item);
				}
			});
			return true;
		}
	}],

	['validate-ignore-oncheck', {
		test(element, props) {
			var fv = element.getParent('form').retrieve('validator');
			if (!fv) return true;
			(props.toIgnore || document.id(props.ignoreChildrenOf).getElements('input, select, textarea')).each(item => {
				if (element.checked){
					fv.ignoreField(item);
					fv.resetField(item);
				} else {
					fv.enforceField(item);
				}
			});
			return true;
		}
	}],

	['validate-nospace', {
		errorMsg() {
			return Form.Validator.getMsg('noSpace');
		},
		test(element, props) {
			return !element.get('value').test(/\s/);
		}
	}],

	['validate-toggle-oncheck', {
		test(element, props) {
			var fv = element.getParent('form').retrieve('validator');
			if (!fv) return true;
			var eleArr = props.toToggle || document.id(props.toToggleChildrenOf).getElements('input, select, textarea');
			if (!element.checked){
				eleArr.each(item => {
					fv.ignoreField(item);
					fv.resetField(item);
				});
			} else {
				eleArr.each(item => {
					fv.enforceField(item);
				});
			}
			return true;
		}
	}],

	['validate-reqchk-bynode', {
		errorMsg() {
			return Form.Validator.getMsg('reqChkByNode');
		},
		test(element, props) {
			return (document.id(props.nodeId).getElements(props.selector || 'input[type=checkbox], input[type=radio]')).some(item => item.checked);
		}
	}],

	['validate-required-check', {
		errorMsg(element, props) {
			return props.useTitle ? element.get('title') : Form.Validator.getMsg('requiredChk');
		},
		test(element, props) {
			return !!element.checked;
		}
	}],

	['validate-reqchk-byname', {
		errorMsg(element, props) {
			return Form.Validator.getMsg('reqChkByName').substitute({label: props.label || element.get('type')});
		},
		test(element, props) {
			var grpName = props.groupName || element.get('name');
			var oneCheckedItem = $$(document.getElementsByName(grpName)).some((item, index) => item.checked);
			var fv = element.getParent('form').retrieve('validator');
			if (oneCheckedItem && fv) fv.resetField(element);
			return oneCheckedItem;
		}
	}],

	['validate-match', {
		errorMsg(element, props) {
			return Form.Validator.getMsg('match').substitute({matchName: props.matchName || document.id(props.matchInput).get('name')});
		},
		test(element, props) {
			var eleVal = element.get('value');
			var matchVal = document.id(props.matchInput) && document.id(props.matchInput).get('value');
			return eleVal && matchVal ? eleVal == matchVal : true;
		}
	}],

	['validate-after-date', {
		errorMsg(element, props) {
			return Form.Validator.getMsg('afterDate').substitute({
				label: props.afterLabel || (props.afterElement ? Form.Validator.getMsg('startDate') : Form.Validator.getMsg('currentDate'))
			});
		},
		test(element, props) {
			var start = document.id(props.afterElement) ? Date.parse(document.id(props.afterElement).get('value')) : new Date();
			var end = Date.parse(element.get('value'));
			return end && start ? end >= start : true;
		}
	}],

	['validate-before-date', {
		errorMsg(element, props) {
			return Form.Validator.getMsg('beforeDate').substitute({
				label: props.beforeLabel || (props.beforeElement ? Form.Validator.getMsg('endDate') : Form.Validator.getMsg('currentDate'))
			});
		},
		test(element, props) {
			var start = Date.parse(element.get('value'));
			var end = document.id(props.beforeElement) ? Date.parse(document.id(props.beforeElement).get('value')) : new Date();
			return end && start ? end >= start : true;
		}
	}],

	['validate-custom-required', {
		errorMsg() {
			return Form.Validator.getMsg('required');
		},
		test(element, props) {
			return element.get('value') != props.emptyValue;
		}
	}],

	['validate-same-month', {
		errorMsg(element, props) {
			var startMo = document.id(props.sameMonthAs) && document.id(props.sameMonthAs).get('value');
			var eleVal = element.get('value');
			if (eleVal != '') return Form.Validator.getMsg(startMo ? 'sameMonth' : 'startMonth');
		},
		test(element, props) {
			var d1 = Date.parse(element.get('value'));
			var d2 = Date.parse(document.id(props.sameMonthAs) && document.id(props.sameMonthAs).get('value'));
			return d1 && d2 ? d1.format('%B') == d2.format('%B') : true;
		}
	}],


	['validate-cc-num', {
		errorMsg(element) {
			var ccNum = element.get('value').replace(/[^0-9]/g, '');
			return Form.Validator.getMsg('creditcard').substitute({length: ccNum.length});
		},
		test(element) {
			// required is a different test
			if (Form.Validator.getValidator('IsEmpty').test(element)) return true;

			// Clean number value
			var ccNum = element.get('value');
			ccNum = ccNum.replace(/[^0-9]/g, '');

			var valid_type = false;

			if (ccNum.test(/^4[0-9]{12}([0-9]{3})?$/)) valid_type = 'Visa';
			else if (ccNum.test(/^5[1-5]([0-9]{14})$/)) valid_type = 'Master Card';
			else if (ccNum.test(/^3[47][0-9]{13}$/)) valid_type = 'American Express';
			else if (ccNum.test(/^6011[0-9]{12}$/)) valid_type = 'Discover';

			if (valid_type){
				var sum = 0;
				var cur = 0;

				for (var i=ccNum.length-1; i>=0; --i){
					cur = ccNum.charAt(i).toInt();
					if (cur == 0) continue;

					if ((ccNum.length-i) % 2 == 0) cur += cur;
					if (cur > 9){
						cur = cur.toString().charAt(0).toInt() + cur.toString().charAt(1).toInt();
					}

					sum += cur;
				}
				if ((sum % 10) == 0) return true;
			}

			var chunks = '';
			while (ccNum != ''){
				chunks += ' ' + ccNum.substr(0,4);
				ccNum = ccNum.substr(4);
			}

			element.getParent('form').retrieve('validator').ignoreField(element);
			element.set('value', chunks.clean());
			element.getParent('form').retrieve('validator').enforceField(element);
			return false;
		}
	}]


]);


/*
---

script: OverText.js

name: OverText

description: Shows text over an input that disappears when the user clicks into it. The text remains hidden if the user adds a value.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - Core/Element.Event
  - /Class.Binds
  - /Class.Occlude
  - /Element.Position
  - /Element.Shortcuts

provides: [OverText]

...
*/

var OverText = new Class({

	Implements: [Options, Events, Class.Occlude],

	Binds: ['reposition', 'assert', 'focus', 'hide'],

	options: {/*
		textOverride: null,
		onFocus: function(){},
		onTextHide: function(textEl, inputEl){},
		onTextShow: function(textEl, inputEl){}, */
		element: 'label',
		positionOptions: {
			position: 'upperLeft',
			edge: 'upperLeft',
			offset: {
				x: 4,
				y: 2
			}
		},
		poll: false,
		pollInterval: 250,
		wrap: false
	},

	property: 'OverText',

	initialize(element, options) {
		this.element = document.id(element);
		if (this.occlude()) return this.occluded;
		this.setOptions(options);
		this.attach(this.element);
		OverText.instances.push(this);
		if (this.options.poll) this.poll();
		return this;
	},

	toElement() {
		return this.element;
	},

	attach() {
		var val = this.options.textOverride || this.element.get('alt') || this.element.get('title');
		if (!val) return;
		this.text = new Element(this.options.element, {
			'class': 'overTxtLabel',
			styles: {
				lineHeight: 'normal',
				position: 'absolute',
				cursor: 'text'
			},
			html: val,
			events: {
				click: this.hide.pass(this.options.element == 'label', this)
			}
		}).inject(this.element, 'after');
		if (this.options.element == 'label'){
			if (!this.element.get('id')) this.element.set('id', 'input_' + new Date().getTime());
			this.text.set('for', this.element.get('id'));
		}

		if (this.options.wrap){
			this.textHolder = new Element('div', {
				styles: {
					lineHeight: 'normal',
					position: 'relative'
				},
				'class':'overTxtWrapper'
			}).adopt(this.text).inject(this.element, 'before');
		}

		return this.enable();
	},

	destroy() {
		this.element.eliminate('OverTextDiv').eliminate('OverText');
		this.disable();
		if (this.text) this.text.destroy();
		if (this.textHolder) this.textHolder.destroy();
		return this;
	},

	disable() {
		this.element.removeEvents({
			focus: this.focus,
			blur: this.assert,
			change: this.assert
		});
		window.removeEvent('resize', this.reposition);
		this.hide(true, true);
		return this;
	},

	enable() {
		this.element.addEvents({
			focus: this.focus,
			blur: this.assert,
			change: this.assert
		});
		window.addEvent('resize', this.reposition);
		this.assert(true);
		this.reposition();
		return this;
	},

	wrap() {
		if (this.options.element == 'label'){
			if (!this.element.get('id')) this.element.set('id', 'input_' + new Date().getTime());
			this.text.set('for', this.element.get('id'));
		}
	},

	startPolling() {
		this.pollingPaused = false;
		return this.poll();
	},

	poll(stop) {
		//start immediately
		//pause on focus
		//resumeon blur
		if (this.poller && !stop) return this;
		var test = () => {
			if (!this.pollingPaused) this.assert(true);
		};
		if (stop) clearInterval(this.poller);
		else this.poller = test.periodical(this.options.pollInterval, this);
		return this;
	},

	stopPolling() {
		this.pollingPaused = true;
		return this.poll(true);
	},

	focus() {
		if (this.text && (!this.text.isDisplayed() || this.element.get('disabled'))) return;
		this.hide();
	},

	hide(suppressFocus, force) {
		if (this.text && (this.text.isDisplayed() && (!this.element.get('disabled') || force))){
			this.text.hide();
			this.fireEvent('textHide', [this.text, this.element]);
			this.pollingPaused = true;
			if (!suppressFocus){
				try {
					this.element.fireEvent('focus');
					this.element.focus();
				} catch(e){} //IE barfs if you call focus on hidden elements
			}
		}
		return this;
	},

	show() {
		if (this.text && !this.text.isDisplayed()){
			this.text.show();
			this.reposition();
			this.fireEvent('textShow', [this.text, this.element]);
			this.pollingPaused = false;
		}
		return this;
	},

	assert(suppressFocus) {
		this[this.test() ? 'show' : 'hide'](suppressFocus);
	},

	test() {
		var v = this.element.get('value');
		return !v;
	},

	reposition() {
		this.assert(true);
		if (!this.element.isVisible()) return this.stopPolling().hide();
		if (this.text && this.test()) this.text.position(Object.merge(this.options.positionOptions, {relativeTo: this.element}));
		return this;
	}

});

OverText.instances = [];

Object.append(OverText, {

	each(fn) {
		return OverText.instances.map((ot, i) => {
			if (ot.element && ot.text) return fn.apply(OverText, [ot, i]);
			return null; //the input or the text was destroyed
		});
	},

	update() {

		return OverText.each(ot => ot.reposition());

	},

	hideAll() {

		return OverText.each(ot => ot.hide(true, true));

	},

	showAll() {
		return OverText.each(ot => ot.show());
	}

});

if (window.Fx && Fx.Reveal){
	Fx.Reveal.implement({
		hideInputs: Browser.ie ? 'select, input, textarea, object, embed, .overTxtLabel' : false
	});
}


/*
---

script: Fx.Elements.js

name: Fx.Elements

description: Effect to change any number of CSS properties of any number of Elements.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx.CSS
  - /MooTools.More

provides: [Fx.Elements]

...
*/

Fx.Elements = new Class({

	Extends: Fx.CSS,

	initialize(elements, options) {
		this.elements = this.subject = $$(elements);
		this.parent(options);
	},

	compute(from, to, delta) {
		var now = {};

		for (var i in from){
            var iFrom = from[i];
            var iTo = to[i];
            var iNow = now[i] = {};
            for (var p in iFrom) iNow[p] = this.parent(iFrom[p], iTo[p], delta);
        }

		return now;
	},

	set(now) {
		for (var i in now){
			if (!this.elements[i]) continue;

			var iNow = now[i];
			for (var p in iNow) this.render(this.elements[i], p, iNow[p], this.options.unit);
		}

		return this;
	},

	start(obj) {
        if (!this.check(obj)) return this;
        var from = {};
        var to = {};

        for (var i in obj){
            if (!this.elements[i]) continue;

            var iProps = obj[i];
            var iFrom = from[i] = {};
            var iTo = to[i] = {};

            for (var p in iProps){
				var parsed = this.prepare(this.elements[i], p, iProps[p]);
				iFrom[p] = parsed.from;
				iTo[p] = parsed.to;
			}
        }

        return this.parent(from, to);
    }

});


/*
---

script: Fx.Accordion.js

name: Fx.Accordion

description: An Fx.Elements extension which allows you to easily create accordion type controls.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Event
  - /Fx.Elements

provides: [Fx.Accordion]

...
*/

Fx.Accordion = new Class({

	Extends: Fx.Elements,

	options: {/*
		onActive: function(toggler, section){},
		onBackground: function(toggler, section){},*/
		fixedHeight: false,
		fixedWidth: false,
		display: 0,
		show: false,
		height: true,
		width: false,
		opacity: true,
		alwaysHide: false,
		trigger: 'click',
		initialDisplayFx: true,
		returnHeightToAuto: true
	},

	initialize(...args) {
		var defined = obj => obj != null;

		var params = Array.link(args, {
			'container': Type.isElement, //deprecated
			'options': Type.isObject,
			'togglers': defined,
			'elements': defined
		});
		this.parent(params.elements, params.options);

		this.togglers = $$(params.togglers);
		this.previous = -1;
		this.internalChain = new Chain();

		if (this.options.alwaysHide) this.options.wait = true;

		if (this.options.show || this.options.show === 0){
			this.options.display = false;
			this.previous = this.options.show;
		}

		if (this.options.start){
			this.options.display = false;
			this.options.show = false;
		}

		this.effects = {};

		if (this.options.opacity) this.effects.opacity = 'fullOpacity';
		if (this.options.width) this.effects.width = this.options.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (this.options.height) this.effects.height = this.options.fixedHeight ? 'fullHeight' : 'scrollHeight';

		for (var i = 0, l = this.togglers.length; i < l; i++) this.addSection(this.togglers[i], this.elements[i]);

		this.elements.each(function(el, i){
			if (this.options.show === i){
				this.fireEvent('active', [this.togglers[i], el]);
			} else {
				for (var fx in this.effects) el.setStyle(fx, 0);
			}
		}, this);

		if (this.options.display || this.options.display === 0 || this.options.initialDisplayFx === false){
			this.display(this.options.display, this.options.initialDisplayFx);
		}

		if (this.options.fixedHeight !== false) this.options.returnHeightToAuto = false;
		this.addEvent('complete', this.internalChain.callChain.bind(this.internalChain));
	},

	addSection(toggler, element) {
		toggler = document.id(toggler);
		element = document.id(element);
		this.togglers.include(toggler);
		this.elements.include(element);

		var test = this.togglers.contains(toggler);
		var idx = this.togglers.indexOf(toggler);
		var displayer = this.display.pass(idx, this);

		toggler.store('accordion:display', displayer)
			.addEvent(this.options.trigger, displayer);

		if (this.options.height) element.setStyles({'padding-top': 0, 'border-top': 'none', 'padding-bottom': 0, 'border-bottom': 'none'});
		if (this.options.width) element.setStyles({'padding-left': 0, 'border-left': 'none', 'padding-right': 0, 'border-right': 'none'});

		element.fullOpacity = 1;
		if (this.options.fixedWidth) element.fullWidth = this.options.fixedWidth;
		if (this.options.fixedHeight) element.fullHeight = this.options.fixedHeight;
		element.setStyle('overflow', 'hidden');

		if (!test){
			for (var fx in this.effects) element.setStyle(fx, 0);
		}
		return this;
	},

	removeSection(toggler, displayIndex) {
		var idx = this.togglers.indexOf(toggler);
		var element = this.elements[idx];
		var remover = () => {
			this.togglers.erase(toggler);
			this.elements.erase(element);
			this.detach(toggler);
		};

		if (this.now == idx || displayIndex != null){
			this.display(displayIndex != null ? displayIndex : (idx - 1 >= 0 ? idx - 1 : 0)).chain(remover);
		} else {
			remover();
		}
		return this;
	},

	detach(toggler) {
		var remove = toggler => {
			toggler.removeEvent(this.options.trigger, toggler.retrieve('accordion:display'));
		};

		if (!toggler) this.togglers.each(remove);
		else remove(toggler);
		return this;
	},

	display(index, useFx) {
		if (!this.check(index, useFx)) return this;
		useFx = useFx != null ? useFx : true;
		index = (typeOf(index) == 'element') ? this.elements.indexOf(index) : index;
		if (index == this.previous && !this.options.alwaysHide) return this;
		if (this.options.returnHeightToAuto){
			var prev = this.elements[this.previous];
			if (prev && !this.selfHidden){
				for (var fx in this.effects){
					prev.setStyle(fx, prev[this.effects[fx]]);
				}
			}
		}

		if ((this.timer && this.options.wait) || (index === this.previous && !this.options.alwaysHide)) return this;
		this.previous = index;
		var obj = {};
		this.elements.each(function(el, i){
			obj[i] = {};
			var hide;
			if (i != index){
				hide = true;
			} else if (this.options.alwaysHide && ((el.offsetHeight > 0 && this.options.height) || el.offsetWidth > 0 && this.options.width)){
				hide = true;
				this.selfHidden = true;
			}
			this.fireEvent(hide ? 'background' : 'active', [this.togglers[i], el]);
			for (var fx in this.effects) obj[i][fx] = hide ? 0 : el[this.effects[fx]];
		}, this);

		this.internalChain.clearChain();
		this.internalChain.chain(() => {
			if (this.options.returnHeightToAuto && !this.selfHidden){
				var el = this.elements[index];
				if (el) el.setStyle('height', 'auto');
			};
		});
		return useFx ? this.start(obj) : this.set(obj);
	}

});




/*
---

script: Fx.Move.js

name: Fx.Move

description: Defines Fx.Move, a class that works with Element.Position.js to transition an element from one location to another.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Fx.Morph
  - /Element.Position

provides: [Fx.Move]

...
*/

Fx.Move = new Class({

	Extends: Fx.Morph,

	options: {
		relativeTo: document.body,
		position: 'center',
		edge: false,
		offset: {x: 0, y: 0}
	},

	start(destination) {
        var element = this.element;
        var topLeft = element.getStyles('top', 'left');
        if (topLeft.top == 'auto' || topLeft.left == 'auto'){
			element.setPosition(element.getPosition(element.getOffsetParent()));
		}
        return this.parent(element.position(Object.merge(this.options, destination, {returnPos: true})));
    }

});

Element.Properties.move = {

	set(options) {
		this.get('move').cancel().setOptions(options);
		return this;
	},

	get() {
		var move = this.retrieve('move');
		if (!move){
			move = new Fx.Move(this, {link: 'cancel'});
			this.store('move', move);
		}
		return move;
	}

};

Element.implement({

	move(options) {
		this.get('move').start(options);
		return this;
	}

});


/*
---

script: Fx.Slide.js

name: Fx.Slide

description: Effect to slide an element in and out of view.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx
  - Core/Element.Style
  - /MooTools.More

provides: [Fx.Slide]

...
*/

Fx.Slide = new Class({

	Extends: Fx,

	options: {
		mode: 'vertical',
		wrapper: false,
		hideOverflow: true,
		resetHeight: false
	},

	initialize(element, options) {
		this.addEvent('complete', function(){
			this.open = (this.wrapper['offset' + this.layout.capitalize()] != 0);
			if (this.open && this.options.resetHeight) this.wrapper.setStyle('height', '');
		}, true);

		this.element = this.subject = document.id(element);
		this.parent(options);
		var wrapper = this.element.retrieve('wrapper');
		var styles = this.element.getStyles('margin', 'position', 'overflow');

		if (this.options.hideOverflow) styles = Object.append(styles, {overflow: 'hidden'});
		if (this.options.wrapper) wrapper = document.id(this.options.wrapper).setStyles(styles);

		this.wrapper = wrapper || new Element('div', {
			styles
		}).wraps(this.element);

		this.element.store('wrapper', this.wrapper).setStyle('margin', 0);
		this.now = [];
		this.open = true;
	},

	vertical() {
		this.margin = 'margin-top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
	},

	horizontal() {
		this.margin = 'margin-left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
	},

	set(now) {
		this.element.setStyle(this.margin, now[0]);
		this.wrapper.setStyle(this.layout, now[1]);
		return this;
	},

	compute(from, to, delta) {
		return [0, 1].map(i => Fx.compute(from[i], to[i], delta));
	},

	start(how, mode) {
		if (!this.check(how, mode)) return this;
		this[mode || this.options.mode]();
		var margin = this.element.getStyle(this.margin).toInt();
		var layout = this.wrapper.getStyle(this.layout).toInt();
		var caseIn = [[margin, layout], [0, this.offset]];
		var caseOut = [[margin, layout], [-this.offset, 0]];
		var start;
		switch (how){
			case 'in': start = caseIn; break;
			case 'out': start = caseOut; break;
			case 'toggle': start = (layout == 0) ? caseIn : caseOut;
		}
		return this.parent(start[0], start[1]);
	},

	slideIn(mode) {
		return this.start('in', mode);
	},

	slideOut(mode) {
		return this.start('out', mode);
	},

	hide(mode) {
		this[mode || this.options.mode]();
		this.open = false;
		return this.set([-this.offset, 0]);
	},

	show(mode) {
		this[mode || this.options.mode]();
		this.open = true;
		return this.set([0, this.offset]);
	},

	toggle(mode) {
		return this.start('toggle', mode);
	}

});

Element.Properties.slide = {

	set(options) {
		this.get('slide').cancel().setOptions(options);
		return this;
	},

	get() {
		var slide = this.retrieve('slide');
		if (!slide){
			slide = new Fx.Slide(this, {link: 'cancel'});
			this.store('slide', slide);
		}
		return slide;
	}

};

Element.implement({

	slide(how, mode) {
        how = how || 'toggle';
        var slide = this.get('slide');
        var toggle;
        switch (how){
			case 'hide': slide.hide(mode); break;
			case 'show': slide.show(mode); break;
			case 'toggle':
				var flag = this.retrieve('slide:flag', slide.open);
				slide[flag ? 'slideOut' : 'slideIn'](mode);
				this.store('slide:flag', !flag);
				toggle = true;
			break;
			default: slide.start(how, mode);
		}
        if (!toggle) this.eliminate('slide:flag');
        return this;
    }

});


/*
---

script: Fx.Scroll.js

name: Fx.Scroll

description: Effect to smoothly scroll any element, including the window.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx
  - Core/Element.Event
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Fx.Scroll]

...
*/

((() => {

Fx.Scroll = new Class({

	Extends: Fx,

	options: {
		offset: {x: 0, y: 0},
		wheelStops: true
	},

	initialize(element, options) {
		this.element = this.subject = document.id(element);
		this.parent(options);

		if (typeOf(this.element) != 'element') this.element = document.id(this.element.getDocument().body);

		if (this.options.wheelStops){
            var stopper = this.element;
            var cancel = this.cancel.pass(false, this);
            this.addEvent('start', () => {
				stopper.addEvent('mousewheel', cancel);
			}, true);
            this.addEvent('complete', () => {
				stopper.removeEvent('mousewheel', cancel);
			}, true);
        }
	},

	set(...args) {
		var now = Array.flatten(args);
		if (Browser.firefox) now = [Math.round(now[0]), Math.round(now[1])]; // not needed anymore in newer firefox versions
		this.element.scrollTo(now[0] + this.options.offset.x, now[1] + this.options.offset.y);
	},

	compute(from, to, delta) {
		return [0, 1].map(i => Fx.compute(from[i], to[i], delta));
	},

	start(x, y) {
        if (!this.check(x, y)) return this;
        var element = this.element;
        var scrollSize = element.getScrollSize();
        var scroll = element.getScroll();
        var size = element.getSize();
        values = {x, y};

        for (var z in values){
			if (!values[z] && values[z] !== 0) values[z] = scroll[z];
			if (typeOf(values[z]) != 'number') values[z] = scrollSize[z] - size[z];
			values[z] += this.options.offset[z];
		}

        return this.parent([scroll.x, scroll.y], [values.x, values.y]);
    },

	toTop() {
		return this.start(false, 0);
	},

	toLeft() {
		return this.start(0, false);
	},

	toRight() {
		return this.start('right', false);
	},

	toBottom() {
		return this.start(false, 'bottom');
	},

	toElement(el) {
        var position = document.id(el).getPosition(this.element);
        var scroll = isBody(this.element) ? {x: 0, y: 0} : this.element.getScroll();
        return this.start(position.x + scroll.x, position.y + scroll.y);
    },

	scrollIntoView(el, axes, offset) {
        axes = axes ? Array.from(axes) : ['x','y'];
        el = document.id(el);
        var to = {};
        var position = el.getPosition(this.element);
        var size = el.getSize();
        var scroll = this.element.getScroll();
        var containerSize = this.element.getSize();

        var edge = {
            x: position.x + size.x,
            y: position.y + size.y
        };

        ['x','y'].each(axis => {
			if (axes.contains(axis)){
				if (edge[axis] > scroll[axis] + containerSize[axis]) to[axis] = edge[axis] - containerSize[axis];
				if (position[axis] < scroll[axis]) to[axis] = position[axis];
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);

        if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
        return this;
    },

	scrollToCenter(el, axes, offset) {
        axes = axes ? Array.from(axes) : ['x', 'y'];
        el = document.id(el);
        var to = {};
        var position = el.getPosition(this.element);
        var size = el.getSize();
        var scroll = this.element.getScroll();
        var containerSize = this.element.getSize();

        ['x','y'].each(axis => {
			if (axes.contains(axis)){
				to[axis] = position[axis] - (containerSize[axis] - size[axis])/2;
			}
			if (to[axis] == null) to[axis] = scroll[axis];
			if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
		}, this);

        if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
        return this;
    }

});

function isBody(element){
	return (/^(?:body|html)$/i).test(element.tagName);
};

}))();


/*
---

script: Fx.SmoothScroll.js

name: Fx.SmoothScroll

description: Class for creating a smooth scrolling effect to all internal links on the page.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Slick.Finder
  - /Fx.Scroll

provides: [Fx.SmoothScroll]

...
*/

Fx.SmoothScroll = new Class({

	Extends: Fx.Scroll,

	initialize(options, context) {
        context = context || document;
        this.doc = context.getDocument();
        this.parent(this.doc, options);

        var win = context.getWindow();
        var location = win.location.href.match(/^[^#]*/)[0] + '#';
        var links = $$(this.options.links || this.doc.links);

        links.each(function(link){
			if (link.href.indexOf(location) != 0) return;
			var anchor = link.href.substr(location.length);
			if (anchor) this.useLink(link, anchor);
		}, this);
    },

	useLink(link, anchor) {

		link.addEvent('click', event => {
			var el = document.id(anchor) || this.doc.getElement('a[name=' + anchor + ']');
			if (!el) return;

			event.preventDefault();
			this.toElement(el).chain(() => {
				this.fireEvent('scrolledTo', [link, el]);
			});

		});

		return this;
	}
});


/*
---

script: Fx.Sort.js

name: Fx.Sort

description: Defines Fx.Sort, a class that reorders lists with a transition.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element.Dimensions
  - /Fx.Elements
  - /Element.Measure

provides: [Fx.Sort]

...
*/

Fx.Sort = new Class({

	Extends: Fx.Elements,

	options: {
		mode: 'vertical'
	},

	initialize(elements, options) {
		this.parent(elements, options);
		this.elements.each(el => {
			if (el.getStyle('position') == 'static') el.setStyle('position', 'relative');
		});
		this.setDefaultOrder();
	},

	setDefaultOrder() {
		this.currentOrder = this.elements.map((el, index) => index);
	},

	sort(...args) {
        if (!this.check(args)) return this;
        var newOrder = Array.flatten(args);

        var top = 0;
        var left = 0;
        var next = {};
        var zero = {};
        var vert = this.options.mode == 'vertical';

        var current = this.elements.map((el, index) => {
			var size = el.getComputedSize({styles: ['border', 'padding', 'margin']});
			var val;
			if (vert){
				val = {
					top,
					margin: size['margin-top'],
					height: size.totalHeight
				};
				top += val.height - size['margin-top'];
			} else {
				val = {
					left,
					margin: size['margin-left'],
					width: size.totalWidth
				};
				left += val.width;
			}
			var plane = vert ? 'top' : 'left';
			zero[index] = {};
			var start = el.getStyle(plane).toInt();
			zero[index][plane] = start || 0;
			return val;
		}, this);

        this.set(zero);
        newOrder = newOrder.map(i => i.toInt());
        if (newOrder.length != this.elements.length){
			this.currentOrder.each(index => {
				if (!newOrder.contains(index)) newOrder.push(index);
			});
			if (newOrder.length > this.elements.length)
				newOrder.splice(this.elements.length-1, newOrder.length - this.elements.length);
		}
        var margin = top = left = 0;
        newOrder.each((item, index) => {
			var newPos = {};
			if (vert){
				newPos.top = top - current[item].top - margin;
				top += current[item].height;
			} else {
				newPos.left = left - current[item].left;
				left += current[item].width;
			}
			margin = margin + current[item].margin;
			next[item]=newPos;
		}, this);
        var mapped = {};
        Array.clone(newOrder).sort().each(index => {
			mapped[index] = next[index];
		});
        this.start(mapped);
        this.currentOrder = newOrder;

        return this;
    },

	rearrangeDOM(newOrder) {
		newOrder = newOrder || this.currentOrder;
		var parent = this.elements[0].getParent();
		var rearranged = [];
		this.elements.setStyle('opacity', 0);
		//move each element and store the new default order
		newOrder.each(function(index){
			rearranged.push(this.elements[index].inject(parent).setStyles({
				top: 0,
				left: 0
			}));
		}, this);
		this.elements.setStyle('opacity', 1);
		this.elements = $$(rearranged);
		this.setDefaultOrder();
		return this;
	},

	getDefaultOrder() {
		return this.elements.map((el, index) => index);
	},

	forward() {
		return this.sort(this.getDefaultOrder());
	},

	backward() {
		return this.sort(this.getDefaultOrder().reverse());
	},

	reverse() {
		return this.sort(this.currentOrder.reverse());
	},

	sortByElements(elements) {
		return this.sort(elements.map(function(el){
			return this.elements.indexOf(el);
		}, this));
	},

	swap(one, two) {
		if (typeOf(one) == 'element') one = this.elements.indexOf(one);
		if (typeOf(two) == 'element') two = this.elements.indexOf(two);

		var newOrder = Array.clone(this.currentOrder);
		newOrder[this.currentOrder.indexOf(one)] = two;
		newOrder[this.currentOrder.indexOf(two)] = one;

		return this.sort(newOrder);
	}

});


/*
---

script: Drag.js

name: Drag

description: The base Drag Class. Can be used to drag and resize Elements using mouse events.

license: MIT-style license

authors:
  - Valerio Proietti
  - Tom Occhinno
  - Jan Kassens

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Drag]
...

*/

var Drag = new Class({

	Implements: [Events, Options],

	options: {/*
		onBeforeStart: function(thisElement){},
		onStart: function(thisElement, event){},
		onSnap: function(thisElement){},
		onDrag: function(thisElement, event){},
		onCancel: function(thisElement){},
		onComplete: function(thisElement, event){},*/
		snap: 6,
		unit: 'px',
		grid: false,
		style: true,
		limit: false,
		handle: false,
		invert: false,
		preventDefault: false,
		stopPropagation: false,
		modifiers: {x: 'left', y: 'top'}
	},

	initialize(...args) {
		var params = Array.link(args, {
			'options': Type.isObject,
			'element': function(obj){
				return obj != null;
			}
		});

		this.element = document.id(params.element);
		this.document = this.element.getDocument();
		this.setOptions(params.options || {});
		var htype = typeOf(this.options.handle);
		this.handles = ((htype == 'array' || htype == 'collection') ? $$(this.options.handle) : document.id(this.options.handle)) || this.element;
		this.mouse = {'now': {}, 'pos': {}};
		this.value = {'start': {}, 'now': {}};

		this.selection = (Browser.ie) ? 'selectstart' : 'mousedown';


		if (Browser.ie && !Drag.ondragstartFixed){
			document.ondragstart = Function.from(false);
			Drag.ondragstartFixed = true;
		}

		this.bound = {
			start: this.start.bind(this),
			check: this.check.bind(this),
			drag: this.drag.bind(this),
			stop: this.stop.bind(this),
			cancel: this.cancel.bind(this),
			eventStop: Function.from(false)
		};
		this.attach();
	},

	attach() {
		this.handles.addEvent('mousedown', this.bound.start);
		return this;
	},

	detach() {
		this.handles.removeEvent('mousedown', this.bound.start);
		return this;
	},

	start(event) {
        var options = this.options;

        if (event.rightClick) return;

        if (options.preventDefault) event.preventDefault();
        if (options.stopPropagation) event.stopPropagation();
        this.mouse.start = event.page;

        this.fireEvent('beforeStart', this.element);

        var limit = options.limit;
        this.limit = {x: [], y: []};

        var styles = this.element.getStyles('left', 'right', 'top', 'bottom');
        this._invert = {
			x: options.modifiers.x == 'left' && styles.left == 'auto' && !isNaN(styles.right.toInt()) && (options.modifiers.x = 'right'),
			y: options.modifiers.y == 'top' && styles.top == 'auto' && !isNaN(styles.bottom.toInt()) && (options.modifiers.y = 'bottom')
		};

        var z;
        var coordinates;
        for (z in options.modifiers){
			if (!options.modifiers[z]) continue;

			var style = this.element.getStyle(options.modifiers[z]);

			// Some browsers (IE and Opera) don't always return pixels.
			if (style && !style.match(/px$/)){
				if (!coordinates) coordinates = this.element.getCoordinates(this.element.getOffsetParent());
				style = coordinates[options.modifiers[z]];
			}

			if (options.style) this.value.now[z] = (style || 0).toInt();
			else this.value.now[z] = this.element[options.modifiers[z]];

			if (options.invert) this.value.now[z] *= -1;
			if (this._invert[z]) this.value.now[z] *= -1;

			this.mouse.pos[z] = event.page[z] - this.value.now[z];

			if (limit && limit[z]){
				var i = 2;
				while (i--){
					var limitZI = limit[z][i];
					if (limitZI || limitZI === 0) this.limit[z][i] = (typeof limitZI == 'function') ? limitZI() : limitZI;
				}
			}
		}

        if (typeOf(this.options.grid) == 'number') this.options.grid = {
			x: this.options.grid,
			y: this.options.grid
		};

        var events = {
			mousemove: this.bound.check,
			mouseup: this.bound.cancel
		};
        events[this.selection] = this.bound.eventStop;
        this.document.addEvents(events);
    },

	check(event) {
		if (this.options.preventDefault) event.preventDefault();
		var distance = Math.round(Math.sqrt((event.page.x - this.mouse.start.x) ** 2 + (event.page.y - this.mouse.start.y) ** 2));
		if (distance > this.options.snap){
			this.cancel();
			this.document.addEvents({
				mousemove: this.bound.drag,
				mouseup: this.bound.stop
			});
			this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
		}
	},

	drag(event) {
		var options = this.options;

		if (options.preventDefault) event.preventDefault();
		this.mouse.now = event.page;

		for (var z in options.modifiers){
			if (!options.modifiers[z]) continue;
			this.value.now[z] = this.mouse.now[z] - this.mouse.pos[z];

			if (options.invert) this.value.now[z] *= -1;
			if (this._invert[z]) this.value.now[z] *= -1;

			if (options.limit && this.limit[z]){
				if ((this.limit[z][1] || this.limit[z][1] === 0) && (this.value.now[z] > this.limit[z][1])){
					this.value.now[z] = this.limit[z][1];
				} else if ((this.limit[z][0] || this.limit[z][0] === 0) && (this.value.now[z] < this.limit[z][0])){
					this.value.now[z] = this.limit[z][0];
				}
			}

			if (options.grid[z]) this.value.now[z] -= ((this.value.now[z] - (this.limit[z][0]||0)) % options.grid[z]);

			if (options.style) this.element.setStyle(options.modifiers[z], this.value.now[z] + options.unit);
			else this.element[options.modifiers[z]] = this.value.now[z];
		}

		this.fireEvent('drag', [this.element, event]);
	},

	cancel(event) {
		this.document.removeEvents({
			mousemove: this.bound.check,
			mouseup: this.bound.cancel
		});
		if (event){
			this.document.removeEvent(this.selection, this.bound.eventStop);
			this.fireEvent('cancel', this.element);
		}
	},

	stop(event) {
		var events = {
			mousemove: this.bound.drag,
			mouseup: this.bound.stop
		};
		events[this.selection] = this.bound.eventStop;
		this.document.removeEvents(events);
		if (event) this.fireEvent('complete', [this.element, event]);
	}

});

Element.implement({

	makeResizable(options) {
		var drag = new Drag(this, Object.merge({
			modifiers: {
				x: 'width',
				y: 'height'
			}
		}, options));

		this.store('resizer', drag);
		return drag.addEvent('drag', () => {
			this.fireEvent('resize', drag);
		});
	}

});


/*
---

script: Slider.js

name: Slider

description: Class for creating horizontal and vertical slider controls.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Dimensions
  - /Class.Binds
  - /Drag
  - /Element.Measure

provides: [Slider]

...
*/

var Slider = new Class({

	Implements: [Events, Options],

	Binds: ['clickedElement', 'draggedKnob', 'scrolledElement'],

	options: {/*
		onTick: function(intPosition){},
		onChange: function(intStep){},
		onComplete: function(strStep){},*/
		onTick(position) {
			if (this.options.snap) position = this.toPosition(this.step);
			this.knob.setStyle(this.property, position);
		},
		initialStep: 0,
		snap: false,
		offset: 0,
		range: false,
		wheel: false,
		steps: 100,
		mode: 'horizontal'
	},

	initialize(element, knob, options) {
        this.setOptions(options);
        this.element = document.id(element);
        this.knob = document.id(knob);
        this.previousChange = this.previousEnd = this.step = -1;
        var offset;
        var limit = {};
        var modifiers = {'x': false, 'y': false};
        switch (this.options.mode){
			case 'vertical':
				this.axis = 'y';
				this.property = 'top';
				offset = 'offsetHeight';
				break;
			case 'horizontal':
				this.axis = 'x';
				this.property = 'left';
				offset = 'offsetWidth';
		}

        this.full = this.element.measure(() => {
			this.half = this.knob[offset] / 2;
			return this.element[offset] - this.knob[offset] + (this.options.offset * 2);
		});

        this.setRange(this.options.range);

        this.knob.setStyle('position', 'relative').setStyle(this.property, - this.options.offset);
        modifiers[this.axis] = this.property;
        limit[this.axis] = [- this.options.offset, this.full - this.options.offset];

        var dragOptions = {
			snap: 0,
			limit,
			modifiers,
			onDrag: this.draggedKnob,
			onStart: this.draggedKnob,
			onBeforeStart: () => {
				this.isDragging = true;
			},
			onCancel: () => {
				this.isDragging = false;
			},
			onComplete: () => {
				this.isDragging = false;
				this.draggedKnob();
				this.end();
			}
		};
        if (this.options.snap){
			dragOptions.grid = Math.ceil(this.stepWidth);
			dragOptions.limit[this.axis][1] = this.full;
		}

        this.drag = new Drag(this.knob, dragOptions);
        this.attach();
        if (this.options.initialStep != null) this.set(this.options.initialStep)
    },

	attach() {
		this.element.addEvent('mousedown', this.clickedElement);
		if (this.options.wheel) this.element.addEvent('mousewheel', this.scrolledElement);
		this.drag.attach();
		return this;
	},

	detach() {
		this.element.removeEvent('mousedown', this.clickedElement);
		this.element.removeEvent('mousewheel', this.scrolledElement);
		this.drag.detach();
		return this;
	},

	set(step) {
		if (!((this.range > 0) ^ (step < this.min))) step = this.min;
		if (!((this.range > 0) ^ (step > this.max))) step = this.max;

		this.step = Math.round(step);
		this.checkStep();
		this.fireEvent('tick', this.toPosition(this.step));
		this.end();
		return this;
	},

	setRange(range, pos) {
		this.min = Array.pick([range[0], 0]);
		this.max = Array.pick([range[1], this.options.steps]);
		this.range = this.max - this.min;
		this.steps = this.options.steps || this.full;
		this.stepSize = Math.abs(this.range) / this.steps;
		this.stepWidth = this.stepSize * this.full / Math.abs(this.range);
		this.set(Array.pick([pos, this.step]).floor(this.min).max(this.max));
		return this;
	},

	clickedElement(event) {
		if (this.isDragging || event.target == this.knob) return;

		var dir = this.range < 0 ? -1 : 1;
		var position = event.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
		position = position.limit(-this.options.offset, this.full -this.options.offset);

		this.step = Math.round(this.min + dir * this.toStep(position));
		this.checkStep();
		this.fireEvent('tick', position);
		this.end();
	},

	scrolledElement(event) {
		var mode = (this.options.mode == 'horizontal') ? (event.wheel < 0) : (event.wheel > 0);
		this.set(mode ? this.step - this.stepSize : this.step + this.stepSize);
		event.stop();
	},

	draggedKnob() {
		var dir = this.range < 0 ? -1 : 1;
		var position = this.drag.value.now[this.axis];
		position = position.limit(-this.options.offset, this.full -this.options.offset);
		this.step = Math.round(this.min + dir * this.toStep(position));
		this.checkStep();
	},

	checkStep() {
		if (this.previousChange != this.step){
			this.previousChange = this.step;
			this.fireEvent('change', this.step);
		}
	},

	end() {
		if (this.previousEnd !== this.step){
			this.previousEnd = this.step;
			this.fireEvent('complete', this.step + '');
		}
	},

	toStep(position) {
		var step = (position + this.options.offset) * this.stepSize / this.full * this.steps;
		return this.options.steps ? Math.round(step -= step % this.stepSize) : step;
	},

	toPosition(step) {
		return (this.full * Math.abs(this.min - step)) / (this.steps * this.stepSize) - this.options.offset;
	}

});


/*
---

script: Drag.Move.js

name: Drag.Move

description: A Drag extension that provides support for the constraining of draggables to containers and droppables.

license: MIT-style license

authors:
  - Valerio Proietti
  - Tom Occhinno
  - Jan Kassens
  - Aaron Newton
  - Scott Kyle

requires:
  - Core/Element.Dimensions
  - /Drag

provides: [Drag.Move]

...
*/

Drag.Move = new Class({

	Extends: Drag,

	options: {/*
		onEnter: function(thisElement, overed){},
		onLeave: function(thisElement, overed){},
		onDrop: function(thisElement, overed, event){},*/
		droppables: [],
		container: false,
		precalculate: false,
		includeMargins: true,
		checkDroppables: true
	},

	initialize(element, options) {
		this.parent(element, options);
		element = this.element;

		this.droppables = $$(this.options.droppables);
		this.container = document.id(this.options.container);

		if (this.container && typeOf(this.container) != 'element')
			this.container = document.id(this.container.getDocument().body);

		if (this.options.style){
			if (this.options.modifiers.x == "left" && this.options.modifiers.y == "top"){
                var parentStyles;
                var parent = element.getOffsetParent();
                var styles = element.getStyles('left', 'top');
                if (parent && (styles.left == 'auto' || styles.top == 'auto')){
					element.setPosition(element.getPosition(parent));
				}
            }

			if (element.getStyle('position') == 'static') element.setStyle('position', 'absolute');
		}

		this.addEvent('start', this.checkDroppables, true);
		this.overed = null;
	},

	start(event) {
		if (this.container) this.options.limit = this.calculateLimit();

		if (this.options.precalculate){
			this.positions = this.droppables.map(el => el.getCoordinates());
		}

		this.parent(event);
	},

	calculateLimit() {
        var element = this.element;
        var container = this.container;
        var offsetParent = document.id(element.getOffsetParent()) || document.body;
        var containerCoordinates = container.getCoordinates(offsetParent);
        var elementMargin = {};
        var elementBorder = {};
        var containerMargin = {};
        var containerBorder = {};
        var offsetParentPadding = {};

        ['top', 'right', 'bottom', 'left'].each(pad => {
			elementMargin[pad] = element.getStyle('margin-' + pad).toInt();
			elementBorder[pad] = element.getStyle('border-' + pad).toInt();
			containerMargin[pad] = container.getStyle('margin-' + pad).toInt();
			containerBorder[pad] = container.getStyle('border-' + pad).toInt();
			offsetParentPadding[pad] = offsetParent.getStyle('padding-' + pad).toInt();
		}, this);

        var width = element.offsetWidth + elementMargin.left + elementMargin.right;
        var height = element.offsetHeight + elementMargin.top + elementMargin.bottom;
        var left = 0;
        var top = 0;
        var right = containerCoordinates.right - containerBorder.right - width;
        var bottom = containerCoordinates.bottom - containerBorder.bottom - height;

        if (this.options.includeMargins){
			left += elementMargin.left;
			top += elementMargin.top;
		} else {
			right += elementMargin.right;
			bottom += elementMargin.bottom;
		}

        if (element.getStyle('position') == 'relative'){
			var coords = element.getCoordinates(offsetParent);
			coords.left -= element.getStyle('left').toInt();
			coords.top -= element.getStyle('top').toInt();

			left -= coords.left;
			top -= coords.top;
			if (container.getStyle('position') != 'relative'){
				left += containerBorder.left;
				top += containerBorder.top;
			}
			right += elementMargin.left - coords.left;
			bottom += elementMargin.top - coords.top;

			if (container != offsetParent){
				left += containerMargin.left + offsetParentPadding.left;
				top += ((Browser.ie6 || Browser.ie7) ? 0 : containerMargin.top) + offsetParentPadding.top;
			}
		} else {
			left -= elementMargin.left;
			top -= elementMargin.top;
			if (container != offsetParent){
				left += containerCoordinates.left + containerBorder.left;
				top += containerCoordinates.top + containerBorder.top;
			}
		}

        return {
			x: [left, right],
			y: [top, bottom]
		};
    },

	checkDroppables() {
		var overed = this.droppables.filter(function(el, i){
			el = this.positions ? this.positions[i] : el.getCoordinates();
			var now = this.mouse.now;
			return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
		}, this).getLast();

		if (this.overed != overed){
			if (this.overed) this.fireEvent('leave', [this.element, this.overed]);
			if (overed) this.fireEvent('enter', [this.element, overed]);
			this.overed = overed;
		}
	},

	drag(event) {
		this.parent(event);
		if (this.options.checkDroppables && this.droppables.length) this.checkDroppables();
	},

	stop(event) {
		this.checkDroppables();
		this.fireEvent('drop', [this.element, this.overed, event]);
		this.overed = null;
		return this.parent(event);
	}

});

Element.implement({

	makeDraggable(options) {
		var drag = new Drag.Move(this, options);
		this.store('dragger', drag);
		return drag;
	}

});


/*
---

script: Sortables.js

name: Sortables

description: Class for creating a drag and drop sorting interface for lists of items.

license: MIT-style license

authors:
  - Tom Occhino

requires:
  - /Drag.Move

provides: [Sortables]

...
*/

var Sortables = new Class({

	Implements: [Events, Options],

	options: {/*
		onSort: function(element, clone){},
		onStart: function(element, clone){},
		onComplete: function(element){},*/
		snap: 4,
		opacity: 1,
		clone: false,
		revert: false,
		handle: false,
		constrain: false,
		preventDefault: false
	},

	initialize(lists, options) {
		this.setOptions(options);

		this.elements = [];
		this.lists = [];
		this.idle = true;

		this.addLists($$(document.id(lists) || lists));

		if (!this.options.clone) this.options.revert = false;
		if (this.options.revert) this.effect = new Fx.Morph(null, Object.merge({
			duration: 250,
			link: 'cancel'
		}, this.options.revert));
	},

	attach() {
		this.addLists(this.lists);
		return this;
	},

	detach() {
		this.lists = this.removeLists(this.lists);
		return this;
	},

	addItems(...args) {
		Array.flatten(args).each(function(element){
			this.elements.push(element);
			var start = element.retrieve('sortables:start', event => {
				this.start.call(this, event, element);
			});
			(this.options.handle ? element.getElement(this.options.handle) || element : element).addEvent('mousedown', start);
		}, this);
		return this;
	},

	addLists(...args) {
		Array.flatten(args).each(function(list){
			this.lists.push(list);
			this.addItems(list.getChildren());
		}, this);
		return this;
	},

	removeItems(...args) {
		return $$(Array.flatten(args).map(function(element){
			this.elements.erase(element);
			var start = element.retrieve('sortables:start');
			(this.options.handle ? element.getElement(this.options.handle) || element : element).removeEvent('mousedown', start);

			return element;
		}, this));
	},

	removeLists(...args) {
		return $$(Array.flatten(args).map(function(list){
			this.lists.erase(list);
			this.removeItems(list.getChildren());

			return list;
		}, this));
	},

	getClone(event, element) {
		if (!this.options.clone) return new Element(element.tagName).inject(document.body);
		if (typeOf(this.options.clone) == 'function') return this.options.clone.call(this, event, element, this.list);
		var clone = element.clone(true).setStyles({
			margin: 0,
			position: 'absolute',
			visibility: 'hidden',
			width: element.getStyle('width')
		});
		//prevent the duplicated radio inputs from unchecking the real one
		if (clone.get('html').test('radio')){
			clone.getElements('input[type=radio]').each((input, i) => {
				input.set('name', 'clone_' + i);
				if (input.get('checked')) element.getElements('input[type=radio]')[i].set('checked', true);
			});
		}

		return clone.inject(this.list).setPosition(element.getPosition(element.getOffsetParent()));
	},

	getDroppables() {
		var droppables = this.list.getChildren().erase(this.clone).erase(this.element);
		if (!this.options.constrain) droppables.append(this.lists).erase(this.list);
		return droppables;
	},

	insert(dragging, element) {
		var where = 'inside';
		if (this.lists.contains(element)){
			this.list = element;
			this.drag.droppables = this.getDroppables();
		} else {
			where = this.element.getAllPrevious().contains(element) ? 'before' : 'after';
		}
		this.element.inject(element, where);
		this.fireEvent('sort', [this.element, this.clone]);
	},

	start(event, element) {
		if (
			!this.idle ||
			event.rightClick ||
			['button', 'input'].contains(event.target.get('tag'))
		) return;

		this.idle = false;
		this.element = element;
		this.opacity = element.get('opacity');
		this.list = element.getParent();
		this.clone = this.getClone(event, element);

		this.drag = new Drag.Move(this.clone, {
			preventDefault: this.options.preventDefault,
			snap: this.options.snap,
			container: this.options.constrain && this.element.getParent(),
			droppables: this.getDroppables(),
			onSnap: () => {
				event.stop();
				this.clone.setStyle('visibility', 'visible');
				this.element.set('opacity', this.options.opacity || 0);
				this.fireEvent('start', [this.element, this.clone]);
			},
			onEnter: this.insert.bind(this),
			onCancel: this.reset.bind(this),
			onComplete: this.end.bind(this)
		});

		this.clone.inject(this.element, 'before');
		this.drag.start(event);
	},

	end() {
		this.drag.detach();
		this.element.set('opacity', this.opacity);
		if (this.effect){
			var dim = this.element.getStyles('width', 'height');
			var pos = this.clone.computePosition(this.element.getPosition(this.clone.getOffsetParent()));
			this.effect.element = this.clone;
			this.effect.start({
				top: pos.top,
				left: pos.left,
				width: dim.width,
				height: dim.height,
				opacity: 0.25
			}).chain(this.reset.bind(this));
		} else {
			this.reset();
		}
	},

	reset() {
		this.idle = true;
		this.clone.destroy();
		this.fireEvent('complete', this.element);
	},

	serialize(...args) {
		var params = Array.link(args, {
			modifier: Type.isFunction,
			index(obj) {
				return obj != null;
			}
		});
		var serial = this.lists.map(function(list){
			return list.getChildren().map(params.modifier || (element => element.get('id')), this);
		}, this);

		var index = params.index;
		if (this.lists.length == 1) index = 0;
		return (index || index === 0) && index >= 0 && index < this.lists.length ? serial[index] : serial;
	}

});


/*
---

script: Request.JSONP.js

name: Request.JSONP

description: Defines Request.JSONP, a class for cross domain javascript via script injection.

license: MIT-style license

authors:
  - Aaron Newton
  - Guillermo Rauch
  - Arian Stolwijk

requires:
  - Core/Element
  - Core/Request

provides: [Request.JSONP]

...
*/

Request.JSONP = new Class({

	Implements: [Chain, Events, Options],

	options: {
	/*
		onRequest: function(src, scriptElement){},
		onComplete: function(data){},
		onSuccess: function(data){},
		onCancel: function(){},
		onTimeout: function(){},
		onError: function(){}, */
		onRequest(src) {
			if (this.options.log && window.console && console.log){
				console.log('JSONP retrieving script with url:' + src);
			}
		},
		onError(src) {
			if (this.options.log && window.console && console.warn){
				console.warn('JSONP '+ src +' will fail in Internet Explorer, which enforces a 2083 bytes length limit on URIs');
			}
		},
		url: '',
		callbackKey: 'callback',
		injectScript: document.head,
		data: '',
		link: 'ignore',
		timeout: 0,
		log: false
	},

	initialize(options) {
		this.setOptions(options);
	},

	send(options) {
		if (!Request.prototype.check.call(this, options)) return this;
		this.running = true;

		var type = typeOf(options);
		if (type == 'string' || type == 'element') options = {data: options};
		options = Object.merge(this.options, options || {});

		var data = options.data;
		switch (typeOf(data)){
			case 'element': data = document.id(data).toQueryString(); break;
			case 'object': case 'hash': data = Object.toQueryString(data);
		}

		var index = this.index = Request.JSONP.counter++;

		var src = options.url +
			(options.url.test('\\?') ? '&' :'?') +
			(options.callbackKey) +
			'=Request.JSONP.request_map.request_'+ index +
			(data ? '&' + data : '');

		if (src.length > 2083) this.fireEvent('error', src);

		var script = this.getScript(src).inject(options.injectScript);

		this.fireEvent('request', [script.get('src'), script]);

		Request.JSONP.request_map['request_' + index] = function(...args) {
			this.success(args, index);
		}.bind(this);

		if (options.timeout){
			(function(){
				if (this.running) this.fireEvent('timeout', [script.get('src'), script]).fireEvent('failure').cancel();
			}).delay(options.timeout, this);
		}

		return this;
	},

	getScript(src) {
		return this.script = new Element('script', {
			type: 'text/javascript',
			src
		});
	},

	success(args, index) {
		if (!this.running) return false;
		this.clear()
			.fireEvent('complete', args).fireEvent('success', args)
			.callChain();
	},

	cancel() {
		return this.running ? this.clear().fireEvent('cancel') : this;
	},

	isRunning() {
		return !!this.running;
	},

	clear() {
		if (this.script) this.script.destroy();
		this.running = false;
		return this;
	}

});

Request.JSONP.counter = 0;
Request.JSONP.request_map = {};


/*
---

script: Request.Queue.js

name: Request.Queue

description: Controls several instances of Request and its variants to run only one request at a time.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Element
  - Core/Request
  - /Class.Binds

provides: [Request.Queue]

...
*/

Request.Queue = new Class({

	Implements: [Options, Events],

	Binds: ['attach', 'request', 'complete', 'cancel', 'success', 'failure', 'exception'],

	options: {/*
		onRequest: function(argsPassedToOnRequest){},
		onSuccess: function(argsPassedToOnSuccess){},
		onComplete: function(argsPassedToOnComplete){},
		onCancel: function(argsPassedToOnCancel){},
		onException: function(argsPassedToOnException){},
		onFailure: function(argsPassedToOnFailure){},
		onEnd: function(){},
		*/
		stopOnFailure: true,
		autoAdvance: true,
		concurrent: 1,
		requests: {}
	},

	initialize(options) {
		if (options){
			var requests = options.requests;
			delete options.requests;
		}
		this.setOptions(options);
		this.requests = {};
		this.queue = [];
		this.reqBinders = {};

		if (requests) this.addRequests(requests);
	},

	addRequest(name, request) {
		this.requests[name] = request;
		this.attach(name, request);
		return this;
	},

	addRequests(obj) {
		Object.each(obj, function(req, name){
			this.addRequest(name, req);
		}, this);
		return this;
	},

	getName(req) {
		return Object.keyOf(this.requests, req);
	},

	attach(name, req) {
		if (req._groupSend) return this;
		['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function(evt){
			if (!this.reqBinders[name]) this.reqBinders[name] = {};
			this.reqBinders[name][evt] = function(...args) {
				this['on' + evt.capitalize()](...[name, req].append(args));
			}.bind(this);
			req.addEvent(evt, this.reqBinders[name][evt]);
		}, this);
		req._groupSend = req.send;
		req.send = options => {
			this.send(name, options);
			return req;
		};
		return this;
	},

	removeRequest(req) {
		var name = typeOf(req) == 'object' ? this.getName(req) : req;
		if (!name && typeOf(name) != 'string') return this;
		req = this.requests[name];
		if (!req) return this;
		['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function(evt){
			req.removeEvent(evt, this.reqBinders[name][evt]);
		}, this);
		req.send = req._groupSend;
		delete req._groupSend;
		return this;
	},

	getRunning() {
		return Object.filter(this.requests, r => r.running);
	},

	isRunning() {
		return !!(Object.keys(this.getRunning()).length);
	},

	send(name, options) {
		var q = () => {
			this.requests[name]._groupSend(options);
			this.queue.erase(q);
		};

		q.name = name;
		if (Object.keys(this.getRunning()).length >= this.options.concurrent || (this.error && this.options.stopOnFailure)) this.queue.push(q);
		else q();
		return this;
	},

	hasNext(name) {
		return (!name) ? !!this.queue.length : !!this.queue.filter(q => q.name == name).length;
	},

	resume() {
		this.error = false;
		(this.options.concurrent - Object.keys(this.getRunning()).length).times(this.runNext, this);
		return this;
	},

	runNext(name) {
		if (!this.queue.length) return this;
		if (!name){
			this.queue[0]();
		} else {
			var found;
			this.queue.each(q => {
				if (!found && q.name == name){
					found = true;
					q();
				}
			});
		}
		return this;
	},

	runAll() {
		this.queue.each(q => {
			q();
		});
		return this;
	},

	clear(name) {
		if (!name){
			this.queue.empty();
		} else {
			this.queue = this.queue.map(q => {
				if (q.name != name) return q;
				else return false;
			}).filter(q => q);
		}
		return this;
	},

	cancel(name) {
		this.requests[name].cancel();
		return this;
	},

	onRequest(...args) {
		this.fireEvent('request', args);
	},

	onComplete(...args) {
		this.fireEvent('complete', args);
		if (!this.queue.length) this.fireEvent('end');
	},

	onCancel(...args) {
		if (this.options.autoAdvance && !this.error) this.runNext();
		this.fireEvent('cancel', args);
	},

	onSuccess(...args) {
		if (this.options.autoAdvance && !this.error) this.runNext();
		this.fireEvent('success', args);
	},

	onFailure(...args) {
		this.error = true;
		if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
		this.fireEvent('failure', args);
	},

	onException(...args) {
		this.error = true;
		if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
		this.fireEvent('exception', args);
	}

});


/*
---

script: Request.Periodical.js

name: Request.Periodical

description: Requests the same URL to pull data from a server but increases the intervals if no data is returned to reduce the load

license: MIT-style license

authors:
  - Christoph Pojer

requires:
  - Core/Request
  - /MooTools.More

provides: [Request.Periodical]

...
*/

Request.implement({

	options: {
		initialDelay: 5000,
		delay: 5000,
		limit: 60000
	},

	startTimer(data) {
		var fn = function(){
			if (!this.running) this.send({data});
		};
		this.lastDelay = this.options.initialDelay;
		this.timer = fn.delay(this.lastDelay, this);
		this.completeCheck = function(response){
			clearTimeout(this.timer);
			this.lastDelay = (response) ? this.options.delay : (this.lastDelay + this.options.delay).min(this.options.limit);
			this.timer = fn.delay(this.lastDelay, this);
		};
		return this.addEvent('complete', this.completeCheck);
	},

	stopTimer() {
		clearTimeout(this.timer);
		return this.removeEvent('complete', this.completeCheck);
	}

});


/*
---

script: Assets.js

name: Assets

description: Provides methods to dynamically load JavaScript, CSS, and Image files into the document.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Element.Event
  - /MooTools.More

provides: [Assets]

...
*/

var Asset = {

	javascript(source, properties) {
        properties = Object.append({
			document
		}, properties);

        if (properties.onLoad){
			properties.onload = properties.onLoad;
			delete properties.onLoad;
		}

        var script = new Element('script', {src: source, type: 'text/javascript'});
        var load = properties.onload || (() => {});
        var doc = properties.document;
        delete properties.onload;
        delete properties.document;

        return script.addEvents({
			load,
			readystatechange() {
				if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
			}
		}).set(properties).inject(doc.head);
    },

	css(source, properties) {
		properties = properties || {};
		var onload = properties.onload || properties.onLoad;
		if (onload){
			properties.events = properties.events || {};
			properties.events.load = onload;
			delete properties.onload;
			delete properties.onLoad;
		}
		return new Element('link', Object.merge({
			rel: 'stylesheet',
			media: 'screen',
			type: 'text/css',
			href: source
		}, properties)).inject(document.head);
	},

	image(source, properties) {
		properties = Object.merge({
			onload() {},
			onabort() {},
			onerror() {}
		}, properties);
		var image = new Image();
		var element = document.id(image) || new Element('img');
		['load', 'abort', 'error'].each(name => {
			var type = 'on' + name;
			var cap = name.capitalize();
			if (properties['on' + cap]){
				properties[type] = properties['on' + cap];
				delete properties['on' + cap];
			}
			var event = properties[type];
			delete properties[type];
			image[type] = () => {
				if (!image) return;
				if (!element.parentNode){
					element.width = image.width;
					element.height = image.height;
				}
				image = image.onload = image.onabort = image.onerror = null;
				event.delay(1, element, element);
				element.fireEvent(name, element, 1);
			};
		});
		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.set(properties);
	},

	images(sources, options) {
		options = Object.merge({
			onComplete() {},
			onProgress() {},
			onError() {},
			properties: {}
		}, options);
		sources = Array.from(sources);
		var counter = 0;
		return new Elements(sources.map((source, index) => Asset.image(source, Object.append(options.properties, {
            onload() {
                counter++;
                options.onProgress.call(this, counter, index, source);
                if (counter == sources.length) options.onComplete();
            },
            onerror() {
                counter++;
                options.onError.call(this, counter, index, source);
                if (counter == sources.length) options.onComplete();
            }
        }))));
	}

};


/*
---

script: Color.js

name: Color

description: Class for creating and manipulating colors in JavaScript. Supports HSB -> RGB Conversions and vice versa.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - Core/Hash
  - Core/Function

provides: [Color]

...
*/

(function(){

var Color = this.Color = new Type('Color', function(color, type){
	if (arguments.length >= 3){
		type = 'rgb'; color = Array.slice(arguments, 0, 3);
	} else if (typeof color == 'string'){
		if (color.match(/rgb/)) color = color.rgbToHex().hexToRgb(true);
		else if (color.match(/hsb/)) color = color.hsbToRgb();
		else color = color.hexToRgb(true);
	}
	type = type || 'rgb';
	switch (type){
		case 'hsb':
			var old = color;
			color = color.hsbToRgb();
			color.hsb = old;
		break;
		case 'hex': color = color.hexToRgb(true); break;
	}
	color.rgb = color.slice(0, 3);
	color.hsb = color.hsb || color.rgbToHsb();
	color.hex = color.rgbToHex();
	return Object.append(color, this);
});

Color.implement({

	mix(...args) {
		var colors = Array.slice(args);
		var alpha = (typeOf(colors.getLast()) == 'number') ? colors.pop() : 50;
		var rgb = this.slice();
		colors.each(color => {
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb, 'rgb');
	},

	invert() {
		return new Color(this.map(value => 255 - value));
	},

	setHue(value) {
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},

	setSaturation(percent) {
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},

	setBrightness(percent) {
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}

});

var $RGB = (r, g, b) => new Color([r, g, b], 'rgb');

var $HSB = (h, s, b) => new Color([h, s, b], 'hsb');

var $HEX = hex => new Color(hex, 'hex');

Array.implement({

	rgbToHsb() {
        var red = this[0];
        var green = this[1];
        var blue = this[2];
        var hue = 0;
        var max = Math.max(red, green, blue);
        var min = Math.min(red, green, blue);
        var delta = max - min;
        var brightness = max / 255;
        var saturation = (max != 0) ? delta / max : 0;
        if (saturation != 0){
			var rr = (max - red) / delta;
			var gr = (max - green) / delta;
			var br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
        return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
    },

	hsbToRgb() {
		var br = Math.round(this[2] / 100 * 255);
		if (this[1] == 0){
			return [br, br, br];
		} else {
			var hue = this[0] % 360;
			var f = hue % 60;
			var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
			var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
			var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
			switch (Math.floor(hue / 60)){
				case 0: return [br, t, p];
				case 1: return [q, br, p];
				case 2: return [p, br, t];
				case 3: return [p, q, br];
				case 4: return [t, p, br];
				case 5: return [br, p, q];
			}
		}
		return false;
	}

});

String.implement({

	rgbToHsb() {
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHsb() : null;
	},

	hsbToRgb() {
		var hsb = this.match(/\d{1,3}/g);
		return (hsb) ? hsb.hsbToRgb() : null;
	}

});

})();



/*
---

script: Group.js

name: Group

description: Class for monitoring collections of events

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Events
  - /MooTools.More

provides: [Group]

...
*/

(function(){

this.Group = new Class({

	initialize(...args) {
		this.instances = Array.flatten(args);
		this.events = {};
		this.checker = {};
	},

	addEvent(type, fn) {
		this.checker[type] = this.checker[type] || {};
		this.events[type] = this.events[type] || [];
		if (this.events[type].contains(fn)) return false;
		else this.events[type].push(fn);
		this.instances.each(function(instance, i){
			instance.addEvent(type, this.check.pass([type, instance, i], this));
		}, this);
		return this;
	},

	check(type, instance, i) {
		this.checker[type][i] = true;
		var every = this.instances.every(function(current, j){
			return this.checker[type][j] || false;
		}, this);
		if (!every) return;
		this.checker[type] = {};
		this.events[type].each(function(event){
			event.call(this, this.instances, instance);
		}, this);
	}

});

})();



/*
---

script: Hash.Cookie.js

name: Hash.Cookie

description: Class for creating, reading, and deleting Cookies in JSON format.

license: MIT-style license

authors:
  - Valerio Proietti
  - Aaron Newton

requires:
  - Core/Cookie
  - Core/JSON
  - /MooTools.More
  - /Hash

provides: [Hash.Cookie]

...
*/

Hash.Cookie = new Class({

	Extends: Cookie,

	options: {
		autoSave: true
	},

	initialize(name, options) {
		this.parent(name, options);
		this.load();
	},

	save() {
		var value = JSON.encode(this.hash);
		if (!value || value.length > 4096) return false; //cookie would be truncated!
		if (value == '{}') this.dispose();
		else this.write(value);
		return true;
	},

	load() {
		this.hash = new Hash(JSON.decode(this.read(), true));
		return this;
	}

});

Hash.each(Hash.prototype, (method, name) => {
	if (typeof method == 'function') Hash.Cookie.implement(name, function(...args) {
		var value = method.apply(this.hash, args);
		if (this.options.autoSave) this.save();
		return value;
	});
});


/*
---

script: HtmlTable.js

name: HtmlTable

description: Builds table elements with methods to add rows.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Options
  - Core/Events
  - /Class.Occlude

provides: [HtmlTable]

...
*/

var HtmlTable = new Class({

	Implements: [Options, Events, Class.Occlude],

	options: {
		properties: {
			cellpadding: 0,
			cellspacing: 0,
			border: 0
		},
		rows: [],
		headers: [],
		footers: []
	},

	property: 'HtmlTable',

	initialize(...args) {
		var params = Array.link(args, {options: Type.isObject, table: Type.isElement});
		this.setOptions(params.options);
		this.element = params.table || new Element('table', this.options.properties);
		if (this.occlude()) return this.occluded;
		this.build();
	},

	build() {
		this.element.store('HtmlTable', this);

		this.body = document.id(this.element.tBodies[0]) || new Element('tbody').inject(this.element);
		$$(this.body.rows);

		if (this.options.headers.length) this.setHeaders(this.options.headers);
		else this.thead = document.id(this.element.tHead);
		if (this.thead) this.head = document.id(this.thead.rows[0]);

		if (this.options.footers.length) this.setFooters(this.options.footers);
		this.tfoot = document.id(this.element.tFoot);
		if (this.tfoot) this.foot = document.id(this.tfoot.rows[0]);

		this.options.rows.each(function(row){
			this.push(row);
		}, this);

		['adopt', 'inject', 'wraps', 'grab', 'replaces', 'dispose'].each(function(method){
				this[method] = this.element[method].bind(this.element);
		}, this);
	},

	toElement() {
		return this.element;
	},

	empty() {
		this.body.empty();
		return this;
	},

	set(what, items) {
		var target = (what == 'headers') ? 'tHead' : 'tFoot';
		this[target.toLowerCase()] = (document.id(this.element[target]) || new Element(target.toLowerCase()).inject(this.element, 'top')).empty();
		var data = this.push(items, {}, this[target.toLowerCase()], what == 'headers' ? 'th' : 'td');
		if (what == 'headers') this.head = document.id(this.thead.rows[0]);
		else this.foot = document.id(this.thead.rows[0]);
		return data;
	},

	setHeaders(headers) {
		this.set('headers', headers);
		return this;
	},

	setFooters(footers) {
		this.set('footers', footers);
		return this;
	},

	push(row, rowProperties, target, tag) {
		if (typeOf(row) == "element" && row.get('tag') == 'tr'){
			row.inject(target || this.body);
			return {
				tr: row,
				tds: row.getChildren('td')
			};
		}
		var tds = row.map(data => {
            var td = new Element(tag || 'td', data ? data.properties : {});
            var type = (data ? data.content : '') || data;
            var element = document.id(type);
            if (typeOf(type) != 'string' && element) td.adopt(element);
			else td.set('html', type);

            return td;
        });

		return {
			tr: new Element('tr', rowProperties).inject(target || this.body).adopt(tds),
			tds
		};
	}

});


/*
---

script: HtmlTable.Zebra.js

name: HtmlTable.Zebra

description: Builds a stripy table with methods to add rows.

license: MIT-style license

authors:
  - Harald Kirschner
  - Aaron Newton

requires:
  - /HtmlTable
  - /Class.refactor

provides: [HtmlTable.Zebra]

...
*/

HtmlTable = Class.refactor(HtmlTable, {

	options: {
		classZebra: 'table-tr-odd',
		zebra: true
	},

	initialize(...args) {
		this.previous(...args);
		if (this.occluded) return this.occluded;
		if (this.options.zebra) this.updateZebras();
	},

	updateZebras() {
		Array.each(this.body.rows, this.zebra, this);
	},

	zebra(row, i) {
		return row[((i % 2) ? 'remove' : 'add')+'Class'](this.options.classZebra);
	},

	push(...args) {
		var pushed = this.previous(...args);
		if (this.options.zebra) this.updateZebras();
		return pushed;
	}

});


/*
---

script: HtmlTable.Sort.js

name: HtmlTable.Sort

description: Builds a stripy, sortable table with methods to add rows.

license: MIT-style license

authors:
  - Harald Kirschner
  - Aaron Newton

requires:
  - Core/Hash
  - /HtmlTable
  - /Class.refactor
  - /Element.Delegation
  - /String.Extras
  - /Date

provides: [HtmlTable.Sort]

...
*/

HtmlTable = Class.refactor(HtmlTable, {

	options: {/*
		onSort: function(){}, */
		sortIndex: 0,
		sortReverse: false,
		parsers: [],
		defaultParser: 'string',
		classSortable: 'table-sortable',
		classHeadSort: 'table-th-sort',
		classHeadSortRev: 'table-th-sort-rev',
		classNoSort: 'table-th-nosort',
		classGroupHead: 'table-tr-group-head',
		classGroup: 'table-tr-group',
		classCellSort: 'table-td-sort',
		classSortSpan: 'table-th-sort-span',
		sortable: false
	},

	initialize(...args) {
		this.previous(...args);
		if (this.occluded) return this.occluded;
		this.sorted = {index: null, dir: 1};
		this.bound = {
			headClick: this.headClick.bind(this)
		};
		this.sortSpans = new Elements();
		if (this.options.sortable){
			this.enableSort();
			if (this.options.sortIndex != null) this.sort(this.options.sortIndex, this.options.sortReverse);
		}
	},

	attachSorts(attach) {
		this.element.removeEvents('click:relay(th)');
		this.element[attach !== false ? 'addEvent' : 'removeEvent']('click:relay(th)', this.bound.headClick);
	},

	setHeaders(...args) {
		this.previous(...args);
		if (this.sortEnabled) this.detectParsers();
	},

	detectParsers(force) {
        if (!this.head) return;
        var parsers = this.options.parsers;
        var rows = this.body.rows;

        // auto-detect
        this.parsers = $$(this.head.cells).map(function(cell, index){
            if (!force && (cell.hasClass(this.options.classNoSort) || cell.retrieve('htmltable-parser'))) return cell.retrieve('htmltable-parser');
            var thDiv = new Element('div');
            Array.each(cell.childNodes, node => {
				thDiv.adopt(node);
			});
            thDiv.inject(cell);
            var sortSpan = new Element('span', {'html': '&#160;', 'class': this.options.classSortSpan}).inject(thDiv, 'top');

            this.sortSpans.push(sortSpan);

            var parser = parsers[index];
            var cancel;
            switch (typeOf(parser)){
				case 'function': parser = {convert: parser}; cancel = true; break;
				case 'string': parser = parser; cancel = true; break;
			}
            if (!cancel){
				Object.some(HtmlTable.Parsers, current => {
					var match = current.match;
					if (!match) return false;
					for (var i = 0, j = rows.length; i < j; i++){
						var cell = document.id(rows[i].cells[index]);
						var text = cell ? cell.get('html').clean() : '';
						if (text && match.test(text)){
							parser = current;
							return true;
						}
					}
				});
			}

            if (!parser) parser = this.options.defaultParser;
            cell.store('htmltable-parser', parser);
            return parser;
        }, this);
    },

	headClick(event, el) {
		if (!this.head || el.hasClass(this.options.classNoSort)) return;
		var index = Array.indexOf(this.head.cells, el);
		this.sort(index);
		return false;
	},

	sort(index, reverse, pre) {
        if (!this.head) return;
        var classCellSort = this.options.classCellSort;
        var classGroup = this.options.classGroup;
        var classGroupHead = this.options.classGroupHead;

        if (!pre){
			if (index != null){
				if (this.sorted.index == index){
					this.sorted.reverse = !(this.sorted.reverse);
				} else {
					if (this.sorted.index != null){
						this.sorted.reverse = false;
						this.head.cells[this.sorted.index].removeClass(this.options.classHeadSort).removeClass(this.options.classHeadSortRev);
					} else {
						this.sorted.reverse = true;
					}
					this.sorted.index = index;
				}
			} else {
				index = this.sorted.index;
			}

			if (reverse != null) this.sorted.reverse = reverse;

			var head = document.id(this.head.cells[index]);
			if (head){
				head.addClass(this.options.classHeadSort);
				if (this.sorted.reverse) head.addClass(this.options.classHeadSortRev);
				else head.removeClass(this.options.classHeadSortRev);
			}

			this.body.getElements('td').removeClass(this.options.classCellSort);
		}

        var parser = this.parsers[index];
        if (typeOf(parser) == 'string') parser = HtmlTable.Parsers[parser];
        if (!parser) return;

        if (!Browser.ie){
			var rel = this.body.getParent();
			this.body.dispose();
		}

        var data = Array.map(this.body.rows, (row, i) => {
			var value = parser.convert.call(document.id(row.cells[index]));

			return {
				position: i,
				value,
				toString() {
					return value.toString();
				}
			};
		}, this);
        data.reverse(true);

        data.sort((a, b) => {
			if (a.value === b.value) return 0;
			return a.value > b.value ? 1 : -1;
		});

        if (!this.sorted.reverse) data.reverse(true);

        var i = data.length;
        var body = this.body;
        var j;
        var position;
        var entry;
        var group;

        while (i){
			var item = data[--i];
			position = item.position;
			var row = body.rows[position];
			if (row.disabled) continue;

			if (!pre){
				if (group === item.value){
					row.removeClass(classGroupHead).addClass(classGroup);
				} else {
					group = item.value;
					row.removeClass(classGroup).addClass(classGroupHead);
				}
				if (this.options.zebra) this.zebra(row, i);

				row.cells[index].addClass(classCellSort);
			}

			body.appendChild(row);
			for (j = 0; j < i; j++){
				if (data[j].position > position) data[j].position--;
			}
		}
        data = null;
        if (rel) rel.grab(body);

        return this.fireEvent('sort', [body, index]);
    },

	reSort() {
		if (this.sortEnabled) this.sort.call(this, this.sorted.index, this.sorted.reverse);
		return this;
	},

	enableSort() {
		this.element.addClass(this.options.classSortable);
		this.attachSorts(true);
		this.detectParsers();
		this.sortEnabled = true;
		return this;
	},

	disableSort() {
		this.element.removeClass(this.options.classSortable);
		this.attachSorts(false);
		this.sortSpans.each(span => { span.destroy(); });
		this.sortSpans.empty();
		this.sortEnabled = false;
		return this;
	}

});

HtmlTable.Parsers = {

	'date': {
		match: /^\d{2}[-\/ ]\d{2}[-\/ ]\d{2,4}$/,
		convert() {
			var d = Date.parse(this.get('text').stripTags());
			return (typeOf(d) == 'date') ? d.format('db') : '';
		},
		type: 'date'
	},
	'input-checked': {
		match: / type="(radio|checkbox)" /,
		convert() {
			return this.getElement('input').checked;
		}
	},
	'input-value': {
		match: /<input/,
		convert() {
			return this.getElement('input').value;
		}
	},
	'number': {
		match: /^\d+[^\d.,]*$/,
		convert() {
			return this.get('text').stripTags().toInt();
		},
		number: true
	},
	'numberLax': {
		match: /^[^\d]+\d+$/,
		convert() {
			return this.get('text').replace(/[^-?^0-9]/, '').stripTags().toInt();
		},
		number: true
	},
	'float': {
		match: /^[\d]+\.[\d]+/,
		convert() {
			return this.get('text').replace(/[^-?^\d.]/, '').stripTags().toFloat();
		},
		number: true
	},
	'floatLax': {
		match: /^[^\d]+[\d]+\.[\d]+$/,
		convert() {
			return this.get('text').replace(/[^-?^\d.]/, '').stripTags();
		},
		number: true
	},
	'string': {
		match: null,
		convert() {
			return this.get('text').stripTags();
		}
	},
	'title': {
		match: null,
		convert() {
			return this.title;
		}
	}

};



HtmlTable.defineParsers = parsers => {
	HtmlTable.Parsers = Object.append(HtmlTable.Parsers, parsers);
};


/*
---

name: Element.Event.Pseudos.Keys

description: Adds functionallity fire events if certain keycombinations are pressed

license: MIT-style license

authors:
  - Arian Stolwijk

requires: [Element.Event.Pseudos]

provides: [Element.Event.Pseudos.Keys]

...
*/

((() => {
    var keysStoreKey = '$moo:keys-pressed';
    var keysKeyupStoreKey = '$moo:keys-keyup';


    Event.definePseudo('keys', function(split, fn, args){
        var event = args[0];
        var keys = [];
        var pressed = this.retrieve(keysStoreKey, []);

        keys.append(split.value.replace('++', () => {
            keys.push('+'); // shift++ and shift+++a
            return '';
        }).split('+'));

        pressed.include(event.key);

        if (keys.every(key => pressed.contains(key))) fn.apply(this, args);

        this.store(keysStoreKey, pressed);

        if (!this.retrieve(keysKeyupStoreKey)){
            var keyup = function(event){
                (function(){
                    pressed = this.retrieve(keysStoreKey, []).erase(event.key);
                    this.store(keysStoreKey, pressed);
                }).delay(0, this); // Fix for IE
            };
            this.store(keysKeyupStoreKey, keyup).addEvent('keyup', keyup);
        }
    });

    Object.append(Event.Keys, {
        'shift': 16,
        'control': 17,
        'alt': 18,
        'capslock': 20,
        'pageup': 33,
        'pagedown': 34,
        'end': 35,
        'home': 36,
        'numlock': 144,
        'scrolllock': 145,
        ';': 186,
        '=': 187,
        ',': 188,
        '-': Browser.firefox ? 109 : 189,
        '.': 190,
        '/': 191,
        '`': 192,
        '[': 219,
        '\\': 220,
        ']': 221,
        "'": 222,
        '+': 107
    });
}))();


/*
---

script: Keyboard.js

name: Keyboard

description: KeyboardEvents used to intercept events on a class for keyboard and format modifiers in a specific order so as to make alt+shift+c the same as shift+alt+c.

license: MIT-style license

authors:
  - Perrin Westrich
  - Aaron Newton
  - Scott Kyle

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Element.Event.Pseudos.Keys

provides: [Keyboard]

...
*/

(function(){

	var Keyboard = this.Keyboard = new Class({

		Extends: Events,

		Implements: [Options],

		options: {/*
			onActivate: function(){},
			onDeactivate: function(){},*/
			defaultEventType: 'keydown',
			active: false,
			manager: null,
			events: {},
			nonParsedEvents: ['activate', 'deactivate', 'onactivate', 'ondeactivate', 'changed', 'onchanged']
		},

		initialize(options) {
			if (options && options.manager){
				this.manager = options.manager;
				delete options.manager;
			}
			this.setOptions(options);
			this.setup();
		},
		setup() {
			this.addEvents(this.options.events);
			//if this is the root manager, nothing manages it
			if (Keyboard.manager && !this.manager) Keyboard.manager.manage(this);
			if (this.options.active) this.activate();
		},

		handle(event, type) {
			//Keyboard.stop(event) prevents key propagation
			if (event.preventKeyboardPropagation) return;

			var bubbles = !!this.manager;
			if (bubbles && this.activeKB){
				this.activeKB.handle(event, type);
				if (event.preventKeyboardPropagation) return;
			}
			this.fireEvent(type, event);

			if (!bubbles && this.activeKB) this.activeKB.handle(event, type);
		},

		addEvent(type, fn, internal) {
			return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn, internal);
		},

		removeEvent(type, fn) {
			return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn);
		},

		toggleActive() {
			return this[this.isActive() ? 'deactivate' : 'activate']();
		},

		activate(instance) {
			if (instance){
				if (instance.isActive()) return this;
				//if we're stealing focus, store the last keyboard to have it so the relinquish command works
				if (this.activeKB && instance != this.activeKB){
					this.previous = this.activeKB;
					this.previous.fireEvent('deactivate');
				}
				//if we're enabling a child, assign it so that events are now passed to it
				this.activeKB = instance.fireEvent('activate');
				Keyboard.manager.fireEvent('changed');
			} else if (this.manager){
				//else we're enabling ourselves, we must ask our parent to do it for us
				this.manager.activate(this);
			}
			return this;
		},

		isActive() {
			return this.manager ? (this.manager.activeKB == this) : (Keyboard.manager == this);
		},

		deactivate(instance) {
			if (instance){
				if (instance === this.activeKB){
					this.activeKB = null;
					instance.fireEvent('deactivate');
					Keyboard.manager.fireEvent('changed');
				}
			} else if (this.manager){
				this.manager.deactivate(this);
			}
			return this;
		},

		relinquish() {
			if (this.isActive() && this.manager && this.manager.previous) this.manager.activate(this.manager.previous);
		},

		//management logic
		manage(instance) {
			if (instance.manager && instance.manager != Keyboard.manager && this != Keyboard.manager) instance.manager.drop(instance);
			this.instances.push(instance);
			instance.manager = this;
			if (!this.activeKB) this.activate(instance);
		},

		_disable(instance) {
			if (this.activeKB == instance) this.activeKB = null;
		},

		drop(instance) {
			this._disable(instance);
			this.instances.erase(instance);
			Keyboard.manager.manage(instance);
			if (this.activeKB == instance && this.previous && this.instances.contains(this.previous)) this.activate(this.previous);
		},

		instances: [],

		trace() {
			Keyboard.trace(this);
		},

		each(fn) {
			Keyboard.each(this, fn);
		}

	});

	var parsed = {};
	var modifiers = ['shift', 'control', 'alt', 'meta'];
	var regex = /^(?:shift|control|ctrl|alt|meta)$/;

	Keyboard.parse = (type, eventType, ignore) => {
		if (ignore && ignore.contains(type.toLowerCase())) return type;

		type = type.toLowerCase().replace(/^(keyup|keydown):/, ($0, $1) => {
			eventType = $1;
			return '';
		});

		if (!parsed[type]){
            var key;
            var mods = {};
            type.split('+').each(part => {
				if (regex.test(part)) mods[part] = true;
				else key = part;
			});

            mods.control = mods.control || mods.ctrl; // allow both control and ctrl

            var keys = [];
            modifiers.each(mod => {
				if (mods[mod]) keys.push(mod);
			});

            if (key) keys.push(key);
            parsed[type] = keys.join('+');
        }

		return eventType + ':keys(' + parsed[type] + ')';
	};

	Keyboard.each = (keyboard, fn) => {
		var current = keyboard || Keyboard.manager;
		while (current){
			fn.run(current);
			current = current.activeKB;
		}
	};

	Keyboard.stop = event => {
		event.preventKeyboardPropagation = true;
	};

	Keyboard.manager = new Keyboard({
		active: true
	});

	Keyboard.trace = keyboard => {
		keyboard = keyboard || Keyboard.manager;
		var hasConsole = window.console && console.log;
		if (hasConsole) console.log('the following items have focus: ');
		Keyboard.each(keyboard, current => {
			if (hasConsole) console.log(document.id(current.widget) || current.wiget || current);
		});
	};

	var handler = event => {
		var keys = [];
		modifiers.each(mod => {
			if (event[mod]) keys.push(mod);
		});

		if (!regex.test(event.key)) keys.push(event.key);
		Keyboard.manager.handle(event, event.type + ':keys(' + keys.join('+') + ')');
	};

	document.addEvents({
		'keyup': handler,
		'keydown': handler
	});

})();


/*
---

script: Keyboard.Extras.js

name: Keyboard.Extras

description: Enhances Keyboard by adding the ability to name and describe keyboard shortcuts, and the ability to grab shortcuts by name and bind the shortcut to different keys.

license: MIT-style license

authors:
  - Perrin Westrich

requires:
  - /Keyboard
  - /MooTools.More

provides: [Keyboard.Extras]

...
*/
Keyboard.prototype.options.nonParsedEvents.combine(['rebound', 'onrebound']);

Keyboard.implement({

	/*
		shortcut should be in the format of:
		{
			'keys': 'shift+s', // the default to add as an event.
			'description': 'blah blah blah', // a brief description of the functionality.
			'handler': function(){} // the event handler to run when keys are pressed.
		}
	*/
	addShortcut(name, shortcut) {
		this.shortcuts = this.shortcuts || [];
		this.shortcutIndex = this.shortcutIndex || {};

		shortcut.getKeyboard = Function.from(this);
		shortcut.name = name;
		this.shortcutIndex[name] = shortcut;
		this.shortcuts.push(shortcut);
		if (shortcut.keys) this.addEvent(shortcut.keys, shortcut.handler);
		return this;
	},

	addShortcuts(obj) {
		for (var name in obj) this.addShortcut(name, obj[name]);
		return this;
	},

	removeShortcut(name) {
		var shortcut = this.getShortcut(name);
		if (shortcut && shortcut.keys){
			this.removeEvent(shortcut.keys, shortcut.handler);
			delete this.shortcutIndex[name];
			this.shortcuts.erase(shortcut);
		}
		return this;
	},

	removeShortcuts(names) {
		names.each(this.removeShortcut, this);
		return this;
	},

	getShortcuts() {
		return this.shortcuts || [];
	},

	getShortcut(name) {
		return (this.shortcutIndex || {})[name];
	}

});

Keyboard.rebind = (newKeys, shortcuts) => {
	Array.from(shortcuts).each(shortcut => {
		shortcut.getKeyboard().removeEvent(shortcut.keys, shortcut.handler);
		shortcut.getKeyboard().addEvent(newKeys, shortcut.handler);
		shortcut.keys = newKeys;
		shortcut.getKeyboard().fireEvent('rebound');
	});
};


Keyboard.getActiveShortcuts = keyboard => {
    var activeKBS = [];
    var activeSCS = [];
    Keyboard.each(keyboard, [].push.bind(activeKBS));
    activeKBS.each(kb => { activeSCS.extend(kb.getShortcuts()); });
    return activeSCS;
};

Keyboard.getShortcut = (name, keyboard, opts) => {
    opts = opts || {};
    var shortcuts = opts.many ? [] : null;

    var set = opts.many ? kb => {
            var shortcut = kb.getShortcut(name);
            if (shortcut) shortcuts.push(shortcut);
        } : kb => {
            if (!shortcuts) shortcuts = kb.getShortcut(name);
        };

    Keyboard.each(keyboard, set);
    return shortcuts;
};

Keyboard.getShortcuts = (name, keyboard) => Keyboard.getShortcut(name, keyboard, { many: true });


/*
---

script: HtmlTable.Select.js

name: HtmlTable.Select

description: Builds a stripy, sortable table with methods to add rows. Rows can be selected with the mouse or keyboard navigation.

license: MIT-style license

authors:
  - Harald Kirschner
  - Aaron Newton

requires:
  - /Keyboard
  - /Keyboard.Extras
  - /HtmlTable
  - /Class.refactor
  - /Element.Delegation
  - /Element.Shortcuts

provides: [HtmlTable.Select]

...
*/

HtmlTable = Class.refactor(HtmlTable, {

	options: {
		/*onRowFocus: function(){},
		onRowUnfocus: function(){},*/
		useKeyboard: true,
		classRowSelected: 'table-tr-selected',
		classRowHovered: 'table-tr-hovered',
		classSelectable: 'table-selectable',
		shiftForMultiSelect: true,
		allowMultiSelect: true,
		selectable: false
	},

	initialize(...args) {
		this.previous(...args);
		if (this.occluded) return this.occluded;

		this._selectedRows = new Elements();

		this._bound = {
			mouseleave: this._mouseleave.bind(this),
			clickRow: this._clickRow.bind(this)
		};

		if (this.options.selectable) this.enableSelect();
	},

	enableSelect() {
		this._selectEnabled = true;
		this._attachSelects();
		this.element.addClass(this.options.classSelectable);
	},

	disableSelect() {
		this._selectEnabled = false;
		this._attachSelects(false);
		this.element.removeClass(this.options.classSelectable);
	},

	push(...args) {
		var ret = this.previous(...args);
		this._updateSelects();
		return ret;
	},

	isSelected(row) {
		return this._selectedRows.contains(row);
	},

	toggleRow(row) {
		return this[(this.isSelected(row) ? 'de' : '') + 'selectRow'](row);
	},

	selectRow(row, _nocheck) {
		//private variable _nocheck: boolean whether or not to confirm the row is in the table body
		//added here for optimization when selecting ranges
		if (this.isSelected(row) || (!_nocheck && !this.body.getChildren().contains(row))) return;
		if (!this.options.allowMultiSelect) this.selectNone();

		if (!this.isSelected(row)){
			this._selectedRows.push(row);
			row.addClass(this.options.classRowSelected);
			this.fireEvent('rowFocus', [row, this._selectedRows]);
		}

		this._focused = row;
		document.clearSelection();

		return this;
	},

	deselectRow(row, _nocheck) {
		if (!this.isSelected(row) || (!_nocheck && !this.body.getChildren().contains(row))) return;

		this._selectedRows = new Elements(Array.from(this._selectedRows).erase(row));
		row.removeClass(this.options.classRowSelected);
		this.fireEvent('rowUnfocus', [row, this._selectedRows]);

		return this;
	},

	selectAll(selectNone) {
		if (!selectNone && !this.options.allowMultiSelect) return;
		this.selectRange(0, this.body.rows.length, selectNone);
		return this;
	},

	selectNone() {
		return this.selectAll(true);
	},

	selectRange(startRow, endRow, _deselect) {
        if (!this.options.allowMultiSelect && !_deselect) return;
        var method = _deselect ? 'deselectRow' : 'selectRow';
        var rows = Array.clone(this.body.rows);

        if (typeOf(startRow) == 'element') startRow = rows.indexOf(startRow);
        if (typeOf(endRow) == 'element') endRow = rows.indexOf(endRow);
        endRow = endRow < rows.length - 1 ? endRow : rows.length - 1;

        if (endRow < startRow){
			var tmp = startRow;
			startRow = endRow;
			endRow = tmp;
		}

        for(var i = startRow; i <= endRow; i++) this[method](rows[i], true);

        return this;
    },

	deselectRange(startRow, endRow) {
		this.selectRange(startRow, endRow, true);
	},

/*
	Private methods:
*/

	_enterRow(row) {
		if (this._hovered) this._hovered = this._leaveRow(this._hovered);
		this._hovered = row.addClass(this.options.classRowHovered);
	},

	_leaveRow(row) {
		row.removeClass(this.options.classRowHovered);
	},

	_updateSelects() {
		Array.each(this.body.rows, function(row){
			var binders = row.retrieve('binders');
			if ((binders && this._selectEnabled) || (!binders && !this._selectEnabled)) return;
			if (!binders){
				binders = {
					mouseenter: this._enterRow.pass([row], this),
					mouseleave: this._leaveRow.pass([row], this)
				};
				row.store('binders', binders).addEvents(binders);
			} else {
				row.removeEvents(binders);
			}
		}, this);
	},

	_shiftFocus(offset, event) {
		if (!this._focused) return this.selectRow(this.body.rows[0], event);
		var to = this._getRowByOffset(offset);
		if (to === null || this._focused == this.body.rows[to]) return this;
		this.toggleRow(this.body.rows[to], event);
	},

	_clickRow(event, row) {
		var selecting = (event.shift || event.meta || event.control) && this.options.shiftForMultiSelect;
		if (!selecting && !(event.rightClick && this.isSelected(row) && this.options.allowMultiSelect)) this.selectNone();

		if (event.rightClick) this.selectRow(row);
		else this.toggleRow(row);

		if (event.shift){
			this.selectRange(this._rangeStart || this.body.rows[0], row, this._rangeStart ? !this.isSelected(row) : true);
			this._focused = row;
		}
		this._rangeStart = row;
	},

	_getRowByOffset(offset) {
        if (!this._focused) return 0;
        var rows = Array.clone(this.body.rows);
        var index = rows.indexOf(this._focused) + offset;

        if (index < 0) index = null;
        if (index >= rows.length) index = null;

        return index;
    },

	_attachSelects(attach) {
		attach = attach != null ? attach : true;

		var method = attach ? 'addEvents' : 'removeEvents';
		this.element[method]({
			mouseleave: this._bound.mouseleave
		});

		this.body[method]({
			'click:relay(tr)': this._bound.clickRow,
			'contextmenu:relay(tr)': this._bound.clickRow
		});

		if (this.options.useKeyboard || this.keyboard){
			if (!this.keyboard){
                var timer;
                var held;

                var move = offset => {
					var mover = e => {
						clearTimeout(timer);
						e.preventDefault();

						var to = this.body.rows[this._getRowByOffset(offset)];
						if (e.shift && to && this.isSelected(to)){
							this.deselectRow(this._focused);
							this._focused = to;
						} else {
							if (to && (!this.options.allowMultiSelect || !e.shift)){
								this.selectNone();
							}
							this._shiftFocus(offset, e);
						}

						if (held){
							timer = mover.delay(100, this, e);
						} else {
							timer = ((() => {
								held = true;
								mover(e);
							})).delay(400);
						}
					};
					return mover;
				};

                var clear = () => {
					clearTimeout(timer);
					held = false;
				};

                this.keyboard = new Keyboard({
					events: {
						'keydown:shift+up': move(-1),
						'keydown:shift+down': move(1),
						'keyup:shift+up': clear,
						'keyup:shift+down': clear,
						'keyup:up': clear,
						'keyup:down': clear
					},
					active: true
				});

                var shiftHint = '';
                if (this.options.allowMultiSelect && this.options.shiftForMultiSelect && this.options.useKeyboard){
					shiftHint = " (Shift multi-selects).";
				}

                this.keyboard.addShortcuts({
					'Select Previous Row': {
						keys: 'up',
						shortcut: 'up arrow',
						handler: move(-1),
						description: 'Select the previous row in the table.' + shiftHint
					},
					'Select Next Row': {
						keys: 'down',
						shortcut: 'down arrow',
						handler: move(1),
						description: 'Select the next row in the table.' + shiftHint
					}
				});
            }
			this.keyboard[attach ? 'activate' : 'deactivate']();
		}
		this._updateSelects();
	},

	_mouseleave() {
		if (this._hovered) this._leaveRow(this._hovered);
	}

});


/*
---

script: Scroller.js

name: Scroller

description: Class which scrolls the contents of any Element (including the window) when the mouse reaches the Element's boundaries.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Core/Element.Dimensions

provides: [Scroller]

...
*/

var Scroller = new Class({

	Implements: [Events, Options],

	options: {
		area: 20,
		velocity: 1,
		onChange(x, y) {
			this.element.scrollTo(x, y);
		},
		fps: 50
	},

	initialize(element, options) {
		this.setOptions(options);
		this.element = document.id(element);
		this.docBody = document.id(this.element.getDocument().body);
		this.listener = (typeOf(this.element) != 'element') ? this.docBody : this.element;
		this.timer = null;
		this.bound = {
			attach: this.attach.bind(this),
			detach: this.detach.bind(this),
			getCoords: this.getCoords.bind(this)
		};
	},

	start() {
		this.listener.addEvents({
			mouseenter: this.bound.attach,
			mouseleave: this.bound.detach
		});
		return this;
	},

	stop() {
		this.listener.removeEvents({
			mouseenter: this.bound.attach,
			mouseleave: this.bound.detach
		});
		this.detach();
		this.timer = clearInterval(this.timer);
		return this;
	},

	attach() {
		this.listener.addEvent('mousemove', this.bound.getCoords);
	},

	detach() {
		this.listener.removeEvent('mousemove', this.bound.getCoords);
		this.timer = clearInterval(this.timer);
	},

	getCoords(event) {
		this.page = (this.listener.get('tag') == 'body') ? event.client : event.page;
		if (!this.timer) this.timer = this.scroll.periodical(Math.round(1000 / this.options.fps), this);
	},

	scroll() {
        var size = this.element.getSize();
        var scroll = this.element.getScroll();
        var pos = this.element != this.docBody ? this.element.getOffsets() : {x: 0, y:0};
        var scrollSize = this.element.getScrollSize();
        var change = {x: 0, y: 0};
        var top = this.options.area.top || this.options.area;
        var bottom = this.options.area.bottom || this.options.area;
        for (var z in this.page){
			if (this.page[z] < (top + pos[z]) && scroll[z] != 0){
				change[z] = (this.page[z] - top - pos[z]) * this.options.velocity;
			} else if (this.page[z] + bottom > (size[z] + pos[z]) && scroll[z] + size[z] != scrollSize[z]){
				change[z] = (this.page[z] - size[z] + bottom - pos[z]) * this.options.velocity;
			}
			change[z] = change[z].round();
		}
        if (change.y || change.x) this.fireEvent('change', [scroll.x + change.x, scroll.y + change.y]);
    }

});


/*
---

script: Tips.js

name: Tips

description: Class for creating nice tips that follow the mouse cursor when hovering an element.

license: MIT-style license

authors:
  - Valerio Proietti
  - Christoph Pojer
  - Luis Merino

requires:
  - Core/Options
  - Core/Events
  - Core/Element.Event
  - Core/Element.Style
  - Core/Element.Dimensions
  - /MooTools.More

provides: [Tips]

...
*/

(function(){

var read = (option, element) => (option) ? (typeOf(option) == 'function' ? option(element) : element.get(option)) : '';

this.Tips = new Class({

	Implements: [Events, Options],

	options: {/*
		onAttach: function(element){},
		onDetach: function(element){},
		onBound: function(coords){},*/
		onShow() {
			this.tip.setStyle('display', 'block');
		},
		onHide() {
			this.tip.setStyle('display', 'none');
		},
		title: 'title',
		text(element) {
			return element.get('rel') || element.get('href');
		},
		showDelay: 100,
		hideDelay: 100,
		className: 'tip-wrap',
		offset: {x: 16, y: 16},
		windowPadding: {x:0, y:0},
		fixed: false
	},

	initialize(...args) {
		var params = Array.link(args, {
			options: Type.isObject,
			elements(obj) {
				return obj != null;
			}
		});
		this.setOptions(params.options);
		if (params.elements) this.attach(params.elements);
		this.container = new Element('div', {'class': 'tip'});
	},

	toElement() {
		if (this.tip) return this.tip;

		this.tip = new Element('div', {
			'class': this.options.className,
			styles: {
				position: 'absolute',
				top: 0,
				left: 0
			}
		}).adopt(
			new Element('div', {'class': 'tip-top'}),
			this.container,
			new Element('div', {'class': 'tip-bottom'})
		);

		return this.tip;
	},

	attach(elements) {
		$$(elements).each(function(element){
            var title = read(this.options.title, element);
            var text = read(this.options.text, element);

            element.set('title', '').store('tip:native', title).retrieve('tip:title', title);
            element.retrieve('tip:text', text);
            this.fireEvent('attach', [element]);

            var events = ['enter', 'leave'];
            if (!this.options.fixed) events.push('move');

            events.each(function(value){
				var event = element.retrieve('tip:' + value);
				if (!event) event = event => {
					this['element' + value.capitalize()](...[event, element]);
				};

				element.store('tip:' + value, event).addEvent('mouse' + value, event);
			}, this);
        }, this);

		return this;
	},

	detach(elements) {
		$$(elements).each(function(element){
			['enter', 'leave', 'move'].each(value => {
				element.removeEvent('mouse' + value, element.retrieve('tip:' + value)).eliminate('tip:' + value);
			});

			this.fireEvent('detach', [element]);

			if (this.options.title == 'title'){ // This is necessary to check if we can revert the title
				var original = element.retrieve('tip:native');
				if (original) element.set('title', original);
			}
		}, this);

		return this;
	},

	elementEnter(event, element) {
		this.container.empty();

		['title', 'text'].each(function(value){
			var content = element.retrieve('tip:' + value);
			if (content) this.fill(new Element('div', {'class': 'tip-' + value}).inject(this.container), content);
		}, this);

		clearTimeout(this.timer);
		this.timer = (function(){
			this.show(element);
			this.position((this.options.fixed) ? {page: element.getPosition()} : event);
		}).delay(this.options.showDelay, this);
	},

	elementLeave(event, element) {
		clearTimeout(this.timer);
		this.timer = this.hide.delay(this.options.hideDelay, this, element);
		this.fireForParent(event, element);
	},

	fireForParent(event, element) {
		element = element.getParent();
		if (!element || element == document.body) return;
		if (element.retrieve('tip:enter')) element.fireEvent('mouseenter', event);
		else this.fireForParent(event, element);
	},

	elementMove(event, element) {
		this.position(event);
	},

	position(event) {
        if (!this.tip) document.id(this);

        var size = window.getSize();
        var scroll = window.getScroll();
        var tip = {x: this.tip.offsetWidth, y: this.tip.offsetHeight};
        var props = {x: 'left', y: 'top'};
        var bounds = {y: false, x2: false, y2: false, x: false};
        var obj = {};

        for (var z in props){
			obj[props[z]] = event.page[z] + this.options.offset[z];
			if (obj[props[z]] < 0) bounds[z] = true;
			if ((obj[props[z]] + tip[z] - scroll[z]) > size[z] - this.options.windowPadding[z]){
				obj[props[z]] = event.page[z] - this.options.offset[z] - tip[z];
				bounds[z+'2'] = true;
			}
		}

        this.fireEvent('bound', bounds);
        this.tip.setStyles(obj);
    },

	fill(element, contents) {
		if (typeof contents == 'string') element.set('html', contents);
		else element.adopt(contents);
	},

	show(element) {
		if (!this.tip) document.id(this);
		if (!this.tip.getParent()) this.tip.inject(document.body);
		this.fireEvent('show', [this.tip, element]);
	},

	hide(element) {
		if (!this.tip) document.id(this);
		this.fireEvent('hide', [this.tip, element]);
	}

});

})();

