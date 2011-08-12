/**
 * Formats the number according to the format string; adheres to the american number standard
 * where a comma is inserted after every 3 digits. note: there should be only 1 contiguous number
 * in the format, where a number consists of digits, period, and commas
 * any other characters can be wrapped around this number, including ?$?, ?%?, or text
 * <div style="margin-left:40px">examples (123456.789):
 * <div style="margin-left:10px">
 * ?0? - (123456) show only digits, no precision<br>
 * ?0.00? - (123456.78) show only digits, 2 precision<br>
 * ?0.0000? - (123456.7890) show only digits, 4 precision<br>
 * ?0,000? - (123,456) show comma and digits, no precision<br>
 * ?0,000.00? - (123,456.78) show comma and digits, 2 precision<br>
 * ?0,0.00? - (123,456.78) shortcut method, show comma and digits, 2 precision<br>
 * </div</div>
 *
 * @method format
 * @param v {Number} The number to format.
 * @param format {String} The way you would like to format this text.
 * @param position (String) The which side of price left|right
 * @return {String} The formatted number.
 * @public
 */
Ext.apply(Ext.util.Format, {
	numberFormat: {
		decimalSeparator: '.',
		decimalPrecision: 2,
		groupingSeparator: ',',
		groupingSize: 3,
		currencySymbol: ' TL',
		currencyPostion: 'right'
	},
	formatNumber: function(value, numberFormat) {
		var format = Ext.apply(Ext.apply({}, this.numberFormat), numberFormat);
		if (typeof value !== 'number') {
			value = String(value);
			if (format.currencySymbol) {
				value = value.replace(format.currencySymbol, '');
			}
			if (format.groupingSeparator) {
				value = value.replace(new RegExp(format.groupingSeparator, 'g'), '');
			}
			if (format.decimalSeparator !== '.') {
				value = value.replace(format.decimalSeparator, '.');
			}
			value = parseFloat(value);
		}
		var neg = value < 0;
		value = Math.abs(value).toFixed(format.decimalPrecision);
		var i = value.indexOf('.');
		if (i >= 0) {
			if (format.decimalSeparator !== '.') {
				value = value.slice(0, i) + format.decimalSeparator + value.slice(i + 1);
			}
		} else {
			i = value.length;
		}
		if (format.groupingSeparator) {
			while (i > format.groupingSize) {
				i -= format.groupingSize;
				value = value.slice(0, i) + format.groupingSeparator + value.slice(i);
			}
		}
		if (format.currencySymbol) {
			value = (format.currencyPostion=='left') ? format.currencySymbol + value : value + format.currencySymbol;
		}
		if (neg) {
			value = '-' + value;
		}
		return value;
	}
});